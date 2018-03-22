import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import eventActions from "../actions/eventActions";
import { Modal } from "react-bootstrap";
import ImageUploader from "../../../components/common/ImageUploader";
import FormInputText from "../../../components/common/FormInputText";
import ReactEditor from "../../../components/common/ReactEditor";
import { linkUploadImageEditor } from "../../../constants/constants";
import Buttons from "../components/Buttons";

class StoreEventModalContainer extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.handleFormUpdate = this.handleFormUpdate.bind(this);
        this.updateEventFormData = this.updateEventFormData.bind(this);
        this.invalid = this.invalid.bind(this);
    }

    componentDidMount() {}

    handleFormUpdate(field, value) {
        const event = {
            ...this.props.event,
        };
        event[field] = value;
        this.props.eventActions.updateEventFormData(event);
    }

    updateEventFormData(event) {
        this.handleFormUpdate(event.target.name, event.target.value);
    }

    invalid() {
        return false;
    }

    render() {
        const { props } = this;
        return (
            <Modal
                id="store-event-modal"
                show={props.showStoreEventModal}
                bsStyle="primary"
                onHide={() => {}}
                animation={false}
            >
                <Modal.Header>
                    <Modal.Title>
                        <strong>Sự kiện</strong>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form role="form" id="form-post">
                        <div className="container-fluid">
                            <div className="row">
                                <label className="label-control">
                                    Ảnh đại diện
                                </label>
                                <ImageUploader
                                    tooltipText="Chọn ảnh đại diện"
                                    handleFileUpload={url =>
                                        this.handleFormUpdate("avatar_url", url)
                                    }
                                    image_url={props.event.avatar_url}
                                />
                                <label className="label-control">
                                    Ảnh cover
                                </label>
                                <ImageUploader
                                    tooltipText="Chọn ảnh cover"
                                    handleFileUpload={url =>
                                        this.handleFormUpdate("cover_url", url)
                                    }
                                    image_url={props.event.cover_url}
                                />

                                <FormInputText
                                    height="100%"
                                    label="Tên sự kiện"
                                    required
                                    name="name"
                                    updateFormData={this.updateEventFormData}
                                    value={props.event.name || ""}
                                />

                                <FormInputText
                                    height="100%"
                                    label="địa chỉ sự kiện"
                                    required
                                    name="address"
                                    updateFormData={this.updateEventFormData}
                                    value={props.event.address || ""}
                                />

                                <label className="control-label">
                                    Meta description
                                </label>
                                <textarea
                                    className="form-control"
                                    name="meta_description"
                                    rows="3"
                                    value={props.event.meta_description || ""}
                                    onChange={this.props.updateEventFormData}
                                />

                                <label className="control-label">
                                    Keywords
                                </label>
                                <textarea
                                    className="form-control"
                                    name="keyword"
                                    rows="3"
                                    value={props.event.keyword || ""}
                                    onChange={this.props.updateFormPostData}
                                />
                                <ReactEditor
                                    urlPost={linkUploadImageEditor()}
                                    fileField="image"
                                    scrollerId="#store-event-modal"
                                    updateEditor={content =>
                                        this.handleFormUpdate("detail", content)
                                    }
                                    value={props.event.detail || ""}
                                />

                                <div className="row">
                                    <Buttons
                                        style={{
                                            width: "100%",
                                            marginLeft: "-9px"
                                        }}
                                        close={() =>
                                            props.eventActions.showStoreEventModal(
                                                false,
                                            )
                                        }
                                        scrollerId="#store-event-modal"
                                        disabled={false}
                                    />
                                </div>
                            </div>
                        </div>
                    </form>
                </Modal.Body>
            </Modal>
        );
    }
}

StoreEventModalContainer.propTypes = {
    eventActions: PropTypes.object.isRequired,
    event: PropTypes.object.isRequired,
    showStoreEventModal: PropTypes.bool.isRequired,
};

export default connect(
    state => {
        const { event, showStoreEventModal } = state.event;
        return { event, showStoreEventModal };
    },
    dispatch => {
        return {
            eventActions: bindActionCreators(eventActions, dispatch),
        };
    },
)(StoreEventModalContainer);
