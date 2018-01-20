import * as types from '../../constants/actionTypes';
import * as orderedProductApi from './orderedProductApi';
import * as helper from "../../helpers/helper";

export function loadAllOrders(page = 1, search, startTime, endTime, status, staff_id, user_id) {
    return function (dispatch) {
        dispatch({type: types.BEGIN_LOAD_ORDERED_PRODUCT});
        const infoPromise = new Promise((resolve) => {
            orderedProductApi.loadOrderInfo(page, search, startTime, endTime, status, staff_id, user_id)
                .then(res => resolve(res));
        });
        const orderPromise = new Promise((resolve) => {
            orderedProductApi.loadAllOrders(page, search, startTime, endTime, status, staff_id, user_id)
                .then(res => resolve(res));
        });
        Promise.all([infoPromise, orderPromise]).then(data => {
            const infoRes = data[0];
            const orderRes = data[1];
            dispatch({
                type: types.LOAD_ORDERED_PRODUCT_SUCCESS,
                totalPaidMoney: infoRes.data.data.total_paid_money,
                totalMoney: infoRes.data.data.total_money,
                totalDeliveryOrders: infoRes.data.data.total_delivery_orders,
                notLocked: infoRes.data.data.not_locked,
                deliveryOrders: orderRes.data.delivery_orders,
                currentPage: orderRes.data.paginator.current_page,
                totalPages: orderRes.data.paginator.total_pages,
                totalCount: orderRes.data.paginator.total_count
            });
        });
    };
}

export function getAllStaffs() {
    return function (dispatch) {
        orderedProductApi.getAllStaffApi()
            .then(res => {
                dispatch({
                    type: types.GET_ALL_STAFFS_ORDERED_PRODUCT,
                    staffs: res.data.staffs
                });
            });
    };
}

export function deleteOrder(order) {
    return function (dispatch) {
        dispatch({
            type: types.DISPLAY_GLOBAL_LOADING
        });
      orderedProductApi.deleteOrderApi(order)
          .then(res=>{
              if (res.data.status) {
                  helper.showNotification("Xóa đơn hàng đặt thành công");
                  dispatch({
                      type: types.DELETE_ORDER_ORDERED_PRODUCT_SUCCESS,
                      order,
                  });
              } else {
                  helper.showErrorNotification(res.data.message);
              }
              dispatch({
                  type: types.HIDE_GLOBAL_LOADING
              });
          });
    };
}

export function showAddNoteModal() {
    return ({
        type: types.TOGGLE_ADD_NOTE_MODAL_ORDERED_PRODUCT
    });
}

export function handleAddNoteModal(order) {
    return ({
        type: types.HANDLE_ADD_NOTE_MODAL_ORDERED_PRODUCT,
        order
    });
}

export function editNote(order) {
    return function (dispatch) {
        dispatch({
            type: types.BEGIN_EDIT_NOTE_ORDERED_PRODUCT
        });
        helper.showTypeNotification("Đang chỉnh sửa ghi chú", "info");
        orderedProductApi.editNote(order)
            .then(() => {
                dispatch({
                    type: types.EDIT_NOTE_SUCCESS_ORDERED_PRODUCT,
                    order
                });
                helper.showNotification("Thay đổi ghi chú thành công");
            });
    };
}

