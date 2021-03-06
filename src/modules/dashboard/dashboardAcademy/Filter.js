import React from 'react';
import {observer} from 'mobx-react';
import filterStore from "./filterStore";
import DateRangePicker from "../../../components/common/DateTimePicker";
import ItemReactSelect from "../../../components/common/ItemReactSelect";
import ReactSelect from "react-select";
import PropTypes from "prop-types";
import {bindActionCreators} from "redux";
import * as baseActions from "../../../actions/baseActions";
import {connect} from "react-redux";
import moment from "moment";
import Loading from "../../../components/common/Loading";
import {DATE_FORMAT_SQL} from "../../../constants/constants";
import * as userActions from "../../../actions/userActions";
import * as loginActions from "../../../modules/login/loginActions";
import {showTypeNotification} from "../../../helpers/helper";

@observer
class Filter extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    componentDidMount() {
    }

    changeDateRangePicker = (start_time, end_time) => {
        filterStore.filter = {...filterStore.filter, start_time, end_time, gen_id: 0};
        this.load();
    }

    onChangeGen = (value) => {
        const gen_id = value ? value.value : 0;

        if (value) {
            filterStore.filter.start_time = moment(value.start_time);
            filterStore.filter.end_time = moment(value.end_time);
        }

        filterStore.filter = {...filterStore.filter, gen_id};
        this.load();
    }

    onChangeCourse = (value) => {
        const course_id = value ? value.value : 0;
        filterStore.filter = {...filterStore.filter, course_id};
        this.load();
    }

    onChangeStatus = (value) => {
        const status_id = value ? value.value : 0;

        filterStore.filter = {...filterStore.filter, status_id};
        this.load();
    }


    onChangeBase = (value) => {
        const base_id = value ? value.value : 0;
        filterStore.filter = {...filterStore.filter, base_id};
        this.props.baseActions.selectedBase(base_id);
    }

    onChangeProvince = (value) => {
        const provinceId = value ? value.value : 0;
        let user = {...this.props.user};
        user.choice_province_id = provinceId;
        localStorage.setItem("user", JSON.stringify(user));
        showTypeNotification("Đang thay đổi thành phố", "info");
        userActions.choiceProvince(provinceId, false, () => {
            this.props.loginActions.getUserLocal();
        });
    }

    onChangeStaff = (value, field) => {
        const staff_id = value ? value.value : 0;
        filterStore.filter = {...filterStore.filter, [field + '_id']: staff_id, [field]: value};
        this.load();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.selectedBaseId !== this.props.selectedBaseId) {
            filterStore.filter = {...filterStore.filter, base_id: nextProps.selectedBaseId};
            this.load();
        }
        if (nextProps.user.choice_province_id !== this.props.user.choice_province_id) {
            filterStore.filter = {...filterStore.filter, base_id: nextProps.selectedBaseId};
            this.load();
        }
    }

    getBasesData = () => {
        let {bases, user} = this.props;
        let basesData = bases ? bases.filter((base) => {
            if (user && user.choice_province_id > 0) {
                return base.district.province.id == user.choice_province_id;
            } else {
                return true;
            }
        }).map((base) => {
            return {value: base.id, label: base.name};
        }) : [];
        basesData = [{value: 0, label: "Tất cả cơ sở"}, ...basesData];
        return basesData;
    }

    getProvincesData = () => {
        let {provinces} = this.props;
        return [{value: 0, label: "Tất cả thành phố"}, ...provinces.map((province) => {
            return {value: province.id, label: province.name};
        })];
    }

    load = () => {
        const filter = {...filterStore.filter};
        filter.start_time = filterStore.filter.start_time.format(DATE_FORMAT_SQL);
        filter.end_time = filterStore.filter.end_time.format(DATE_FORMAT_SQL);
        this.props.loadData(filter);
    }


    render() {
        let {filter, gensData, isLoading, coursesData,classStatusesData} = filterStore;
        let {selectedBaseId, user, } = this.props;
        if (isLoading) return (
            <div className="row gutter-20 margin-top-20">
                <Loading/>
            </div>
        );
        return (
            <div className="row gutter-20 margin-top-20">
                <div className="col-md-3">
                    <DateRangePicker
                        className="background-white padding-vertical-10px cursor-pointer margin-bottom-20"
                        start={filter.start_time} end={filter.end_time}
                        style={{padding: '5px 10px 5px 20px', lineHeight: '33px'}}
                        onChange={this.changeDateRangePicker}
                    />
                </div>
                <div className="col-md-3">
                    <ReactSelect
                        value={filter.gen_id}
                        options={gensData}
                        onChange={this.onChangeGen}
                        className="react-select-white-light-round cursor-pointer margin-bottom-20"
                        placeholder="Chọn khóa"
                        clearable={false}
                    />
                </div>

                <div className="col-md-3">
                    <ReactSelect
                        value={user && user.choice_province_id ? user.choice_province_id : 0}
                        options={this.getProvincesData()}
                        onChange={this.onChangeProvince}
                        className="react-select-white-light-round cursor-pointer margin-bottom-20"
                        placeholder="Chọn thành phố"
                        clearable={false}
                    />
                </div>

                <div className="col-md-3">
                    <ReactSelect
                        value={selectedBaseId}
                        options={this.getBasesData()}
                        onChange={this.onChangeBase}
                        className="react-select-white-light-round cursor-pointer margin-bottom-20"
                        placeholder="Chọn cơ sở"
                        clearable={false}
                    />
                </div>

                <div className="col-md-3">
                    <ReactSelect
                        value={filter.course_id}
                        options={coursesData}
                        onChange={this.onChangeCourse}
                        className="react-select-white-light-round cursor-pointer margin-bottom-20"
                        placeholder="Chọn khóa học"
                        clearable={false}
                    />
                </div>


                <div className="col-md-3">
                    <ReactSelect
                        value={filter.status_id}
                        options={classStatusesData}
                        onChange={this.onChangeStatus}
                        className="react-select-white-light-round cursor-pointer margin-bottom-20"
                        placeholder="Chọn trạng thái"
                        clearable={false}
                    />
                </div>


                <div className="col-md-3">
                    <ReactSelect.Async
                        loadOptions={(p1, p2) => filterStore.loadStaffs(p1, p2, 'teacher')}
                        loadingPlaceholder="Đang tải..."
                        className="react-select-white-light-round cursor-pointer margin-bottom-20"
                        placeholder="Chọn giảng viên"
                        searchPromptText="Không có dữ liệu nhân viên"
                        onChange={e=>this.onChangeStaff(e,'teacher')}
                        value={filter.teacher}
                        optionRenderer={(option) => {
                            return (
                                <ItemReactSelect label={option.label}
                                                 url={option.avatar_url}/>
                            );
                        }}
                        valueRenderer={(option) => {
                            return (
                                <ItemReactSelect label={option.label}
                                                 url={option.avatar_url}/>
                            );
                        }}
                    />
                </div>
                <div className="col-md-3">
                    <ReactSelect.Async
                        loadOptions={(p1, p2) => filterStore.loadStaffs(p1, p2, 'teaching_assistant')}
                        loadingPlaceholder="Đang tải..."
                        className="react-select-white-light-round cursor-pointer margin-bottom-20"
                        placeholder="Chọn trợ giảng"
                        searchPromptText="Không có dữ liệu nhân viên"
                        onChange={e=>this.onChangeStaff(e,'teaching_assistant')}
                        value={filter.teaching_assistant}
                        optionRenderer={(option) => {
                            return (
                                <ItemReactSelect label={option.label}
                                                 url={option.avatar_url}/>
                            );
                        }}
                        valueRenderer={(option) => {
                            return (
                                <ItemReactSelect label={option.label}
                                                 url={option.avatar_url}/>
                            );
                        }}
                    />
                </div>
            </div>
        );
    }
}

Filter.propTypes = {
    selectedBaseId: PropTypes.number,
    baseActions: PropTypes.object,
    loginActions: PropTypes.object,
    loadData: PropTypes.func.render,
    user: PropTypes.object,
};

function

mapStateToProps(state) {
    return {
        selectedBaseId: state.global.selectedBaseId,
        bases: state.global.bases,
        provinces: state.global.provinces,
        user: state.login.user,
    };
}

function

mapDispatchToProps(dispatch) {
    return {
        baseActions: bindActionCreators(baseActions, dispatch),
        loginActions: bindActionCreators(loginActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Filter);
