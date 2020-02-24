/**
 * Created by phanmduong on 9/3/17.
 */
import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Select from '../../components/common/Select';
import Loading from '../../components/common/Loading';
import * as dashboardActions from './dashboardActions';
import DashboardComponent from './DashboardComponent';
import {Panel} from 'react-bootstrap';
import PropTypes from 'prop-types';
import FormInputDate from "../../components/common/FormInputDate";
import * as helper from '../../helpers/helper';

class DashboardContainer extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            selectGenId: 0,
            selectedBaseId: 0,
            gens: [],
            bases: [],
            filter: {
                startTime: '',
                endTime: '',
            }
        };
        this.onChangeGen = this.onChangeGen.bind(this);
        this.onChangeBase = this.onChangeBase.bind(this);
        this.loadInitDashboard = this.loadInitDashboard.bind(this);
        this.updateFormFilter = this.updateFormFilter.bind(this);
    }

    componentWillMount() {
        this.props.dashboardActions.loadGensData();
        this.props.dashboardActions.loadBasesData();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.isLoadingGens !== this.props.isLoadingGens && !nextProps.isLoadingGens) {
            this.setState({
                gens: this.getGens(nextProps.gens),
                selectGenId: nextProps.currentGen.id
            });
        }
        if (nextProps.isLoadingBases !== this.props.isLoadingBases && !nextProps.isLoadingBases) {
            this.setState({
                bases: this.getBases(nextProps.bases),
            });
        }
        if (nextProps.selectedBaseId !== this.props.selectedBaseId) {
            this.setState({
                selectedBaseId:nextProps.selectedBaseId,
            });
            this.loadDashboard(this.state.selectGenId,nextProps.selectedBaseId,);

        }
    }

    detailTotalRegisterByGen = (total) => {
        this.props.dashboardActions.loadDetailTotalRegister(total, this.state.selectedBaseId, this.state.selectGenId, "gen");
    }

    detailTotalRegisterByCourse = (courseId) => {
        this.props.dashboardActions.loadDetailTotalRegister(courseId, this.state.selectedBaseId, this.state.selectGenId, "course");
    }

    loadStudyPackRegisters = (search = '', filter = '', filter_status = 1, page = 1) => {
        this.props.dashboardActions.loadStudyPackRegister(this.state.selectGenId, this.state.selectedBaseId, search, filter, filter_status, page);
    }

    getGens(gens) {
        return gens.map(function (gen) {
            return {
                key: gen.id,
                value: 'Khóa ' + gen.name
            };
        });
    }

    getBases(bases) {
        let baseData = bases.map(function (base) {
            return {
                key: base.id,
                value: base.name
            };
        });
        this.setState({selectedBaseId: 0});
        return [{
            key: 0,
            value: 'Tất cả'
        }, ...baseData];
    }

    loadInitDashboard() {
        this.loadDashboard(this.state.selectGenId, this.state.selectedBaseId);
    }

    loadDashboard(genId, baseId, startTime, endTime) {
        if (genId <= 0) return;
        if (baseId === 0) {
            this.props.dashboardActions.loadDashboardData(genId, '', startTime, endTime);
        }
        else {
            this.props.dashboardActions.loadDashboardData(genId, baseId, startTime, endTime);
        }
    }

    onChangeGen(value) {
        this.setState({selectGenId: value});
        this.loadDashboard(value, this.state.selectedBaseId);
    }

    onChangeBase(value) {
        this.setState({selectedBaseId: value});
        this.loadDashboard(this.state.selectGenId, value);
    }

    updateFormFilter(event) {
        const field = event.target.name;
        let filter = {...this.state.filter};
        filter[field] = event.target.value;

        if (!helper.isEmptyInput(filter.startTime) && !helper.isEmptyInput(filter.endTime)) {
            this.loadDashboard(this.state.selectGenId, this.state.selectedBaseId, filter.startTime, filter.endTime);
        }
        this.setState({filter: filter});
    }

    render() {
        return (
            <div>

                {this.props.isLoadingGens || this.props.isLoadingBases ? <Loading/> :
                    (
                        <div>
                            <div className="row">
                                <div className="col-sm-3 col-xs-5">
                                    <Select
                                        defaultMessage={'Chọn khóa học'}
                                        options={this.state.gens}
                                        value={this.state.selectGenId}
                                        onChange={this.onChangeGen}
                                    />
                                </div>
                                <div className="col-sm-3 col-xs-5">
                                    <Select
                                        defaultMessage={'Chọn cơ sở'}
                                        options={this.state.bases}
                                        value={this.state.selectedBaseId}
                                        onChange={this.onChangeBase}
                                    />
                                </div>
                                <div className="col-sm-2">
                                    <button className="btn btn-info btn-rose btn-round"
                                            style={{width: "100%"}}
                                            onClick={() => this.setState({openFilter: !this.state.openFilter})}>
                                        <i className="material-icons">filter_list</i>
                                        Lọc
                                    </button>
                                </div>
                            </div>
                            <Panel collapsible expanded={this.state.openFilter}>
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="card">
                                            <div className="card-content">
                                                <div className="tab-content">
                                                    <h4 className="card-title">
                                                        <strong>Bộ lọc</strong>
                                                    </h4>
                                                    <br/>
                                                </div>
                                                <div className="row">
                                                    <div className="col-md-3">
                                                        <FormInputDate
                                                            label="Từ ngày"
                                                            name="startTime"
                                                            updateFormData={this.updateFormFilter}
                                                            id="form-start-time"
                                                            value={this.state.filter.startTime}
                                                            maxDate={this.state.filter.endTime}
                                                        />
                                                    </div>
                                                    <div className="col-md-3">
                                                        <FormInputDate
                                                            label="Đến ngày"
                                                            name="endTime"
                                                            updateFormData={this.updateFormFilter}
                                                            id="form-end-time"
                                                            value={this.state.filter.endTime}
                                                            minDate={this.state.filter.startTime}

                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Panel>
                            <DashboardComponent
                                {...this.props}
                                loadDashboard={this.loadInitDashboard}
                                loadStudyPackRegisters={this.loadStudyPackRegisters}
                                detailTotalRegisterByGen={this.detailTotalRegisterByGen}
                                detailTotalRegisterByCourse={this.detailTotalRegisterByCourse}
                            />
                        </div>
                    )
                }
            </div>
        )
            ;
    }
}

