import * as printOrderApi from "./printOrderApi";
import * as helper from "../../helpers/helper";
import * as types from "../../constants/actionTypes";
import {browserHistory} from 'react-router';

export function loadPrintOrders(page=1, search='') {
    return function (dispatch) {
        dispatch({type: types.BEGIN_LOAD_PRINT_ORDERS});
        printOrderApi.loadPrintOrders(page, search)
            .then((res) => {
                    dispatch({
                        type: types.LOAD_PRINT_ORDERS_SUCCESS,
                        listPrintOrder: res.data.printorders,
                        paginator: res.data.paginator,
                    });
            })
            .catch(() => {
                helper.showErrorNotification("Có lỗi xảy ra.");
                dispatch({type: types.LOAD_PRINT_ORDERS_ERROR});
            });
    };
}



export function loadAllGoods() {
    return function (dispatch) {
        dispatch({type: types.BEGIN_LOAD_ALL_GOODS_PRINT_ORDER});
        printOrderApi.loadAllGoods()
            .then((res) => {
                if(res.data.status == 1){
                    dispatch({
                        type: types.LOAD_ALL_GOODS_PRINT_ORDER_SUCCESS,
                        goods : res.data.data.goods,
                    });
                }else {
                    helper.showErrorNotification("Có lỗi xảy ra.");
                    dispatch({type: types.LOAD_ALL_GOODS_PRINT_ORDER_ERROR});
                    browserHistory.push("/business/print-order");
                }
            })
            .catch(() => {
                helper.showErrorNotification("Có lỗi xảy ra.");
                dispatch({type: types.LOAD_ALL_GOODS_PRINT_ORDER_ERROR});
                browserHistory.push("/business/print-order");
            });
    };
}
export function loadAllCompanies() {
    return function (dispatch) {
        dispatch({type: types.BEGIN_LOAD_ALL_COMPANIES_PRINT_ORDER});
        printOrderApi.loadAllCompanies()
            .then((res) => {
                if(res.data.status == 1){
                    dispatch({
                        type: types.LOAD_ALL_COMPANIES_PRINT_ORDER_SUCCESS,
                        companies : res.data.data.companies,
                    });
                }else {
                    helper.showErrorNotification("Có lỗi xảy ra.");
                    dispatch({type: types.LOAD_ALL_COMPANIES_PRINT_ORDER_ERROR});
                    browserHistory.push("/business/print-order");
                }
            })
            .catch(() => {
                helper.showErrorNotification("Có lỗi xảy ra.");
                dispatch({type: types.LOAD_ALL_COMPANIES_PRINT_ORDER_ERROR});
                browserHistory.push("/business/print-order");
            });
    };
}

