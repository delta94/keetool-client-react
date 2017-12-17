import React from 'react';
import {Link} from 'react-router';
import TooltipButton from '../../components/common/TooltipButton';
import ButtonGroupAction from '../../components/common/ButtonGroupAction';
import * as helper from '../../helpers/helper';
import PropTypes from 'prop-types';
import ReactSelect from 'react-select';
import {ORDER_STATUS, ORDER_STATUS_COLORS} from "../../constants/constants";
import {showErrorNotification} from "../../helpers/helper";
import {confirm} from "../../helpers/helper";


class ItemOrder extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.changeStatusOrder = this.changeStatusOrder.bind(this);
        this.disableShipOrder = this.disableShipOrder.bind(this);
    }

    disableShipOrder(status) {
        const statusOrder = ORDER_STATUS.filter((o) => {
            return o.value === status;
        })[0];
        if (statusOrder) {
            return statusOrder.order < 2;
        }
        return true;
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

    changeStatusOrder(value) {
        const currentStatusOrder = ORDER_STATUS.filter((o) => {
            return o.value === this.props.order.status;
        })[0].order;

        // Only change status of order to next status
        if (value.order > currentStatusOrder) {
            confirm(
                "warning",
                "Xác nhận",
                `Chuyển trạng thái của đơn hàng thành ${value.label}`,
                () => {
                    const statusOrder = value && value.value ? value.value : '';
                    this.props.changeStatusOrder(statusOrder, this.props.order.id);
                }
            );
        } else {
            showErrorNotification("Bạn không thể chuyển đơn hàng về các trạng thái trước");
        }

    }

    render() {
        const {order} = this.props;
        return (
            <tr>
                <td>
                    <Link
                        style={{
                            backgroundColor: ORDER_STATUS_COLORS[order.status]
                        }}
                        className="btn text-name-student-register"
                        to={`/goods/order/${order.id}`}>
                        {order.code ? order.code : 'Không có mã'}
                    </Link>
                </td>
                <td>{order.created_at}</td>
                <td>{order.customer ? order.customer.name : "Không nhập"}</td>
                <td>
                    {
                        order.staff ?

                            (
                                <TooltipButton text={order.staff.name} placement="top">
                                    <button className="btn btn-xs btn-main"
                                            style={{backgroundColor: order.staff.color ? order.staff.color : ''}}>
                                        {helper.getShortName(order.staff.name)}
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
                    {
                        order.base ?
                            (
                                <TooltipButton text={order.base.name} placement="top">
                                    <button className="btn btn-xs btn-main">
                                        {order.base.name}
                                    </button>
                                </TooltipButton>
                            )
                            :
                            (
                                <div>Không có</div>
                            )
                    }
                </td>
                <td className="min-width-130-px">
                    <ReactSelect
                        name="form-field-name"
                        options={ORDER_STATUS}
                        value={order.status}
                        placeholder="Chọn trạng thái"
                        onChange={this.changeStatusOrder}
                    />
                </td>

                <td>{helper.dotNumber(order.total)}đ</td>
                <td>{helper.dotNumber(order.debt)}đ</td>
                <td>
                    <ButtonGroupAction/>
                </td>
                <td>
                    <button
                        disabled={this.disableShipOrder(order.status)}
                        className="btn btn-social btn-fill btn-twitter"
                        onClick={() => this.props.showShipGoodModal(order)}>
                        <i className="fa fa-twitter"/> Ship hàng
                    </button>
                </td>
            </tr>


        );
    }
}

ItemOrder.propTypes = {

    order: PropTypes.object.isRequired,
    changeStatusOrder: PropTypes.func.isRequired,
    showShipGoodModal: PropTypes.func.isRequired

};


export default ItemOrder;
