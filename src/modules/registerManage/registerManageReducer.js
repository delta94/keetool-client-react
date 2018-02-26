import * as types from '../../constants/actionTypes';
import initialState from '../../reducers/initialState';

let tmp;
let tmpRegs = [];
let tmpReg = {};

export default function goodOrdersReducer(state = initialState.registerManage, action) {
    switch (action.type) {



        case types.BEGIN_LOAD_BASES_IN_REGISTER_MANAGE:
            return {
                ...state,
                ...{
                    isLoadingBases: true,

                }
            };
        case types.LOAD_BASES_IN_REGISTER_MANAGE_SUCCESS:
            return {
                ...state,
                ...{
                    isLoadingBases: false,
                    bases: action.bases,
                }
            };
        case types.LOAD_BASES_IN_REGISTER_MANAGE_ERROR:
            return {
                ...state,
                ...{
                    isLoadingBases: false,
                }
            };



        case types.BEGIN_LOAD_REGISTER_MANAGE:
            return {
                ...state,
                isLoading: true
            };
        case types.LOAD_REGISTER_MANAGE_SUCCESS:
            return {
                ...state,
                registers: action.registers,
                isLoading: false,
                totalPages: action.totalPages,
                currentPage: action.currentPage,
                totalCount: action.totalCount
            };
        case types.GET_ALL_STAFFS_REGISTER_MANAGE:
            return {
                ...state,
                staffs: action.staffs
            };

        case types.BEGIN_CHANGE_CALL_STATUS:
            return {
                ...state,
                isChangingStatus: true,
            };
        case types.LOADED_CHANGE_CALL_STATUS_SUCCESS:
            tmp = addCall(action.register_id, state.registers, action.teleCall);
            return {
                ...state,
                isChangingStatus: false,
                registers: tmp,
            };
        case types.LOADED_CHANGE_CALL_STATUS_ERROR:
            return {
                ...state,
                isChangingStatus: false,
            };

        default:
            return state;
    }
}

function addCall(register_id, registers, teleCall) {
    tmpRegs = registers.map((register) => {
        if (register.id === register_id) {
            tmpReg = {...register, teleCalls: [...register.teleCalls, teleCall]};
            return tmpReg;
        }
        else return register;
    });
    return tmpRegs;
}