import React from "react";
import SessionComponent from "./SessionComponent";
import * as filmAction from "../filmAction";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {bindActionCreators} from 'redux';
import Pagination from "../../../components/common/Pagination";
import Loading from "../../../components/common/Loading";
import TooltipButton from "../../../components/common/TooltipButton";
import Search from "../../../components/common/Search";
import {Panel} from "react-bootstrap";
import FormInputDate from "../../../components/common/FormInputDate";
import * as helper from "../../../helpers/helper";


class AllSessionContainer extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.path = '';
        this.state = {
            type: "edit",
            link: "/film/session",
            openFilter: false,
            filter: {
                startTime: "",
                endTime: "",
            },
            page: 1,
            query: '',
        };
        this.timeOut = null;
        this.loadOrders = this.loadOrders.bind(this);
        this.allSessionSearchChange = this.allSessionSearchChange.bind(this);
        this.updateFormFilter  = this.updateFormFilter.bind(this);
    }
    componentWillMount(){
        if(!helper.isEmptyInput(this.props.search)){
            this.setState({
                query: this.props.search,
                page: 1
            });
        }
    }
    loadOrders(page = 1) {
        this.setState({page: page});
        this.props.filmAction.loadAllSessions(page);
    }

    updateFormFilter(event) {
        const field = event.target.name;
        let filter = {...this.state.filter};
        filter[field] = event.target.value;
        if (!helper.isEmptyInput(filter.startTime) && !helper.isEmptyInput(filter.endTime)){
            this.setState({filter: filter, page: 1});
            this.props.filmAction.loadAllSessions(this.state.page, this.state.query, filter.startTime, filter.endTime);
        }
        else {
            this.setState({filter: filter});
        }

    }

    allSessionSearchChange(value){
        this.setState({
            query: value,
            page: 1
        });
        if (this.timeOut !== null) {
            clearTimeout(this.timeOut);
        }
        this.timeOut = setTimeout(function () {
            this.props.filmAction.loadAllSessions(1, value);
        }.bind(this), 500);
    }

    render() {
        let first = this.props.totalCountAll ? (this.props.currentPageAll - 1) * this.props.limitAll + 1 : 0;
        let end = this.props.currentPageAll < this.props.totalPagesAll ? this.props.currentPageAll * this.props.limitAll : this.props.totalCountAll;
        return (
            <div className="card">
                <div className="card-content">
                    <div className="tab-content">
                        <div className="flex-row flex">
                            <h4 className="card-title">
                                <strong>Danh sách tất cả suất chiếu</strong>
                            </h4>
                            <div>
                                <TooltipButton
                                    placement="top"
                                    text="Thêm suất chiếu">
                                    <button
                                        className="btn btn-primary btn-round btn-xs button-add none-margin"
                                        type="button"
                                        onClick={() => {
                                            this.props.filmAction.toggleSessionModal();
                                            this.props.filmAction.handleSessionModal({});
                                        }}>

                                        <strong>+</strong>
                                    </button>
                                </TooltipButton>
                            </div>
                            <div>
                                <TooltipButton
                                    placement="top"
                                    text="Lọc">
                                    <button
                                        className="btn btn-primary btn-round btn-xs button-add none-margin"
                                        type="button"
                                        onClick={() => this.setState({openFilter: !this.state.openFilter,})}>
                                        <i className="material-icons" style={{margin: "0px -4px", top: 0}}>
                                            filter_list
                                        </i>
                                    </button>
                                </TooltipButton>
                            </div>
                        </div>


                        <Search
                            onChange={this.allSessionSearchChange}
                            value={this.state.query}
                            placeholder="Nhập tên phim để tìm kiếm"
                        />
                        <Panel collapsible expanded={this.state.openFilter}>
                            <div className="row">
                                {/*<div className="col-md-3">*/}
                                    {/*<br/>*/}
                                    {/*<label className="label-control">Tên phim</label>*/}
                                    {/*<Select*/}
                                        {/*disabled={false}*/}
                                        {/*value={''}*/}
                                        {/*options={this.props.allFilms.map((film) => {*/}
                                            {/*return {*/}
                                                {/*...film,*/}
                                                {/*value: film.id,*/}
                                                {/*label: film.name*/}
                                            {/*};*/}
                                        {/*})}*/}
                                        {/*onChange={() => {*/}
                                        {/*}}*/}

                                    {/*/>*/}
                                {/*</div>*/}
                                <div className="col-md-4">
                                    <FormInputDate
                                        label="Từ ngày"
                                        name="startTime"
                                        updateFormData={this.updateFormFilter}
                                        id="form-start-time"
                                        value={this.state.filter.startTime}
                                        maxDate={this.state.filter.endTime}
                                    />
                                </div>
                                <div className="col-md-4">
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
                        </Panel>
                        <br/>

                    </div>
                    <div>
                        {
                            this.props.isLoadingAllSessions ? <Loading/> :
                                <SessionComponent
                                    sessions={this.props.allSessions}/>
                        }
                        <br/>
                        <div className="row float-right">
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12"
                                 style={{textAlign: 'right'}}>
                                <b style={{marginRight: '15px'}}>
                                    Hiển thị kêt quả từ {first}
                                    - {end}/{this.props.totalCountAll}</b><br/>
                                <Pagination
                                    totalPages={this.props.totalPagesAll}
                                    currentPage={this.props.currentPageAll}
                                    loadDataPage={this.loadOrders}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

AllSessionContainer.propTypes = {
    allSessions: PropTypes.array.isRequired,
    allFilms: PropTypes.array.isRequired,
    search: PropTypes.string.isRequired,
    filmAction: PropTypes.object.isRequired,
    isLoadingAllSessions: PropTypes.bool.isRequired,
    totalCountAll: PropTypes.number.isRequired,
    totalPagesAll: PropTypes.number.isRequired,
    limitAll: PropTypes.oneOfType([
        PropTypes.number.isRequired,
        PropTypes.string.isRequired
    ]),
    currentPageAll: PropTypes.number.isRequired,
};

function mapStateToProps(state) {
    return {
        allSessions: state.film.allSessions,
        allFilms: state.film.allFilms,
        isLoadingAllSessions: state.film.isLoadingAllSessions,
        totalCountAll: state.film.totalCountAll,
        totalPagesAll: state.film.totalPagesAll,
        currentPageAll: state.film.currentPageAll,
        limitAll: state.film.limitAll,
        search: state.film.search,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        filmAction: bindActionCreators(filmAction, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(AllSessionContainer);