import React from 'react';
import {Modal} from 'react-bootstrap';
import PropTypes from 'prop-types';
import FormInputText from "../../components/common/FormInputText";
import * as helper                      from '../../helpers/helper';

class EditDepartmentModal extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            data:{
                name: '',
            } ,
        };
        this.updateFormData = this.updateFormData.bind(this);
    }

    componentWillMount(){
        helper.setFormValidation('#form-department-edit');
    }
    componentWillReceiveProps(nextProps){
        this.setState({data: nextProps.data});
    }
    componentDidMount(){
        helper.setFormValidation('#form-department-edit');
    }
    componentDidUpdate(){
        helper.setFormValidation('#form-department-edit');
    }

    updateFormData(e){
        const name = e.target.name;
        const value = e.target.value;
        let newdata = {...this.state.data};
        newdata[name] = value;
        this.setState({data: newdata});
    }


    render() {
        return (
            <Modal
                show={this.props.show}
                onHide={this.props.onHide}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Thêm bộ phận</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form role="form" id="form-department-edit">
                    <FormInputText
                        label="Tên bộ phận"
                        required
                        name="name"
                        updateFormData={this.updateFormData}
                        value={this.state.data.name}
                    />
                    {this.props.isEditingDepartment ?
                        <button className="btn btn-rose btn-fill disabled" type="button">
                            <i className="fa fa-spinner fa-spin"/> Đang tải lên
                        </button>
                        :
                        <button
                            className="btn btn-fill btn-rose"
                            type="button"
                            onClick={()=>{ if($('#form-department-edit').valid())
                                return this.props.editDepartment(this.state.data);
                            }}
                        > Lưu </button>
                    }
                    </form>
                </Modal.Body>
            </Modal>
        );
    }
}

EditDepartmentModal.propTypes = {
    show: PropTypes.bool.isRequired,
    onHide: PropTypes.func.isRequired,
    editDepartment: PropTypes.func.isRequired,
    isEditingDepartment: PropTypes.bool.isRequired,
    data: PropTypes.object.isRequired,
};

export default (EditDepartmentModal);
/**/