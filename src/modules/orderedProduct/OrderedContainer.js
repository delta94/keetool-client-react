/**
 * Created by Nguyen Tien Tai on 01/10/18.
 */
import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Search from '../../components/common/Search';
import FormInputDate from '../../components/common/FormInputDate';
import TooltipButton from '../../components/common/TooltipButton';
import ListOrder from './ListOrder';
import * as helper from '../../helpers/helper';
import PropTypes from 'prop-types';
import Select from 'react-select';
import Pagination from "../../components/common/Pagination";
import {ORDER_STATUS} from "../../constants/constants";
import Loading from "../../components/common/Loading";
import * as orderedProductAction from "./orderedProductAction";

class OrderedContainer extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            page: 1,
            query: '',
            time: {
                startTime: '',
                endTime: ''
            },
            staff_id: null,
            user_id: null
        };
        this.timeOut = null;
        this.orderedSearchChange = this.orderedSearchChange.bind(this);
        this.loadOrders = this.loadOrders.bind(this);
        this.updateFormDate = this.updateFormDate.bind(this);
    }

    componentWillMount() {
        this.props.orderedProductAction.loadAllOrders();
    }

    orderedSearchChange(value) {
        this.setState({
            page: 1,
            query: value
        });
        if (this.timeOut !== null) {
            clearTimeout(this.timeOut);
        }
        this.timeOut = setTimeout(function () {
            this.props.orderedProductAction.loadAllOrders(
                1,
                value,
                this.state.time.startTime,
                this.state.time.endTime,
                this.state.staff_id,
                this.state.user_id
            );
        }.bind(this), 500);
    }

    loadOrders(page = 1) {
        this.setState({page: page});
        this.props.orderedProductAction.loadAllOrders(
            page,
            this.state.query,
            this.state.time.startTime,
            this.state.time.endTime,
            this.state.staff_id,
            this.state.user_id
        );
    }

    updateFormDate(event) {
        const field = event.target.name;
        let time = {...this.state.time};
        time[field] = event.target.value;
        if (!helper.isEmptyInput(time.startTime) && !helper.isEmptyInput(time.endTime)) {
            this.props.orderedProductAction.loadAllOrders(
                1,
                this.state.query,
                time.startTime,
                time.endTime,
                this.state.staff_id,
                this.state.user_id
            );
            this.setState({time: time, page: 1});
        } else {
            this.setState({time: time});
        }
    }

    render() {
        let first = this.props.totalCount ? (this.props.currentPage - 1) * 10 + 1 : 0;
        let end = this.props.currentPage < this.props.totalPages ? this.props.currentPage * 10 : this.props.totalCount;
        return (
            <div>
                <div className="row">
                    <div className="col-md-12">
                        <div className="flex flex-row flex-space-between">
                            <div>
                                <TooltipButton text="Bán hàng" placement="top">
                                    <button className="btn btn-rose">Bán hàng</button>
                                </TooltipButton>
                                <TooltipButton text="Đặt hàng" placement="top">
                                    <button className="btn btn-rose">Đặt hàng</button>
                                </TooltipButton>
                            </div>
                            <div>
                                <TooltipButton text="In dưới dạng pdf" placement="top">
                                    <button className="btn btn-success">
                                        <i className="material-icons">print</i> In
                                    </button>
                                </TooltipButton>
                                <TooltipButton text="Lưu dưới dạng excel" placement="top">
                                    <button className="btn btn-info">
                                        <i className="material-icons">save</i> Lưu về máy
                                    </button>
                                </TooltipButton>
                                <button rel="tooltip" data-placement="top" title="" data-original-title="Remove item"
                                        type="button" className="btn btn-info">
                                    <i className="material-icons">save</i> Lưu về máy
                                </button>
                            </div>
                        </div>
                    </div>
                    <div>
                        {
                            this.props.isLoading ? (
                                <Loading/>
                            ) : (
                                <div>
                                    <div className="col-lg-3 col-md-3 col-sm-3">
                                        <div className="card card-stats">
                                            <div className="card-header" data-background-color="orange">
                                                <i className="material-icons">weekend</i>
                                            </div>
                                            <div className="card-content">
                                                <p className="category">Tổng đơn chưa chốt</p>
                                                <h3 className="card-title">{helper.dotNumber(this.props.notLocked)}</h3>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-3 col-md-3 col-sm-3">
                                        <div className="card card-stats">
                                            <div className="card-header" data-background-color="green">
                                                <i className="material-icons">store</i>
                                            </div>
                                            <div className="card-content">
                                                <p className="category">Tổng đơn hàng</p>
                                                <h3 className="card-title">{helper.dotNumber(this.props.totalDeliveryOrders)}</h3>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-3 col-md-3 col-sm-3">
                                        <div className="card card-stats">
                                            <div className="card-header" data-background-color="rose">
                                                <i className="material-icons">equalizer</i>
                                            </div>
                                            <div className="card-content">
                                                <p className="category">Tổng tiền</p>
                                                <h3 className="card-title">{helper.dotNumber(this.props.totalMoney)}đ</h3>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-3 col-md-3 col-sm-3">
                                        <div className="card card-stats">
                                            <div className="card-header" data-background-color="blue">
                                                <i className="fa fa-twitter"/>
                                            </div>
                                            <div className="card-content">
                                                <p className="category">Tổng tiền đã trả</p>
                                                <h3 className="card-title">{helper.dotNumber(this.props.totalPaidMoney)}đ</h3>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-header card-header-icon" data-background-color="rose"><i
                                className="material-icons">assignment</i>
                            </div>
                            <div className="card-content">
                                <h4 className="card-title">Danh sách đơn hàng</h4>
                                <div className="row">
                                    <div className="col-md-10">
                                        <Search
                                            onChange={this.orderedSearchChange}
                                            value={this.state.query}
                                            placeholder="Nhập tên hoặc số điện thoại khách hàng"
                                        />
                                    </div>
                                    <div className="col-md-2">
                                        <button type="button" data-toggle="collapse" data-target="#demo"
                                                className="btn btn-info">
                                            <i className="material-icons">filter_list</i> Lọc
                                        </button>
                                    </div>
                                </div>
                                <div id="demo" className="collapse">
                                    <div className="row">
                                        <div className="col-md-3">
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <FormInputDate
                                                        label="Từ ngày"
                                                        name="startTime"
                                                        updateFormData={this.updateFormDate}
                                                        id="form-start-time"
                                                        value={this.state.time.startTime}
                                                        maxDate={this.state.time.endTime}
                                                    />
                                                </div>
                                                <div className="col-md-6">
                                                    <FormInputDate
                                                        label="Đến ngày"
                                                        name="endTime"
                                                        updateFormData={this.updateFormDate}
                                                        id="form-end-time"
                                                        value={this.state.time.endTime}
                                                        minDate={this.state.time.startTime}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-9">
                                            <div className="row">
                                                <div className="form-group col-md-4">
                                                    <label className="label-control">Tìm theo thu ngân</label>
                                                    <Select
                                                        value={this.state.staff}
                                                        options={[]}
                                                        onChange={this.staffsSearchChange}
                                                    />
                                                </div>
                                                <div className="form-group col-md-4">
                                                    <label className="label-control">Tìm theo cửa hàng</label>
                                                    <Select
                                                        value={this.state.base}
                                                        options={[
                                                            {
                                                                value: 1,
                                                                label: "HIỂN THỊ RA WEBSITE"
                                                            },
                                                            {
                                                                value: "0",
                                                                label: "KHÔNG HIỂN THỊ RA WEBSITE"
                                                            }
                                                        ]}
                                                        onChange={this.displayStatusChange}
                                                    />
                                                </div>
                                                <div className="form-group col-md-4">
                                                    <label className="label-control">Tìm theo trạng thái</label>
                                                    <Select
                                                        value={this.state.status}
                                                        options={ORDER_STATUS}
                                                        onChange={this.statusesSearchChange}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <br/>
                                <ListOrder
                                    changeStatusOrder={this.changeStatusOrder}
                                    deliveryOrders={this.props.deliveryOrders}
                                    isLoading={this.props.isLoading}
                                    user={this.props.user}
                                />
                            </div>
                            <div className="row float-right">
                                <div className="col-md-12" style={{textAlign: 'right'}}>
                                    <b style={{marginRight: '15px'}}>
                                        Hiển thị kêt quả từ {first} - {end}/{this.props.totalCount}</b><br/>
                                    <Pagination
                                        totalPages={this.props.totalPages}
                                        currentPage={this.props.currentPage}
                                        loadDataPage={this.loadOrders}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

OrderedContainer.propTypes = {
    isLoading: PropTypes.bool.isRequired,
    totalPaidMoney: PropTypes.number.isRequired,
    totalMoney: PropTypes.number.isRequired,
    totalDeliveryOrders: PropTypes.number.isRequired,
    notLocked: PropTypes.number.isRequired,
    deliveryOrders: PropTypes.array.isRequired,
    currentPage: PropTypes.number.isRequired,
    totalPages: PropTypes.number.isRequired,
    totalCount: PropTypes.number.isRequired,
    user: PropTypes.object.isRequired,
    orderedProductAction: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return {
        isLoading: state.orderedProduct.isLoading,
        totalPaidMoney: state.orderedProduct.totalPaidMoney,
        totalMoney: state.orderedProduct.totalMoney,
        totalDeliveryOrders: state.orderedProduct.totalDeliveryOrders,
        notLocked: state.orderedProduct.notLocked,
        deliveryOrders: state.orderedProduct.deliveryOrders,
        currentPage: state.orderedProduct.currentPage,
        totalPages: state.orderedProduct.totalPages,
        totalCount: state.orderedProduct.totalCount,
        user: state.login.user
    };
}

function mapDispatchToProps(dispatch) {
    return {
        orderedProductAction: bindActionCreators(orderedProductAction, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderedContainer);
