import React from 'react';
import PropTypes from 'prop-types';
import FormInputText from '../../components/common/FormInputText';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import * as groupCustomerActions from './groupCustomerActions';
import {CirclePicker} from 'react-color';
import Search from '../../components/common/Search';



class GroupCustomerModal extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.editFormData = this.editFormData.bind(this);
        this.updateFormData = this.updateFormData.bind(this);
        this.changeColor = this.changeColor.bind(this);
    }


    editFormData(event) {
        const field = event.target.name;
        let groupCustomerForm = {...this.props.groupCustomerForm};
        groupCustomerForm[field] = event.target.value;
        this.updateFormData(groupCustomerForm);
    }

    changeColor(color) {
        let groupCustomerForm = {...this.props.groupCustomerForm};
        groupCustomerForm.color = color.hex;
        this.updateFormData(groupCustomerForm);
    }

    updateFormData(groupCustomerForm) {
        this.props.groupCustomerActions.updateGroupCustomerFormData(groupCustomerForm);
    }


    render() {
        const {name, description, color} = this.props.groupCustomerForm;
        return (
            <div>
                <div className="card-header card-header-icon" data-background-color="rose">
                    <i className="material-icons">people</i>
                </div>
                <div className="card-content">
                    <h4 className="card-title">Thêm nhóm khách hàng</h4>
                    <div className="row">
                        <div className="col-md-7">

                            <FormInputText
                                label="Tên nhóm"
                                name="name"
                                updateFormData={this.editFormData}
                                type="text"
                                value={name}
                            />
                            <FormInputText
                                label="Mô tả"
                                name="description"
                                updateFormData={this.editFormData}
                                type="text"
                                value={description}
                            />

                            {this.props.isEdit ? <Search
                                onChange={this.onSearchChange}
                                value={this.state.query}
                                placeholder="Tìm kiếm ..."/> : null}


                        </div>
                        <div className="col-md-5">
                            <div className="card">
                                <div className="card-header card-header-icon" data-background-color="rose">
                                    <i className="material-icons">contacts</i>
                                </div>
                                <div className="card-content">
                                    <h4 className="card-title">Chọn màu</h4>
                                    <CirclePicker width="100%"
                                                  color={color || ""}
                                                  onChangeComplete={this.changeColor}
                                    />
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </div>

        );
    }
}

GroupCustomerModal.propTypes = {
    isLoadingOverlay: PropTypes.bool,
    isLoadingModal: PropTypes.bool,
    groupCustomerActions: PropTypes.object,
    groupCustomerForm: PropTypes.object,
    customersList: PropTypes.array,
    totalCustomerInOverlayPages: PropTypes.number,
    totalCustomerInModalPages: PropTypes.number,
    isEdit: PropTypes.bool,
};

function mapStateToProps(state) {
    return {
        isLoadingOverlay: state.groupCustomers.isLoadingOverlay,
        isLoadingModal: state.groupCustomers.isLoadingModal,
        customersList: state.groupCustomers.customersList,
        groupCustomerForm: state.groupCustomers.groupCustomerForm,
        totalCustomerInOverlayPages: state.groupCustomers.totalCustomerInOverlayPages,
        totalCustomerInModalPages: state.groupCustomers.totalCustomerInModalPages,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        groupCustomerActions: bindActionCreators(groupCustomerActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(GroupCustomerModal);