DashboardContainer.propTypes = {
    gens: PropTypes.array.isRequired,
    dashboardActions: PropTypes.object.isRequired,
    bases: PropTypes.array.isRequired,
    isLoadingGens: PropTypes.bool.isRequired,
    isLoadingBases: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired,
    currentGen: PropTypes.object.isRequired,
    dashboard: PropTypes.object.isRequired,
    studyPack: PropTypes.object.isRequired,
    isLoadingUserSP: PropTypes.bool.isRequired,
    users: PropTypes.array.isRequired,
};

function mapStateToProps(state) {
    return {
        gens: state.dashboardStudyPack.gens,
        isLoadingGens: state.dashboardStudyPack.isLoadingGens,
        currentGen: state.dashboardStudyPack.currentGen,
        bases: state.dashboardStudyPack.bases,
        isLoadingBases: state.dashboardStudyPack.isLoadingBases,
        isLoading: state.dashboardStudyPack.isLoading,
        dashboard: state.dashboardStudyPack.dashboard,
        studyPack: state.dashboardStudyPack.studyPack,
        isLoadingUserSP: state.dashboardStudyPack.studyPack.isLoadingUserSP,
        users: state.dashboardStudyPack.studyPack.users,
        selectedBaseId: state.global.selectedBaseId,

    };
}

function mapDispatchToProps(dispatch) {
    return {
        dashboardActions: bindActionCreators(dashboardActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(DashboardContainer);
