/**
 * Created by phanmduong on 10/30/17.
 */
import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import FormInputText from '../../../components/common/FormInputText';
import Search from '../../../components/common/Search';
import Loading from '../../../components/common/Loading';
import * as helper from '../../../helpers/helper';
import PropTypes from 'prop-types';
import * as importGoodActions from '../importGoodActions';
import ListGood from './ListGood';
import StoreGood from './StoreGood';
import {Modal} from 'react-bootstrap';
import ReactSelect from 'react-select';
import TooltipButton from '../../../components/common/TooltipButton';
import * as importGoodsApi from '../importGoodsApi';

class StoreImportContainer extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.setTable = this.setTable.bind(this);
        this.table = null;
        this.state = {
            showModalStoreGood: false,
            search: '',
            initTable: false,
            optionsSelectWarehouses: []
        };
        this.closeModalStoreGood = this.closeModalStoreGood.bind(this);
        this.openModalStoreGood = this.openModalStoreGood.bind(this);
        this.storeGood = this.storeGood.bind(this);
        this.initTable = this.initTable.bind(this);
        this.updateFormData = this.updateFormData.bind(this);
        this.storeImportGood = this.storeImportGood.bind(this);
        this.changeOptionWarehouse = this.changeOptionWarehouse.bind(this);
        this.selectSupplier = this.selectSupplier.bind(this);
        this.loadSuppliers = this.loadSuppliers.bind(this);
    }

    componentWillMount() {
        this.props.importGoodActions.initDataImport();
        this.props.importGoodActions.getAllWarehouses();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.isLoadingWarehouses !== this.props.isLoadingWarehouses && !nextProps.isLoadingWarehouses) {
            let warehouses = nextProps.warehouses.map((warehouse) => {
                return {
                    ...warehouse,
                    ...{
                        value: warehouse.id,
                        label: warehouse.name
                    }
                };
            });

            this.setState({
                optionsSelectWarehouses: warehouses
            });
        }
    }

    setTable(table) {
        this.table = table;
    }

    closeModalStoreGood() {
        this.setState({showModalStoreGood: false});
    }

    openModalStoreGood() {
        this.setState({showModalStoreGood: true});
    }

    changeOptionWarehouse(value) {
        let formImportGood = {...this.props.formImportGood};
        formImportGood['warehouse_id'] = value && value.id ? value.id : null;
        this.props.importGoodActions.updateFormImportGood(formImportGood);
    }

    storeGood(good) {
        let isExistGood = this.props.formImportGood.importGoods.filter((importGood) => {
            return importGood.id === good.id;
        })[0];

        if (isExistGood) {
            helper.showWarningNotification("Sản phẩm đã thêm vào phiếu nhập");
            return;
        }

        this.props.importGoodActions.updateFormImportGood({
            ...this.props.formImportGood,
            importGoods: [...this.props.formImportGood.importGoods, good]
        });

        this.initTable();
        this.closeModalStoreGood();
    }

    initTable() {
        this.setState({initTable: true});
        setTimeout(() => {
            this.setState({initTable: false});
        }, 50);
    }

    updateFormData(event) {
        const field = event.target.name;
        let formImportGood = {...this.props.formImportGood};
        formImportGood[field] = event.target.value;
        this.props.importGoodActions.updateFormImportGood(formImportGood);
    }

    storeImportGood() {
        if (this.props.formImportGood.warehouse_id) {
            this.props.importGoodActions.storeImportGood(this.props.formImportGood);
        } else {
            helper.showWarningNotification("Vui lòng chọn kho hàng");
        }
    }

    selectSupplier(value) {
        let formImportGood = {...this.props.formImportGood};
        formImportGood['supplier'] = value;
        this.props.importGoodActions.updateFormImportGood(formImportGood);
    }

    loadSuppliers(input, callback) {
        if (this.timeOut !== null) {
            clearTimeout(this.timeOut);
        }
        this.timeOut = setTimeout(function () {
            importGoodsApi.searchGoods(input).then(res => {
                let goods = res.data.data.goods.map((good) => {
                    return {
                        ...good,
                        ...{
                            value: good.id,
                            label: `${good.name} (${good.code})`,
                        }
                    };
                });
                callback(null, {options: goods, complete: true});
            });
        }.bind(this), 500);
    }

    render() {
        let totalMoney = 0;

        this.props.formImportGood.importGoods.map((good) => {
            totalMoney += good.quantity * good.import_price;
        });

        return (
            <div>
                <div className="row">
                    <div className="col-md-12">
                        <button
                            className="btn btn-rose"
                            onClick={this.openModalStoreGood}
                        >
                            Thêm
                        </button>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-9">
                        <div className="card">
                            <div className="card-header card-header-icon" data-background-color="rose">
                                <i className="material-icons">assignment</i>
                            </div>
                            <div className="card-content">
                                <h4 className="card-title">Chi tiết hàng nhập</h4>
                                <Search
                                    onChange={(value) => {
                                        this.table ? this.table.search(value).draw() : null;
                                        this.setState({search: value});
                                    }}
                                    value={this.state.search}
                                    placeholder="Nhập mã hoặc tên sản phẩm"
                                />
                                {this.props.isLoading || this.state.initTable ? <Loading/> :
                                    <ListGood
                                        importGoods={this.props.formImportGood.importGoods}
                                        setTable={this.setTable}
                                    />
                                }

                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card">
                            <div className="card-header card-header-icon" data-background-color="rose"><i
                                className="material-icons">announcement</i></div>
                            <div className="card-content">
                                <h4 className="card-title">Thông tin</h4>
                                {this.props.isLoading ? <Loading/> :
                                    <div>
                                        <div>
                                            <h4><strong>Thông tin đơn hàng</strong></h4>
                                            <FormInputText
                                                label="Mã đơn hàng"
                                                name="code"
                                                value={this.props.formImportGood.code}
                                                placeholder="Hệ thống tự sinh"
                                                updateFormData={this.updateFormData}
                                            />
                                            <div>
                                                <label className="control-label">Kho hàng</label>
                                                <ReactSelect
                                                    name="form-field-name"
                                                    value={this.props.formImportGood.warehouse_id}
                                                    options={this.state.optionsSelectWarehouses}
                                                    onChange={this.changeOptionWarehouse}
                                                    placeholder="Chọn kho hàng"
                                                    searchPromptText="Không có tìm thấy"
                                                    noResultsText="Không có dữ liệu"
                                                />
                                            </div>
                                            <div>
                                                <label className="control-label">Nhà cung cấp
                                                    <TooltipButton text="Thêm nhà cung cấp" placement="top">
                                                        <button className="btn btn-round btn-sm btn-primary"
                                                                style={{
                                                                    width: '20px',
                                                                    height: '20px',
                                                                    padding: '0',
                                                                    margin: '5px'
                                                                }}>
                                                            <i className="material-icons">add</i>
                                                        </button>
                                                    </TooltipButton>
                                                </label>
                                                <ReactSelect.Async
                                                    loadOptions={this.loadSuppliers}
                                                    loadingPlaceholder="Đang tải..."
                                                    placeholder="Chọn nhà cung cấp"
                                                    searchPromptText="Không có dữ liệu"
                                                    onChange={this.selectSupplier}
                                                    value={this.props.formImportGood.supplier}
                                                />
                                            </div>

                                            <FormInputText
                                                label="Ghi chú"
                                                name="note"
                                                value={this.props.formImportGood.note}
                                                updateFormData={this.updateFormData}
                                            />
                                        </div>
                                        <div>
                                            <h4>
                                                <strong>Thông tin thanh toán </strong>
                                            </h4>
                                            <div className="row">
                                                <div className="col-sm-6">
                                                    Tiền hàng
                                                </div>
                                                <div className="col-sm-6">
                                                    {helper.dotNumber(totalMoney)}
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-sm-6">
                                                    Tiền thuế
                                                </div>
                                                <div className="col-sm-6">
                                                    0
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-sm-6">
                                                    <b>Tổng cộng</b>
                                                </div>
                                                <div className="col-sm-6">
                                                    <b>{helper.dotNumber(totalMoney - this.props.formImportGood.scot)}</b>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-sm-6">
                                                    <b>Thanh toán</b>
                                                </div>
                                                <div className="col-sm-6">
                                                    <div className="form-group label-floating none-margin">
                                                        <input
                                                            type="number"
                                                            className="form-control none-padding"
                                                            name="paid_money"
                                                            onChange={this.updateFormData}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-sm-6">
                                                    <b>Nợ</b>
                                                </div>
                                                <div className="col-sm-6">
                                                    <b>
                                                        {helper.dotNumber(totalMoney - this.props.formImportGood.scot - this.props.formImportGood.paid_money)}
                                                    </b>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                }
                            </div>
                            {!this.props.isLoading &&
                            <div className="card-footer">
                                <div className="float-right" style={{marginBottom: '20px'}}>

                                    {
                                        this.props.isStoring ?
                                            <button className="btn btn-sm btn-success"
                                            >
                                                <i className="fa fa-spinner fa-spin"/> Đang lưu
                                            </button>
                                            :
                                            <button className="btn btn-sm btn-success"
                                                    onClick={this.storeImportGood}
                                            >
                                                <i className="material-icons">save</i> Lưu
                                            </button>
                                    }
                                    <button className="btn btn-sm btn-danger">
                                        <i className="material-icons">cancel</i> Huỷ
                                    </button>
                                </div>
                            </div>
                            }
                        </div>
                    </div>
                </div>
                <Modal show={this.state.showModalStoreGood}>
                    <Modal.Header closeButton onHide={this.closeModalStoreGood} closeLabel="Đóng">
                        <Modal.Title>Thêm sản phẩm</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <StoreGood
                            storeGood={this.storeGood}
                            closeModal={this.closeModalStoreGood}
                        />
                    </Modal.Body>
                </Modal>
            </div>
        );
    }
}

StoreImportContainer.propTypes = {
    importGoodActions: PropTypes.object.isRequired,
    formImportGood: PropTypes.object.isRequired,
    warehouses: PropTypes.array.isRequired,
    isLoadingWarehouses: PropTypes.bool.isRequired,
    params: PropTypes.object.isRequired,
    type: PropTypes.string
};

function mapStateToProps(state) {
    return {
        formImportGood: state.importGoods.formImportGood,
        isStoring: state.importGoods.formImportGood.isStoring,
        warehouses: state.importGoods.warehouses,
        isLoadingWarehouses: state.importGoods.isLoadingWarehouses,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        importGoodActions: bindActionCreators(importGoodActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(StoreImportContainer);