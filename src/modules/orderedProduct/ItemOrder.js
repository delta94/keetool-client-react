import React from 'react';
import {Link} from 'react-router';
import TooltipButton from '../../components/common/TooltipButton';
import * as helper from '../../helpers/helper';
import PropTypes from 'prop-types';
import {ORDERED_STATUS, ORDER_STATUS_COLORS} from "../../constants/constants";
import StatusSelect from "../goodOrders/status/StatusSelect";

class ItemOrder extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.changeStatus = this.changeStatus.bind(this);
    }

    statusOrder(status) {
        switch (status) {
            case "ship_uncall":
                return (
                    <TooltipButton text="Chưa gọi ship" placement="top">
                        <button className="btn btn-xs btn-main btn-info">
                            Chưa gọi ship
                        </button>
                    </TooltipButton>
                );
            case "success":
                return (
                    <TooltipButton text="Chưa gọi ship" placement="top">
                        <button className="btn btn-xs btn-main btn-success">
                            Hoàn thành
                        </button>
                    </TooltipButton>
                );
            case "pending":
                return (
                    <TooltipButton text="Đang chờ" placement="top">
                        <button className="btn btn-xs btn-main">
                            Đang chờ
                        </button>
                    </TooltipButton>
                );
            default:
                return null;
        }
    }

    changeStatus(value) {
        const user = this.props.user;
        let currentStatus = ORDERED_STATUS.filter(status => this.props.delivery.status === status.value)[0];
        let nextStatus = ORDERED_STATUS.filter(status => status.value === value)[0];
        if (nextStatus.order < currentStatus.order && user.role !== 2) {
            helper.showErrorNotification("Không thể chuyển về trạng thái trước");
        } else {
            if (nextStatus.order === 7) {
                this.props.showAddCancelNoteModal(this.props.delivery);
            } else if (nextStatus.order === 1) {
                this.props.showSendPriceModal(this.props.delivery);
            } else {
                helper.confirm("error", "Chuyển trạng thái", "Bạn có chắc muốn chuyển trạng thái", () => {
                    this.props.changeStatus(value, this.props.delivery.id, null, null);
                });
            }
        }
    }

    render() {
        const delivery = this.props.delivery;
        let delivery_note;
        if (delivery.note) {
            delivery_note = delivery.note.length < 16 ? delivery.note : delivery.note.substring(0, 15) + "...";
        } else delivery_note = "";
        return (
            <tr>
                <td>
                    <Link
                        style={{
                            backgroundColor: ORDER_STATUS_COLORS[delivery.status]
                        }}
                        className="btn text-name-student-register"
                        to={`/good/goods/order/${delivery.id}`}>
                        {delivery.code ? delivery.code : 'Không có mã'}
                    </Link>
                </td>
                <td>{delivery.created_at}</td>
                <td>
                    {
                        delivery.customer ? (
                            <span>{delivery.customer.name}<br/>
                        ({delivery.customer.phone})
                    </span>
                        ) : "Không nhập"
                    }
                </td>
                <td>
                    {
                        delivery.staff ?

                            (
                                <TooltipButton text={delivery.staff.name} placement="top">
                                    <button className="btn btn-xs btn-main"
                                            style={{backgroundColor: delivery.staff.color ? delivery.staff.color : ''}}>
                                        {helper.getShortName(delivery.staff.name)}
                                    </button>
                                </TooltipButton>
                            )
                            :
                            (
                                <div>Không có</div>
                            )
                    }
                </td>
                <td>
                    <StatusSelect options={ORDERED_STATUS}
                                  onChange={this.changeStatus}
                                  value={delivery.status}/>
                </td>
                <td>
                    <a data-toggle="tooltip" title="Ghi chú" type="button"
                       rel="tooltip" onClick={() => this.props.showAddNoteModal(delivery)}>
                        {
                            delivery_note === "" ? (
                                <i className="material-icons">edit</i>
                            ) : (
                                <p>{delivery_note}</p>
                            )
                        }
                    </a>
                </td>
                <td>{helper.dotNumber(delivery.total)}đ</td>
                <td>
                    <div className="btn-group-action">
                        <Link to={`/order/${delivery.id}/edit`}
                              style={{color: "#878787"}}
                              data-toggle="tooltip" title=""
                              type="button" rel="tooltip"
                              data-original-title="Sửa">
                            <i className="material-icons">edit</i>
                        </Link>
                        <Link to={`/order/${delivery.id}/warehouse-import`}
                              style={{color: "#878787"}}
                              data-toggle="tooltip" title=""
                              type="button" rel="tooltip"
                              data-original-title="Nhập kho">
                            <i className="material-icons">import_export</i>
                        </Link>
                    </div>
                </td>
            </tr>
        );
    }
}

ItemOrder.propTypes = {
    delivery: PropTypes.object.isRequired,
    changeStatus: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    showAddNoteModal: PropTypes.func.isRequired,
    showAddCancelNoteModal: PropTypes.func.isRequired,
    showSendPriceModal: PropTypes.func.isRequired
};

export default ItemOrder;
