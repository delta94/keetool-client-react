/**
 * Created by phanmduong on 9/1/17.
 */
import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {Link, IndexLink} from 'react-router';
import {bindActionCreators} from 'redux';
import * as studentActions from './studentActions';
import * as helper from '../../helpers/helper';
import {NO_AVATAR, PROTOCOL} from '../../constants/env';
import Loading from '../../components/common/Loading';
import {Modal} from 'react-bootstrap';
import FormInputText from '../../components/common/FormInputText';

class InfoStudentContainer extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.studentId = this.props.params.studentId;
        this.path = '';
        this.closeModal = this.closeModal.bind(this);
        this.openModal = this.openModal.bind(this);
        this.updateFormData = this.updateFormData.bind(this);
        this.editInfoStudent = this.editInfoStudent.bind(this);
        this.state = {
            showModal: false,
            student: {}
        };
    }

    componentWillMount() {
        this.props.studentActions.loadInfoStudent(this.studentId);
    }

    componentDidUpdate() {
        helper.setFormValidation('#form-edit-student');
    }

    updateFormData(event) {
        const field = event.target.name;
        let student = {...this.state.student};
        student[field] = event.target.value;
        this.setState(
            {
                student: student
            }
        );
    }

    closeModal() {
        this.setState({showModal: false});
    }

    openModal() {
        this.setState(
            {
                showModal: true,
                student: this.props.student
            }
        );
    }

    editInfoStudent() {
        if ($('#form-edit-student').valid()) {
            this.props.studentActions.editInfoStudent(this.state.student, this.closeModal);
        }
    }

    render() {
        this.path = this.props.location.pathname;
        return (
            <div>
                <div className="row">
                    <div className="col-md-8">
                        <div className="card">
                            <div className="card-header card-header-tabs" data-background-color="rose">
                                <div className="nav-tabs-navigation">
                                    <div className="nav-tabs-wrapper">
                                        <ul className="nav nav-tabs" data-tabs="tabs">
                                            <li className={this.path === `/teaching/info-student/${this.studentId}` ? 'active' : ''}>
                                                <IndexLink to={`/teaching/info-student/${this.studentId}`}>
                                                    <i className="material-icons">add_box</i> Đăng kí

                                                    <div className="ripple-container"/>
                                                </IndexLink>
                                            </li>
                                            <li className={this.path === `/teaching/info-student/${this.studentId}/history-calls` ? 'active' : ''}>
                                                <Link to={`/teaching/info-student/${this.studentId}/history-calls`}>
                                                    <i className="material-icons">smartphone</i> Cuộc gọi
                                                    <div className="ripple-container"/>
                                                </Link>
                                            </li>
                                            <li className={this.path === `/teaching/info-student/${this.studentId}/progress` ? 'active' : ''}>
                                                <Link to={`/teaching/info-student/${this.studentId}/progress`}>
                                                    <i className="material-icons">create</i> Học tập
                                                    <div className="ripple-container"/>
                                                </Link>
                                            </li>
                                            <li className={this.path === `/teaching/info-student/${this.studentId}/care` ? 'active' : ''}>
                                                <Link to={`/teaching/info-student/${this.studentId}/care`}>
                                                    <i className="material-icons">flag</i> Quan tâm
                                                    <div className="ripple-container"/>
                                                </Link>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className="card-content">
                                <div className="tab-content">
                                    {this.props.children}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="card card-profile">
                                    <div className="card-avatar">
                                        <a>
                                            <img className="img"
                                                 src={helper.isEmptyInput(this.props.student.avatar_url) ?
                                                     NO_AVATAR : PROTOCOL + this.props.student.avatar_url
                                                 }/>
                                        </a>
                                    </div>
                                    {this.props.isLoadingStudent ? <Loading/>
                                        :
                                        <div className="card-content">
                                            <h4 className="card-title">{this.props.student.name}</h4>
                                            <h6 className="category text-gray text-email">{this.props.student.email}</h6>
                                            <p className="description">{this.props.student.phone}</p>
                                            {this.props.isEditingStudent ?
                                                (
                                                    <button
                                                        className="btn btn-fill btn-rose disabled"
                                                    >
                                                        <i className="fa fa-spinner fa-spin"/> Đang sửa
                                                    </button>
                                                )
                                                :
                                                <button className="btn btn-rose"
                                                        onClick={this.openModal}
                                                >Sửa
                                                </button>
                                            }
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Modal show={this.state.showModal} onHide={this.closeModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Chỉnh sửa thông tin học viên</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form id="form-edit-student" onSubmit={(e) => {
                            e.preventDefault();
                        }}>
                            <FormInputText
                                label="Họ và tên"
                                name="name"
                                updateFormData={this.updateFormData}
                                value={this.state.student.name}
                                type="text"
                            />
                            <FormInputText
                                label="Email"
                                name="email"
                                updateFormData={this.updateFormData}
                                value={this.state.student.email}
                                required={true}
                                type="email"
                            />
                            <FormInputText
                                label="Số điện thoại"
                                name="phone"
                                value={this.state.student.phone}
                                type="text"
                                updateFormData={this.updateFormData}
                            />
                            {this.props.isEditingStudent ?
                                (
                                    <button
                                        className="btn btn-fill btn-rose disabled"
                                    >
                                        <i className="fa fa-spinner fa-spin"/> Đang cập nhật
                                    </button>
                                )
                                :
                                <button className="btn btn-rose"
                                        onClick={this.editInfoStudent}
                                > Cập nhật
                                </button>
                            }

                        </form>
                    </Modal.Body>
                </Modal>
            </div>
        );
    }
}


InfoStudentContainer.contextTypes = {
    router: PropTypes.object
};

InfoStudentContainer.propTypes = {
    student: PropTypes.object.isRequired,
    studentActions: PropTypes.object.isRequired,
    isLoadingStudent: PropTypes.bool.isRequired,
    isEditingStudent: PropTypes.bool.isRequired,
    children: PropTypes.element,
    pathname: PropTypes.string,
    location: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
    return {
        student: state.infoStudent.student,
        isLoadingStudent: state.infoStudent.isLoadingStudent,
        isEditingStudent: state.infoStudent.isEditingStudent
    };
}

function mapDispatchToProps(dispatch) {
    return {
        studentActions: bindActionCreators(studentActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(InfoStudentContainer);
