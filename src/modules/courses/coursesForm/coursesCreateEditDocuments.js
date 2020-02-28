import React from 'react';
import PropTypes from 'prop-types';
// import {Link} from 'react-router';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as coursesActions from '../coursesActions';
import ButtonGroupAction from "../../../components/common/ButtonGroupAction";
import {Modal} from 'react-bootstrap';
import FormInputText from '../../../components/common/FormInputText';
import {NO_IMAGE} from '../../../constants/env';
import * as helper from '../../../helpers/helper';
import CreateDocumentOverlay from "../overlays/CreateDocumentOverlay";
import EmptyData from "../../../components/common/EmptyData";

function validateLink(link) {
    if (helper.isEmptyInput(link)) return NO_IMAGE;
    if (link.substring(0, 4) === 'http') {
        return link;
    }
    return 'http://' + link;
}


class coursesCreateEditDocuments extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            openModal: false,
            currentLink: 0,
            link: {
                id: "",
                course_id: "",
                link_icon_url: "",
                link_name: "",
                link_description: "",
                link_url: "1",
            },
        };
        this.isCreate = true;
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.updateLinkData = this.updateLinkData.bind(this);
        this.uploadLinkIcon = this.uploadLinkIcon.bind(this);
        this.openModalEditLink = this.openModalEditLink.bind(this);
        this.commitLink = this.commitLink.bind(this);
        this.deleteLink = this.deleteLink.bind(this);
        this.checkValidate = this.checkValidate.bind(this);
    }

    componentWillMount() {
        helper.setFormValidation('#form-edit-link');
    }

    componentWillReceiveProps() {
        helper.setFormValidation('#form-edit-link');
    }

    componentDidUpdate() {
        helper.setFormValidation('#form-edit-link');
    }

    updateEditor(content) {
        let data = {...this.props.data};
        data.detail = content;
        this.props.coursesActions.updateData(data);
    }

    uploadAvatar(event) {
        let file = event.target.files[0];
        if (helper.checkFileSize(file, 2))
            this.props.coursesActions.uploadAvatar(file);
    }

    uploadLogo(event) {
        let file = event.target.files[0];
        if (helper.checkFileSize(file, 2))
            this.props.coursesActions.uploadLogo(file);

    }

    uploadCover(event) {
        let file = event.target.files[0];
        if (helper.checkFileSize(file, 2))
            this.props.coursesActions.uploadCover(file);
    }

    changeColor(color) {
        let data = {...this.props.data};
        data.color = color.hex;
        this.props.coursesActions.updateData(data);
    }

    openModal() {
        this.isCreate = true;
        this.setState({openModal: true});
        let link = {
            link_icon_url: "",
            link_name: "",
            link_description: "",
            link_url: "",
        };
        this.props.coursesActions.editLink(link);
    }

    closeModal() {
        this.setState({openModal: false});
        //this.props.coursesActions.loadOneCourse(this.props.data.id);
    }

    uploadLinkIcon(event) {
        let file = event.target.files[0];
        if (helper.checkFileSize(file, 2))
            this.props.coursesActions.uploadLinkIcon(this.props.link, file);
    }

    openModalEditLink(link) {
        this.isCreate = false;
        this.setState({openModal: true});
        this.props.coursesActions.editLink(link);
    }

    deleteLink(id) {
        helper.confirm('error', 'Xóa', "Bạn có muốn xóa link này không?", () => {
            this.props.coursesActions.deleteLink(id);
        });
    }


    updateLinkData(e) {
        const feild = e.target.name;
        const value = e.target.value;
        let link = {...this.props.link};
        link.course_id = this.props.data.id;
        link[feild] = value;
        this.props.coursesActions.updateLinkData(link);
    }

    commitLink() {
        if (this.checkValidate())
            if (this.isCreate) {
                this.props.coursesActions.createLink(this.props.link, () => {
                    this.setState({openModal: false});
                    this.props.coursesActions.loadOneCourse(this.props.data.id);
                });
            } else {
                this.props.coursesActions.commitEditLink(this.props.link, () => {
                    this.setState({openModal: false});
                    this.props.coursesActions.loadOneCourse(this.props.data.id);
                });
            }


    }

    checkValidate() {

        if ($('#form-edit-link').valid()) {

            if (helper.isEmptyInput(this.props.link.link_icon_url)) {
                helper.showTypeNotification('Vui lòng chọn ảnh icon', 'warning');
                return false;
            }

            return true;
        }
        return false;
    }

    render() {

        return (
            <div>
                <div className="flex flex-wrap" style={{marginTop: 15}}>
                    <CreateDocumentOverlay className="btn btn-silver"/>
                </div>

                <div className="table-responsive">

                    <table id="datatables"
                           className="table white-table table-striped table-no-bordered table-hover"
                           cellSpacing="0" width="100%" style={{width: "100%"}}>
                        <tbody>
                        {this.props.data.links && this.props.data.links.length > 0 ? this.props.data.links.map((link) => {
                            return (
                                <tr key={link.id}>
                                    <td><strong>{link.link_name}</strong></td>
                                    <td>
                                        <a href={validateLink(link.link_url)} target="_blank">
                                            <p style={{
                                                maxWidth: "100px",
                                                wordWrap: 'break-word',
                                                whiteSpace: 'initial',
                                                color: '#47B0E1'
                                            }}>
                                                {link.link_url}
                                            </p>
                                        </a>
                                    </td>
                                    <td>{link.link_description}</td>
                                    <td style={{width: 50}}>
                                        <ButtonGroupAction
                                            edit={() => {
                                                return this.openModalEditLink(link);
                                            }}
                                            delete={() => {
                                                return this.deleteLink(link.id);
                                            }}
                                            object={link}
                                        />
                                    </td>
                                </tr>
                            );

                        }) : <EmptyData/>}
                        </tbody>
                    </table>
                </div>
                <Modal show={this.state.openModal} onHide={this.closeModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Chỉnh sửa link</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form id="form-edit-link" onSubmit={(e) => {
                            e.preventDefault();
                        }}>
                            <div className="row">
                                <div className="col-md-12">
                                    <img
                                        width={"100%"}
                                        src={
                                            helper.isEmptyInput(this.props.link.link_icon_url)
                                                ?
                                                NO_IMAGE
                                                :
                                                this.props.link.link_icon_url}
                                    />
                                </div>
                                <div className="col-md-12">
                                    {this.props.isUploadingLinkIcon ?
                                        (
                                            <button className="btn btn-rose btn-round disabled" type="button">
                                                <i className="fa fa-spinner fa-spin"/> Đang tải lên
                                            </button>
                                        )
                                        :
                                        (
                                            <button className="btn btn-fill btn-rose" type="button">
                                                Chọn ảnh icon
                                                <input type="file"
                                                       accept=".jpg,.png,.gif"
                                                       onChange={this.uploadLinkIcon}
                                                       style={{
                                                           cursor: 'pointer',
                                                           opacity: "0.0",
                                                           position: "absolute",
                                                           top: 0,
                                                           left: 0,
                                                           bottom: 0,
                                                           right: 0,
                                                           width: "100%",
                                                           height: "100%"
                                                       }}
                                                />
                                            </button>
                                        )
                                    }
                                </div>
                                <div className="col-md-12">
                                    <FormInputText
                                        label="Tên link"
                                        name="link_name"
                                        required
                                        updateFormData={this.updateLinkData}
                                        value={this.props.link.link_name}
                                        type="text"
                                        disabled={this.props.isUploadingLinkIcon}
                                    />
                                </div>
                                <div className="col-md-12">
                                    <FormInputText
                                        label="Mô tả"
                                        name="link_description"
                                        required
                                        updateFormData={this.updateLinkData}
                                        value={this.props.link.link_description}
                                        type="text"
                                        disabled={this.props.isUploadingLinkIcon}
                                    />
                                </div>
                                <div className="col-md-12">
                                    <FormInputText
                                        label="Đường dẫn url"
                                        name="link_url"
                                        required
                                        updateFormData={this.updateLinkData}
                                        value={this.props.link.link_url}
                                        type="text"
                                        disabled={this.props.isUploadingLinkIcon}
                                    />
                                </div>
                            </div>
                            {this.props.isUploadingLink ?
                                (
                                    <button
                                        className="btn btn-fill btn-rose disabled"
                                    >
                                        <i className="fa fa-spinner fa-spin"/> Đang cập nhật
                                    </button>
                                )
                                :
                                <div>
                                    <button className="btn btn-rose"
                                            onClick={this.commitLink}
                                            disabled={this.props.isUploadingLinkIcon}
                                    > Cập nhật
                                    </button>
                                    <button className="btn btn-rose"
                                            onClick={this.closeModal}
                                            disabled={this.props.isUploadingLinkIcon}
                                    > Huỷ
                                    </button>
                                </div>
                            }

                        </form>
                    </Modal.Body>
                </Modal>
            </div>
        );
    }

}

coursesCreateEditDocuments.propTypes = {
    isLoading: PropTypes.bool.isRequired,
    isUploadingLinkIcon: PropTypes.bool.isRequired,
    isUploadingLink: PropTypes.bool.isRequired,
    data: PropTypes.object,
    link: PropTypes.object,
    coursesActions: PropTypes.object.isRequired,
    loadOneCourse: PropTypes.func,
    createLink: PropTypes.func,
    commitEditLink: PropTypes.func,
    editLink: PropTypes.func,
};

function mapStateToProps(state) {
    return {
        isLoading: state.courses.isLoading,
        isUploadingLink: state.courses.isUploadingLink,
        isUploadingLinkIcon: state.courses.isUploadingLinkIcon,
        data: state.courses.data,
        link: state.courses.link,

    };
}

function mapDispatchToProps(dispatch) {
    return {
        coursesActions: bindActionCreators(coursesActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(coursesCreateEditDocuments);

