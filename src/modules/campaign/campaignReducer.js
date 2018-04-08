import * as types from './actionTypes';
import initialState from "../../reducers/initialState";

export default function smsCampaignReducer(state = initialState.smsCampaign, action) {
    switch (action.type) {
        case  types.BEGIN_LOAD_ALL_MESSAGE:
            return {
                ...state,
                isLoading: true,
            };
        case types.TOGGLE_ADD_MESSAGE_MODAL:
            return {
                ...state,
                addMessageModal: !state.addMessageModal,
            };
        case types.UPLOAD_MESSAGE:
            return {
                ...state,
                message: action.message
            };
        case types.TOGGLE_ADD_RECEIVER_MODAL:
            return {
                ...state,
                addReceiverModal: !state.addReceiverModal,
            };
        case types.BEGIN_SAVE_MESSAGE:
            return {
                ...state,
                isSavingMessage:true,
                upMessage: true
            };
        case types.SAVE_MESSAGE_SUCCESS: {
            // let a = state.template_types.map((type)=>{
            //     if(type.id === action.message.sms_template_type_id){
            //         return{
            //             name:type.name,
            //             color:type.color
            //         };
            //     }
            //     return type;
            // });
            let message = {
                ...action.message,
                sms_template_type: {
                    id: action.message.sms_template_type_id,
                    name: state.template_types[action.message.sms_template_type_id - 1].name,
                },
            };
            return {
                ...state,
                isSavingMessage:false,
                upMessage: false,
                addMessageModal: false,
                allMessage: [message, ...state.allMessage]
            };
        }

        case types.LOAD_TEMPLATE_SUCCESS:
            return {
                ...state,
                template_types: action.template_types
            };
        case types.LOAD_ALL_MESSAGE_SUCCESS:
            return {
                ...state,
                allMessage: action.allMessage,
                currentPage: action.currentPage,
                limit: action.limit,
                totalCount: action.totalCount,
                totalPages: action.totalPages,
                isLoading: false
            };
        case types.EDIT_MESSAGE_SUCCESS:
        {
            let messages = state.allMessage.map((message) => {
                if (message.template_id === action.message.template_id)
                    return {
                        ...message,
                        name:action.message.name,
                        content:action.message.content,
                        sms_template_type_id: action.message.sms_template_type_id,
                        send_time:action.message.send_time,
                        sms_template_type: {
                            id: action.message.sms_template_type_id,
                            name: state.template_types[action.message.sms_template_type_id - 1].name,
                            color: state.template_types[action.message.sms_template_type_id - 1].color,
                        }
                    };
                return message;
            });
            return {
                ...state,
                addMessageModal: false,
                upMessage: false,
                allMessage: messages
            };
        }
        default:
            return state;
    }
}
