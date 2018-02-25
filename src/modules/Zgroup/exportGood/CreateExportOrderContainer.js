
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as exportOrderActions from "./exportOrderActions";
import * as PropTypes from "prop-types";
import Loading from "../../../components/common/Loading";
import FormInputText from "../../../components/common/FormInputText";
import * as helper from "../../../helpers/helper";
import { Modal } from 'react-bootstrap';
import ReactSelect from 'react-select';

const textAlign = { textAlign: "right" };
const btnStyle = { width: 90, marginRight: 10 };

class CreateExportOrderContainer extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            data: defaultData,
            showAddModal: false,
            addModalData: defaultAddModalData,
            editIndex: -1,

        };
        this.isEditModal = false;
        this.updateFormData = this.updateFormData.bind(this);
        this.changeGood = this.changeGood.bind(this);
        this.changeCompany = this.changeCompany.bind(this);
        this.changeWarehouse = this.changeWarehouse.bind(this);
        this.commitData = this.commitData.bind(this);
        this.openAddModal = this.openAddModal.bind(this);
        this.closeAddModal = this.closeAddModal.bind(this);
        this.updateFormAdd = this.updateFormAdd.bind(this);
        this.changeOrderedGood = this.changeOrderedGood.bind(this);
        this.addGood = this.addGood.bind(this);
    }

    componentWillMount() {
        this.props.exportOrderActions.loadAllGoods();
        this.props.exportOrderActions.loadAllCompanies();
        this.props.exportOrderActions.loadAllWarehourses();
        this.props.exportOrderActions.loadAllOrderedGood();
        let id = this.props.params.exportOrderId;
        if (id) {
            this.props.exportOrderActions.loadExportOrder(id, (data) => {
                this.setState({ data });
            });
        } else {
            this.setState({ data: defaultData });
        }
    }


    updateFormData(e) {
        let name = e.target.name;
        let value = e.target.value;
        let newdata = {
            ...this.state.data,
            [name]: value,
        };
        this.setState({ data: newdata });
    }

    updateFormAdd(e) {
        let name = e.target.name;
        let value = e.target.value;
        let { addModalData } = this.state;
        if (!value) return;
        if (name === "id") {
            let good = this.props.goods.filter((obj) => obj.id * 1 === value * 1)[0];
            if (good) addModalData = {
                ...addModalData,
                [name]: value,
            };
        } else
            addModalData = { ...addModalData, [name]: value };
        this.setState({ addModalData });
    }

    changeGood(e) {
        let newdata = {
            ...this.state.data,
            good: e,
            price: e.price
        };
        this.setState({ data: newdata });
    }

    changeCompany(e) {
        let newdata = { ...this.state.data, company: e };
        this.setState({ data: newdata });
    }

    changeWarehouse(e) {
        let newdata = { ...this.state.data, warehouse: e };
        this.setState({ data: newdata });
    }

    openAddModal(index) {
        if (index || index === 0) {
            this.isEditModal = true;
            this.setState({ showAddModal: true, addModalData: this.state.data.goods[index], editIndex: index });
        }
    }

    changeOrderedGood(e) {
        if (!e) return;
        this.setState({ data: e });
    }

    closeAddModal() {
        this.setState({ showAddModal: false });
    }

    addGood() {
        if ($('#form-good').valid()) {
            let { goods } = this.state.data;
            let good = goods.filter((obj) => obj.id === this.state.addModalData.id)[0];
            if (!good) return;
            
                goods = [...goods.slice(0, this.state.editIndex),
                { ...this.state.addModalData, name: good.name },
                ...goods.slice(this.state.editIndex + 1, goods.length)
                ];
            

            this.setState({
                data: { ...this.state.data, goods },
                showAddModal: false,
                addModalData: defaultAddModalData
            });
        }
    }

    commitData() {
        let { data } = this.state;
        if (!data.id) {
            helper.showErrorNotification("Vui lòng chọn mã đặt hàng");
            return;
        }

        if (this.props.params.exportOrderId) {
            this.props.exportOrderActions.editExportOrder(
                {
                    ...data,
                    company_id: data.company.id,
                    good_id: data.good.id,
                    warehouse_id: data.warehouse.id,
                    staff_id: this.props.user.id,
                    total_price: data.price * data.quantity,
                });
        }
        else {
            this.props.exportOrderActions.createExportOrder(
                {
                    ...data,
                    company_id: data.company.id,
                    good_id: data.good.id,
                    warehouse_id: data.warehouse.id,
                    staff_id: this.props.user.id,
                    total_price: data.price * data.quantity,
                });
        }
    }

    render() {
        let { data, addModalData, showAddModal } = this.state;
        let { orderedGoods,isLoading, isCommitting,} = this.props;
        let sumQuantity = 0, sumPrice = 0;
        return (
            <div className="content">
                <div className="container-fluid">
                    {(isLoading) ? <Loading /> :
                        <form role="form" id="form-id" onSubmit={(e) => e.preventDefault()}>
                            <div className="row">
                                <div className="col-md-8">
                                    <div className="card">
                                        <div className="card-header card-header-icon" data-background-color="rose">
                                            <i className="material-icons">event_available</i>
                                        </div>

                                        <div className="card-content">
                                            <h4 className="card-title">Sản phẩm</h4>
                                            <div className="table-responsive">
                                                <table className="table">
                                                    <thead className="text-rose">
                                                        <tr>
                                                            <th style={{ width: "10%" }}>STT</th>
                                                            <th style={{ width: "40%" }}>Tên</th>
                                                            <th style={textAlign}>Số lượng</th>
                                                            <th style={textAlign}>Đơn giá</th>
                                                            <th style={textAlign}>Thành tiền</th>
                                                            <th>
                                                                {/* <TooltipButton text="Thêm sản phẩm" placement="top">
                                                                        <button style={{ float: "right"}}
                                                                                className="btn btn-fill btn-rose btn-sm"
                                                                                type="button"
                                                                                onClick={()=> this.openAddModal(null)}
                                                                        ><i className="material-icons">add</i> Thêm
                                                                        </button>
                                                                    </TooltipButton> */}
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    {(data && data.goods && data.goods.length > 0) ?
                                                        <tbody>
                                                            {data.goods.map(
                                                                (obj, index) => {
                                                                    sumPrice += obj.price * obj.quantity;
                                                                    sumQuantity += obj.quantity * 1;
                                                                    return (
                                                                        <tr key={index}>
                                                                            <td>{index + 1}</td>
                                                                            <td>{obj.good.name}</td>
                                                                            <td style={textAlign}>{obj.quantity}</td>
                                                                            <td style={textAlign}>{helper.convertMoneyToK(obj.price)}</td>
                                                                            <td style={textAlign}>{helper.convertMoneyToK(obj.price * obj.quantity)}</td>
                                                                            <td><div className="btn-group-action" style={{ display: "flex", justifyContent: "center" }}>
                                                                                <a data-toggle="tooltip" title="Sửa" type="button" rel="tooltip"
                                                                                    onClick={() => {
                                                                                        return this.openAddModal(index);
                                                                                    }}><i className="material-icons">edit</i>
                                                                                </a>
                                                                            </div></td>
                                                                        </tr>
                                                                    );
                                                                })}
                                                        </tbody>
                                                        :
                                                        <tbody>
                                                            <tr><td /><td colSpan={5}>Chưa có sản phẩm</td></tr>
                                                        </tbody>

                                                    }

                                                    <tfoot style={{ fontWeight: "bolder" }}>
                                                        <tr>
                                                            <td />
                                                            <td>Tổng</td>
                                                            <td style={textAlign}>{sumQuantity}</td>
                                                            <td />
                                                            <td style={textAlign}>{helper.dotNumber(sumPrice)}</td>
                                                            <td />
                                                        </tr>
                                                    </tfoot>
                                                </table>
                                            </div>
                                            {isCommitting ?
                                                <div className="" style={{ display: "flex", flexDirection: "row-reverse" }}>
                                                    <button style={btnStyle} className="btn btn-rose disabled btn-xs" type="button" disabled>
                                                        <i className="fa fa-spinner fa-spin" /> Đang lưu...
                                                                </button>
                                                </div>
                                                :
                                                <div className="" style={{ display: "flex", flexDirection: "row-reverse" }}>
                                                    <button
                                                        className="btn btn-fill btn-xs" type="button"
                                                        style={btnStyle}
                                                        onClick={() => {
                                                            helper.confirm("warning", "Hủy bỏ", "Bạn có chắc muốn hủy không?",
                                                                () => {
                                                                    //return browserHistory.push("/business/export-order");
                                                                }
                                                            );
                                                        }}
                                                    ><i className="material-icons">cancel</i> Hủy</button>
                                                    <button
                                                        className="btn btn-fill btn-rose btn-xs"
                                                        style={btnStyle}
                                                        type="button"
                                                        onClick={this.commitData}
                                                        disabled={isCommitting}
                                                    ><i className="material-icons">add</i>  Lưu</button>
                                                </div>

                                            }
                                        </div>

                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="card">
                                        <div className="card-header card-header-icon" data-background-color="rose">
                                            <i className="material-icons">local_shipping</i>
                                        </div>

                                        <div className="card-content">
                                            <h4 className="card-title">Nhà phân phối</h4>

                                            <div className="">
                                                <label>Chọn mã đặt hàng</label>
                                                <ReactSelect
                                                    disabled={isLoading}
                                                    options={orderedGoods || []}
                                                    onChange={this.changeOrderedGood}
                                                    value={data.id}
                                                    name="order"
                                                    defaultMessage="Chọn mã"
                                                /></div>
                                            <div>
                                                <div>
                                                    <FormInputText name="" label="Nhà phân phối" value={data.company.name} disabled />
                                                </div>
                                                <label className="control-label">Ghi chú</label>
                                                <div className="comment-input-wrapper">
                                                    <textarea
                                                        id="textarea-card-comment"
                                                        name="note"
                                                        onChange={() => { }}
                                                        value={data.note}
                                                        onKeyUp={() => {
                                                        }}
                                                        placeholder="Nhập ghi chú"
                                                        className="comment-input"
                                                        style={{
                                                            width: "100%",
                                                            margin: "10px",
                                                            height: "100px",
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>}
                </div>
                <Modal bsSize="small" show={showAddModal} onHide={this.closeAddModal}>
                    <Modal.Header>
                        <Modal.Title>Thuộc tính
                                    <a data-toggle="tooltip" title="Đóng" type="button" rel="tooltip"
                                style={{ float: "right", color: "gray" }}
                                onClick={this.closeAddModal}>
                                <i className="material-icons">highlight_off</i></a>
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form role="form" id="form-good" onSubmit={(e)=>{e.preventDefault();}}>
                            <FormInputText
                                name="" type="text"
                                label="Sản phẩm"
                                value={addModalData.good.name}
                                updateFormData={() => { }}
                                disabled
                            />
                            <FormInputText
                                name="quantity" type="number"
                                label="Số lượng"
                                value={addModalData.quantity}
                                minValue="0"
                                updateFormData={this.updateFormAdd}
                                placeholder="Nhập số lượng"
                                required
                            />
                            <FormInputText
                                name="price" type="number"
                                label="Đơn giá"
                                value={addModalData.price}
                                minValue="0"
                                updateFormData={this.updateFormAdd}
                                placeholder="Nhập giá"
                                disabled
                            />
                            <FormInputText
                                name="" type="number"
                                label="Thành tiền"
                                value={addModalData.price * addModalData.quantity}
                                updateFormData={() => { }}
                                placeholder="Thành tiền"
                                disabled
                            />
                        </form>
                    </Modal.Body>
                    <Modal.Footer>

                        <div style={{ display: "flex", justifyContent: "flex-end" }}>
                            <button className="btn btn-fill btn-rose" type="button"
                                onClick={this.addGood}
                            ><i className="material-icons">done</i> Lưu
                                        </button>
                            <button className="btn btn-fill" type="button"
                                onClick={this.closeAddModal}
                            ><i className="material-icons">cancel</i> Hủy
                                        </button>
                        </div>

                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}

CreateExportOrderContainer.propTypes = {
    isLoading: PropTypes.bool.isRequired,
    exportOrderActions: PropTypes.object.isRequired,
    isCommitting: PropTypes.bool,
    isLoadingGoods: PropTypes.bool,
    isLoadingCompanies: PropTypes.bool,
    isLoadingWarehouses: PropTypes.bool,
    user: PropTypes.object,
    data: PropTypes.object,
    companies: PropTypes.array,
    goods: PropTypes.array,
    warehouses: PropTypes.array,
    orderedGoods: PropTypes.array,
    params: PropTypes.object,
};

function mapStateToProps(state) {
    return {
        isLoading: state.exportOrder.isLoading,
        isCommitting: state.exportOrder.isCommitting,
        isLoadingGoods: state.exportOrder.isLoadingGoods,
        isLoadingCompanies: state.exportOrder.isLoadingCompanies,
        isLoadingWarehouses: state.exportOrder.isLoadingWarehouses,
        user: state.login.user,
        data: state.exportOrder.data,
        companies: state.exportOrder.companies,
        goods: state.exportOrder.goods,
        warehouses: state.exportOrder.warehouses,
        orderedGoods: state.exportOrder.orderedGoods,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        exportOrderActions: bindActionCreators(exportOrderActions, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateExportOrderContainer);

let defaultData = {
    company: { id: null, name: "" },
    staff: { id: null, name: "" },
    good: [
        // {id: null, name: "", quantity: 0,},
    ],
    warehouse: { id: null, name: "" },
    quantity: 0,
    total_price: 0,
    discount: 0,
};

const defaultAddModalData = {
    good: {},
};