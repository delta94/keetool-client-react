import React from "react";
import FormInputText from "../../components/common/FormInputText";
import Loading from "../../components/common/Loading";
import {linkUploadImageEditor} from "../../constants/constants";
import ReactEditor from "../../components/common/ReactEditor";
import * as helper from "../../helpers/helper";
import {NO_IMAGE} from "../../constants/env";
import PropTypes from "prop-types";
import TooltipButton from "../../components/common/TooltipButton";
import AddCategoryModal from "./AddCategoryModal";
import {Modal} from "react-bootstrap";
import Buttons from "../event/components/Buttons";

import ReactSelect from "react-select";
import MemberReactSelectValue from "./MemberReactSelectValue";
import MemberReactSelectOption from "./MemberReactSelectOption";
import AddLanguageModal from "./AddLanguageModal";


function addSelect(categories) {
    return categories.map(item => {
        return {value: item.value, label: item.text};
    });
}

function addLanguage(languages) {
    return languages.map(item => {
        return {value: item.id, label: item.name};
    });
}


class StorePostComponent extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            isOpenModal: false,
            isOpenLanguageModal: false,
        };
        this.openAddCategoryModal = this.openAddCategoryModal.bind(this);
        this.closeAddCategoryModal = this.closeAddCategoryModal.bind(this);
        this.closeAddLanguageModal = this.closeAddLanguageModal.bind(this);
        this.openAddLanguageModal = this.openAddLanguageModal.bind(this);
        this.generateFromTitle = this.generateFromTitle.bind(this);
        this.invalid = this.invalid.bind(this);
    }

    componentDidMount() {
        helper.setFormValidation("#form-post");
        helper.setFormValidation("#form-category");
    }

    componentDidUpdate() {
        $("#tags").tagsinput();
    }

    generateFromTitle() {
        if (this.props.post.title === "") {
            helper.showErrorMessage("Lỗi", "Bài viết này chưa có Tiêu Đề");
        } else {
            const slug = helper.changeToSlug(this.props.post.title);
            this.props.updateFormData("slug", slug);
        }

    }

    openAddCategoryModal() {
        this.setState({isOpenModal: true});
        this.props.openModal();
    }

    openAddLanguageModal() {
        this.setState({isOpenLanguageModal: true});
    }

    closeAddLanguageModal() {
        this.setState({isOpenLanguageModal: false});
    }

    closeAddCategoryModal() {
        this.setState({isOpenModal: false});
    }

    invalid() {
        const {title, slug, imageUrl} = this.props.post;
        return !title || !slug || !imageUrl;
    }

    render() {
        let {
            title,
            description,
            content,
            imageUrl,
            tags,
            // category,
            categories,
            isUpdatingImage,
            slug,
            meta_title,
            keyword,
            meta_description,
            language,
        } = this.props.post;

        return (
            <div>
                <form role="form" id="form-post">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-md-12">
                                {this.props.isLoadingPost
                                || this.props.isLoadingLanguages
                                    ? (
                                        <Loading/>
                                    ) : (
                                        <div className="row">
                                            <label className="label-control">
                                                Ảnh đại diện
                                            </label>
                                            {isUpdatingImage ? (
                                                <Loading/>
                                            ) : (
                                                <TooltipButton
                                                    text="Chọn ảnh đại diện"
                                                    placement="top"
                                                >
                                                    <a
                                                        type="button"
                                                        style={{
                                                            width: "100%",
                                                            marginBottom: "10px",
                                                            textAlign: "center",
                                                            verticalAlign: "middle",
                                                            border: "0 none",
                                                            display: "inline-block",
                                                        }}
                                                    >
                                                        <img
                                                            src={
                                                                helper.isEmptyInput(
                                                                    imageUrl,
                                                                )
                                                                    ? NO_IMAGE
                                                                    : imageUrl
                                                            }
                                                            style={{
                                                                lineHeight: "164px",
                                                                height: "auto",
                                                                width: "100%",
                                                                display: "block",
                                                                backgroundSize:
                                                                    "cover",
                                                                backgroundPosition:
                                                                    "center",
                                                                boxShadow:
                                                                    " 0 10px 30px -12px rgba(0, 0, 0, 0.42), 0 4px 25px 0px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.2)",
                                                                borderRadius:
                                                                    "10px",
                                                            }}
                                                        />
                                                        <input
                                                            type="file"
                                                            accept=".jpg,.png,.gif"
                                                            onChange={
                                                                this.props
                                                                    .handleFileUpload
                                                            }
                                                            style={{
                                                                cursor: "pointer",
                                                                opacity: "0.0",
                                                                position:
                                                                    "absolute",
                                                                top: 0,
                                                                left: 0,
                                                                bottom: 0,
                                                                right: 0,
                                                                width: "100%",
                                                                height: "100%",
                                                            }}
                                                        />
                                                    </a>
                                                </TooltipButton>
                                            )}

                                            <FormInputText
                                                label="Tên bài viết"
                                                required
                                                name="title"
                                                updateFormData={
                                                    this.props.updateFormPostData
                                                }
                                                value={title}
                                            />






                                            <label className="label-control">
                                                Ngôn ngữ
                                            </label>
                                            <div className="row">
                                                <div className="col-md-12"
                                                     style={{display: "flex"}}
                                                >
                                                    <div
                                                        style={{
                                                            width:
                                                                "-webkit-fill-available",
                                                            marginRight: 10,
                                                        }}
                                                    >
                                                        <ReactSelect
                                                            value={language}
                                                            options={addLanguage(this.props.languages)}
                                                            onChange={this.props.updateLanguage}
                                                            placeholder="Chọn ngôn ngữ"
                                                        />
                                                    </div>
                                                    <div
                                                        style={{marginTop: -6,}}>

                                                        <TooltipButton
                                                            placement="top"
                                                            text="Thêm ngôn ngữ"
                                                        >
                                                            <a
                                                                className="btn btn-rose btn-sm"
                                                                onClick={() => {
                                                                    this.openAddLanguageModal();
                                                                }}
                                                            >
                                                                <i className="material-icons">
                                                                    control_point
                                                                </i>
                                                            </a>
                                                        </TooltipButton>
                                                    </div>
                                                </div>
                                            </div>


                                            <FormInputText
                                                height="100%"
                                                label="Slug"
                                                required
                                                name="slug"
                                                updateFormData={
                                                    this.props.updateFormPostData
                                                }
                                                value={slug}
                                            >
                                                <a
                                                    style={{color: "blue"}}
                                                    onClick={this.generateFromTitle}
                                                >
                                                    Tự động tạo từ tiêu đề
                                                </a>
                                            </FormInputText>

                                            <label className="label-control">
                                                Nhóm bài viết
                                            </label>
                                            <div className="row">
                                                <div
                                                    className="col-md-12"
                                                    style={{display: "flex"}}
                                                >
                                                    <div
                                                        style={{
                                                            width:
                                                                "-webkit-fill-available",
                                                            marginRight: 10,
                                                        }}
                                                    >
                                                        <ReactSelect
                                                            multi={true}
                                                            value={categories}
                                                            // value={category}
                                                            valueComponent={MemberReactSelectValue}
                                                            optionComponent={MemberReactSelectOption}
                                                            options={addSelect(this.props.categories)}
                                                            onChange={this.props.updateFormSelect}
                                                            placeholder="Chọn nhóm"
                                                        />
                                                    </div>
                                                    <div
                                                        style={{
                                                            marginTop: -6,
                                                        }}
                                                    >
                                                        <TooltipButton
                                                            placement="top"
                                                            text="Thêm nhóm bài viết"
                                                        >
                                                            <a
                                                                className="btn btn-rose btn-sm"
                                                                onClick={() => {
                                                                    this.openAddCategoryModal(
                                                                        {},
                                                                    );
                                                                }}
                                                            >
                                                                <i className="material-icons">
                                                                    control_point
                                                                </i>
                                                            </a>
                                                        </TooltipButton>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="form-group">
                                                <label className="control-label">
                                                    Mô tả ngắn
                                                </label>
                                                <textarea
                                                    className="form-control"
                                                    name="description"
                                                    rows="3"
                                                    value={description}
                                                    onChange={
                                                        this.props
                                                            .updateFormPostData
                                                    }
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label className="control-label">
                                                    Meta title
                                                </label>
                                                <textarea
                                                    className="form-control"
                                                    name="meta_title"
                                                    rows="3"
                                                    value={meta_title}
                                                    onChange={
                                                        this.props
                                                            .updateFormPostData
                                                    }
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label className="control-label">
                                                    Meta description
                                                </label>
                                                <textarea
                                                    className="form-control"
                                                    name="meta_description"
                                                    rows="3"
                                                    value={meta_description}
                                                    onChange={
                                                        this.props
                                                            .updateFormPostData
                                                    }
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label className="control-label">
                                                    Keywords
                                                </label>
                                                <textarea
                                                    className="form-control"
                                                    name="keyword"
                                                    rows="3"
                                                    value={keyword}
                                                    onChange={
                                                        this.props
                                                            .updateFormPostData
                                                    }
                                                />
                                            </div>


                                            <input
                                                type="text"
                                                className="tagsinput"
                                                data-role="tagsinput"
                                                data-color="rose"
                                                value={tags}
                                                name="tags"
                                                placeholder="Tags"
                                                id="tags"
                                            />
                                        </div>
                                    )}

                                <div className="row">
                                    <label className="control-label">
                                        Nội dung
                                    </label>
                                    <star style={{color: "red"}}>*</star>
                                    {this.props.isLoadingPost ? (
                                        <Loading/>
                                    ) : (
                                        <div>
                                            <ReactEditor
                                                urlPost={linkUploadImageEditor()}
                                                fileField="image"
                                                scrollerId="#store-post-modal"
                                                updateEditor={
                                                    this.props.updateEditor
                                                }
                                                value={content}
                                            />

                                            <div className="row">
                                                <Buttons
                                                    isSaving={
                                                        this.props.post
                                                            .isSaving ||
                                                        this.props.post
                                                            .isPreSaving
                                                    }
                                                    save={() =>
                                                        this.props.preSavePost(
                                                            false,
                                                        )
                                                    }
                                                    preSave={() =>
                                                        this.props.preSavePost(
                                                            true,
                                                        )
                                                    }
                                                    publish={
                                                        this.props.savePost
                                                    }
                                                    style={{
                                                        width:
                                                            "calc(100% + 48px)",
                                                        marginLeft: "-9px",
                                                    }}
                                                    height={235}
                                                    close={
                                                        this.props.closeModal
                                                    }
                                                    scrollerId="#store-post-modal"
                                                    disabled={this.invalid()}
                                                />
                                            </div>
                                            {/*<div id = "mini-editor"/>*/}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </form>

                <Modal
                    show={this.state.isOpenModal}
                    bsSize="sm"
                    bsStyle="primary"
                    onHide={this.closeAddCategoryModal}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>
                            <h4 className="card-title">Thêm nhóm bài viết</h4>
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <AddCategoryModal
                            category={this.props.category}
                            updateFormCategory={this.props.updateFormCategory}
                            createCategory={this.props.createCategory}
                            closeAddCategoryModal={this.closeAddCategoryModal}
                        />
                    </Modal.Body>
                </Modal>


                <Modal
                    show={this.state.isOpenLanguageModal}
                    bsSize="sm"
                    bsStyle="primary"
                    onHide={this.closeAddLanguageModal}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>
                            <h4 className="card-title">Thêm ngôn ngữ</h4>
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <AddLanguageModal
                            language={this.props.language}
                            updateFormLanguage={this.props.updateFormLanguage}
                            createLanguage={this.props.createLanguage}
                            closeAddLanguageModal={this.closeAddLanguageModal}
                            isCreatingLanguage={this.props.isCreatingLanguage}
                        />
                    </Modal.Body>
                </Modal>
            </div>
        );
    }
}

StorePostComponent.propTypes = {
    post: PropTypes.object.isRequired,
    updateFormPostData: PropTypes.func.isRequired,
    updateFormData: PropTypes.func.isRequired,
    updateLanguage: PropTypes.func.isRequired,
    updateEditor: PropTypes.func.isRequired,
    preSavePost: PropTypes.func.isRequired,
    savePost: PropTypes.func.isRequired,
    handleFileUpload: PropTypes.func.isRequired,
    openModal: PropTypes.func.isRequired,
    updateFormSelect: PropTypes.func.isRequired,
    updateFormCategory: PropTypes.func.isRequired,
    updateFormLanguage: PropTypes.func.isRequired,
    // resetCategory: PropTypes.func.isRequired,
    closeModal: PropTypes.func.isRequired,
    categories: PropTypes.array.isRequired,
    languages: PropTypes.array.isRequired,
    category: PropTypes.object.isRequired,
    language: PropTypes.object.isRequired,
    createCategory: PropTypes.func.isRequired,
    createLanguage: PropTypes.func.isRequired,
    isLoadingPost: PropTypes.bool.isRequired,
    isLoadingLanguages: PropTypes.bool.isRequired,
    isCreatingLanguage: PropTypes.bool.isRequired,
    isSaving: PropTypes.bool.isRequired,
    isPreSaving: PropTypes.bool.isRequired,
};

export default StorePostComponent;
