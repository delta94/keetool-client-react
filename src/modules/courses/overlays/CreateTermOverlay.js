import React from 'react';
import {Overlay} from "react-bootstrap";
import * as ReactDOM from "react-dom";
import {connect} from "react-redux";
import Loading from "../../../components/common/Loading";
import {bindActionCreators} from "redux";
import FormInputText from "../../../components/common/FormInputText";
import * as helper from "../../../helpers/helper";
import * as coursesActions from '../coursesActions';
import ImageUploader from "../../../components/common/ImageUploader";

// import TooltipButton from "../../../components/common/TooltipButton";


class CreateLessonOverlay extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.initState = {
            show: false,
            term: {}
        };
        this.state = {...this.initState};
    }

    updateFormData = (event) => {
        let {name, value} = event.target;
        let res = {...this.state.term};
        res[name] = value;
        this.setState({term: res})
    };

    uploadIcon(url) {
        let term = {...this.state.term};
        term["image_url"] = url;
        this.setState({term});
    }

    componentDidMount() {
        helper.setFormValidation('#form-term');
    }

    submit = (e) => {
        e.stopPropagation();
        if ($('#form-term').valid()) {
            this.props.coursesActions.createTerm({...this.state.term, course_id: this.props.course.id}, () => {
                this.close();
            });
        }
    };


    toggle = () => {
        this.setState({show: !this.state.show});
    };


    close = () => {
        this.setState(this.initState);
    };

    render() {
        const {
            className,
            isLoading, isUploadingTerm
        } = this.props;
        const {
            term
        } = this.state;

        return (

            <div style={{position: "relative"}}>
                <div className={className}
                     ref="target" onClick={this.toggle}>
                    Thêm học phần
                </div>
                <Overlay
                    rootClose={true}
                    show={this.state.show}
                    onHide={this.close}
                    placement="bottom"
                    container={this}
                    target={() => ReactDOM.findDOMNode(this.refs.target)}>
                    <div className="kt-overlay overlay-container" style={{width: 300, marginTop: 10}}>
                        <div style={{display: "flex", justifyContent: "space-between", alignItems: 'center'}}>
                            <div><b>Tạo mới</b></div>
                            <button
                                onClick={this.close}
                                type="button" className="close"
                                style={{color: '#5a5a5a'}}>
                                <span aria-hidden="true">×</span>
                                <span className="sr-only">Close</span>
                            </button>
                        </div>
                        {isLoading && <Loading/>}
                        {!isUploadingTerm && !isLoading &&
                        <form role="form" id="form-term">

                            <div>
                                <label>Tên học phần</label>
                                <FormInputText
                                    name="name"
                                    placeholder="Tên học phần"
                                    required
                                    value={term.name}
                                    updateFormData={this.updateFormData}
                                />
                            </div>
                            <div>
                                <label>Thứ tự</label>
                                <FormInputText
                                    placeholder="Thứ tự"
                                    required
                                    type="number"
                                    name="order"
                                    updateFormData={this.updateFormData}
                                    value={term.order}
                                />
                            </div>
                            <div>
                                <label>Mô tả ngắn</label>
                                <FormInputText
                                    placeholder="Mô tả ngắn"
                                    required
                                    name="description"
                                    updateFormData={this.updateFormData}
                                    value={term.description}
                                />
                            </div>
                            <div className="panel panel-default">
                                <div className="panel-heading" role="tab"
                                     id="headingTwo">
                                    <a className="collapsed" role="button"
                                       data-toggle="collapse"
                                       data-parent="#accordion"
                                       href="#collapseTwo" aria-expanded="false"
                                       aria-controls="collapseTwo">
                                        <h4 className="panel-title">
                                            Mở rộng
                                            <i className="material-icons">arrow_drop_down</i>
                                        </h4>
                                    </a>
                                </div>
                                <div id="collapseTwo"
                                     className="panel-collapse collapse"
                                     role="tabpanel"
                                     aria-labelledby="headingTwo"
                                     aria-expanded="false"
                                     style={{height: '0px'}}>
                                    <div className="panel-body">

                                        <div>
                                            <label>Ảnh icon</label>
                                            <ImageUploader
                                                handleFileUpload={this.uploadIcon}
                                                tooltipText="Chọn ảnh icon"
                                                image_url={term.image_url}
                                                image_size={2}
                                            />
                                        </div>
                                        <div>
                                            <label>Link audio</label>
                                            <FormInputText
                                                placeholder="Link audio"
                                                name="audio_url"
                                                updateFormData={this.updateFormData}
                                                value={term.audio_url}
                                            />
                                        </div>
                                        <div>
                                            <label>Link video</label>
                                            <FormInputText
                                                placeholder="Link video"
                                                name="video_url"
                                                updateFormData={this.updateFormData}
                                                value={term.video_url}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>

                        }
                        {isUploadingTerm && <Loading/>}
                        {!(isUploadingTerm || isLoading) &&
                        <div className="flex">
                            <button type="button"
                                    disabled={isUploadingTerm || isLoading}
                                    className="btn btn-white width-50-percent text-center"
                                    data-dismiss="modal"
                                    onClick={this.close}>Hủy
                            </button>
                            <button type="button"
                                    className="btn btn-success width-50-percent text-center"
                                    disabled={isUploadingTerm || isLoading}
                                    style={{backgroundColor: '#2acc4c'}}
                                    onClick={(e) => this.submit(e)}>
                                Hoàn tất
                            </button>
                        </div>}

                    </div>
                </Overlay>
            </div>


        );
    }
}

function mapStateToProps(state) {
    return {
        isLoading: state.courses.isLoading,
        isUploadingTerm: state.courses.isUploadingTerm,
        course: state.courses.data,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        coursesActions: bindActionCreators(coursesActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateLessonOverlay);
