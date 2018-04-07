import React from 'react';
import {Modal} from "react-bootstrap";
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import * as campaignAction from "./campaignAction";
import Loading from "../../components/common/Loading";
import FormInputSelect from '../../components/common/FormInputSelect';
import FormInputDate from '../../components/common/FormInputDate';
import * as helper from "../../helpers/helper";


class AddMessageModal extends React.Component{
    constructor(props, context) {
        super(props, context);
        this.upMessage = this.upMessage.bind(this);
        this.saveMessage = this.saveMessage.bind(this);
    }
    saveMessage() {
        const message = {...this.props.message};
        if (
            helper.isEmptyInput(message.name)
            || helper.isEmptyInput(message.content)
            || helper.isEmptyInput(message.sms_template_type_id)
            || helper.isEmptyInput(message.send_time)
        ) {
            if (helper.isEmptyInput(message.name)) helper.showErrorNotification("Bạn cần nhập Tên tin nhắn");
            if (helper.isEmptyInput(message.content)) helper.showErrorNotification("Bạn cần nhập Nội dung tin nhắn");
            if (helper.isEmptyInput(message.sms_template_type_id)) helper.showErrorNotification("Bạn cần chọn Loại tin nhắn");
            if (helper.isEmptyInput(message.send_time)) helper.showErrorNotification("Bạn cần chọn Ngày gửi");
        } else
            if(!message.template_id) {
                this.props.campaignAction.saveMessage(message);
            }
            else this.props.campaignAction.editMessage(message);
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.isSavingMessage !== this.props.isSavingMessage && !nextProps.isSavingMessage) {
            this.props.campaignAction.loadAllMessage(1);
        }
    }
    upMessage(e){
        const field = e.target.name;
        let message = {
            ...this.props.message,
            [field]: e.target.value
        };
        this.props.campaignAction.upMessage(message);
    }
    render(){
        let message = this.props.message;
        return(
            <Modal show={this.props.addMessageModal}
                   onHide={()=>{
                       this.props.campaignAction.showAddMessageModal();}}>
                <a onClick={()=>{this.props.campaignAction.showAddMessageModal();}}
                   id="btn-close-modal"/>
                <Modal.Header closeButton>
                    <Modal.Title className="modal-title">Thêm tin nhắn</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="form-group">
                        <form method="#" action="#">
                            <div className="row">
                                <div className="col-md-6">
                                    <FormInputSelect
                                        label="Loại tin nhắn"
                                        updateFormData={this.upMessage}
                                        name="sms_template_type_id"
                                        data={this.props.template_types}
                                        value={message.sms_template_type_id}
                                        required={true}
                                    />

                                </div>
                                <div className="col-md-6">
                                    <FormInputDate
                                        type="string"
                                        label="Ngày gửi tin"
                                        name="send_time"
                                        updateFormData={this.upMessage}
                                        id="form-send-time"
                                        value={message.send_time || ''}
                                        required={true}
                                        placeholder="dd/mm/yyyy"
                                    />

                                </div>
                            </div>
                            <div className="form-group">
                                <label className="label-control">Tên tin nhắn</label>
                                <input type="text"
                                       name="name"
                                       className="form-control"
                                       value={message.name || ''}
                                       onChange={this.upMessage}/>
                                <span className="material-input"/>
                            </div>

                            <div className="form-group">
                                <label className="label-control">Nội dung tin nhắn</label>
                                <input type="text"
                                       name="content"
                                       className="form-control"
                                       value={message.content || ''}
                                       onChange={this.upMessage}/>
                                <span className="material-input"/>
                            </div><br/>

                            {
                                this.props.upMessage ? (
                                    <Loading/>
                                ) :
                                    (
                                    <div>
                                        <button rel="tooltip" data-placement="top" title=""
                                                data-original-title="Remove item" type="button"
                                                className="btn btn-success btn-round" data-dismiss="modal"
                                                onClick={this.saveMessage}><i
                                            className="material-icons">check</i> Xác nhận
                                        </button>
                                        <button rel="tooltip" data-placement="top" title=""
                                                data-original-title="Remove item" type="button"
                                                className="btn btn-danger btn-round" data-dismiss="modal"
                                                onClick={()=>{this.props.campaignAction.showAddMessageModal();}}>
                                            <i className="material-icons">close</i> Huỷ
                                        </button>
                                    </div>
                                )
                            }
                        </form>
                    </div>
                </Modal.Body>
            </Modal>
        );
    }
}

AddMessageModal.propTypes  = {
    upMessage: PropTypes.bool.isRequired,
    addMessageModal:PropTypes.bool.isRequired,
    campaignAction:PropTypes.object.isRequired,
    message:PropTypes.object.isRequired,
    template_types:PropTypes.array.isRequired,
    isSavingMessage:PropTypes.bool.isRequired,
};
function mapStateToProps(state) {
    return{
        template_types:state.smsCampaign.template_types,
        message:state.smsCampaign.message,
        upMessage: state.smsCampaign.upMessage,
        addMessageModal: state.smsCampaign.addMessageModal,
        isSavingMessage: state.smsCampaign.isSavingMessage,
    };
}
function mapDispatchToProps(dispatch) {
    return {
        campaignAction: bindActionCreators(campaignAction, dispatch)
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(AddMessageModal);