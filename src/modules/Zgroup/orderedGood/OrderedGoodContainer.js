import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as orderedGoodActions from "./orderedGoodAction";
//import ListOrderedGood from "./ListOrderedGood";
import * as PropTypes from "prop-types";
import Loading from "../../../components/common/Loading";
import Pagination from "../../../components/common/Pagination";
import * as helper from "../../../helpers/helper";
import { Link } from "react-router";
import ButtonGroupAction from "../../../components/common/ButtonGroupAction";
import ReactSelect from 'react-select';
import moment from "moment";

const filterStyle = { fontSize: 12 };

class OrderedGoodContainer extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            selectedCompany: ''
        };
        this.confirm = this.confirm.bind(this);
        this.changeCompany = this.changeCompany.bind(this);
    }

    componentWillMount() {
        this.props.orderedGoodActions.loadAllCompanies();
        this.props.orderedGoodActions.loadAllOrderedGood(1);
    }

    // componentWillReceiveProps(next){
    //     console.log(next);
    // }


    confirm(id) {
        helper.confirm("warning", "Xác Nhận Duyệt", "Sau khi duyệt sẽ không thể hoàn tác?",
            () => {
                return this.props.orderedGoodActions.confirmOrder(id,
                    () => {
                        helper.showNotification("Duyệt thành công.");
                        return this.props.orderedGoodActions.loadAllOrderedGood(this.props.paginator.current_page);
                    }
                );
            }
        );
    }

    changeCompany(e) {
        if(!e) e = {id:''};
        this.setState({ selectedCompany: e.id });
        this.props.orderedGoodActions.loadAllOrderedGood(this.props.paginator.current_page, e.id);
    }

    render() {
        let { isLoading, paginator, orderedGoodActions, orderedList, companies } = this.props;
        let { selectedCompany } = this.state;
        companies = [{ id: '', name: "Tất cả", label: "Tất cả" }, ...companies];
        //console.log(this.props);
        return (
            <div className="content">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-12">

                            <div className="card">
                                <div className="card-header card-header-icon" data-background-color="rose">
                                    <i className="material-icons">event_note</i>
                                </div>

                                <div className="card-content">
                                    <h4 className="card-title">Danh sách đơn hàng</h4>
                                    <div className="row">
                                        <div className="col-md-12">
                                            <div className="col-sm-4">
                                                <Link to="/business/ordered-good/create" className="btn btn-rose" style={{ width: "100%" }}>
                                                    <i className="material-icons">add</i> Tạo đơn hàng
                                                </Link>
                                            </div>
                                            {/* <Search className="col-sm-9" placeholder="Tìm kiếm"
                                                    value={this.state.query}
                                                    onChange={()=>{}}
                                            /> */}
                                        </div>
                                    </div>
                                    {
                                        isLoading ? <Loading /> :
                                            <div className="table-responsive">
                                                <table id="datatables"
                                                    className="table table-striped table-no-bordered table-hover"
                                                    cellSpacing="0" width="100%" style={{ width: "100%" }}>
                                                    <thead className="text-rose">
                                                        <tr>
                                                            <th>STT</th>
                                                            <th>Nhà phân phối</th>
                                                            <th>Mã đơn hàng</th>
                                                            <th>Số sản phẩm</th>
                                                            <th>Ngày tạo</th>
                                                            <th>Giá trị</th>
                                                            <th />
                                                        </tr>
                                                        <tr>
                                                            <th/>
                                                            <th style={filterStyle}> <ReactSelect
                                                                disabled={isLoading}
                                                                className=""
                                                                options={companies}
                                                                onChange={this.changeCompany}
                                                                value={selectedCompany}
                                                                name="filter_class"
                                                            /></th>
                                                            <th />
                                                            <th />
                                                            <th />
                                                            <th />
                                                            <th />
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {orderedList.map((order, index) => {
                                                            let date = moment(order.created_at.date);
                                                            return (
                                                                <tr key={index}>
                                                                    <td>{index + 1}</td>
                                                                    <td>{order.company.name}</td>
                                                                    <td>{order.command_code}</td>
                                                                    <td>{order.goods.length}</td>
                                                                    <td>{date.format('D-M-YYYY')}</td>

                                                                    <td>{helper.dotNumber(getTotalPrice(order.goods))}</td>
                                                                    <td><ButtonGroupAction
                                                                        editUrl={"/business/ordered-good/edit/" + order.id}
                                                                        disabledDelete={true}
                                                                        disabledEdit={order.status > 0}
                                                                        children={
                                                                            (order.status == 0) ?
                                                                                <a data-toggle="tooltip" title="Duyệt"
                                                                                    type="button"
                                                                                    onClick={() => { return this.confirm(order.id); }}
                                                                                    rel="tooltip"
                                                                                >
                                                                                    <i className="material-icons">done</i>
                                                                                </a>
                                                                                : <div />
                                                                        }
                                                                    />
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                </table>
                                            </div>
                                    }
                                    <Pagination
                                        currentPage={paginator.current_page}
                                        totalPages={paginator.total_pages}
                                        loadDataPage={orderedGoodActions.loadAllOrderedGood} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        );
    }
}

OrderedGoodContainer.propTypes = {
    isLoading: PropTypes.bool.isRequired,
    orderedGoodActions: PropTypes.object,
    orderedList: PropTypes.array,
    companies: PropTypes.array,
    paginator: PropTypes.object,
};

function mapStateToProps(state) {
    return {
        isLoading: state.orderedGood.isLoading,
        orderedList: state.orderedGood.orderedList,
        paginator: state.orderedGood.paginator,
        companies: state.orderedGood.companies,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        orderedGoodActions: bindActionCreators(orderedGoodActions, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderedGoodContainer);

function getTotalPrice(arr) {
    let sum = 0;
    arr.forEach(e => {
        sum += e.total_price;
    });
    return sum;
}