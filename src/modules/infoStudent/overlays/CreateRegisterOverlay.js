import React from 'react';
import PropTypes from 'prop-types';
import {Overlay} from "react-bootstrap";
import * as ReactDOM from "react-dom";
import {connect} from "react-redux";
import Loading from "../../../components/common/Loading";
import {bindActionCreators} from "redux";
import * as createRegisterActions from "../../registerStudents/createRegisterActions";
import FormInputText from "../../../components/common/FormInputText";
import MemberReactSelectOption from "../../registerStudents/MemberReactSelectOption";
import MemberReactSelectValue from "../../registerStudents/MemberReactSelectValue";
import {GENDER} from "../../../constants/constants";
import FormInputDate from "../../../components/common/FormInputDate";
import ReactSelect from "react-select";
import * as helper from "../../../helpers/helper";
import * as studentActions from "../studentActions";
import * as registerActions from "../../registerStudents/registerActions";


function addSelectSaler(items) {
    return items && items.map(item => {
        return {
            value: item.id,
            label: item.name,
            icon_url: item.avatar_url,
        };
    });
}

function addSelectCourse(items) {
    return items && items.map(item => {
        return {
            value: item.id,
            label: item.name,
            icon_url: item.icon_url,
        };
    });
}

function addSelectCampaign(items) {
    return items && items.map(item => {
        return {
            value: item.id,
            label: item.name,
        };
    });
}

function addSelectClass(items) {
    return items && items.map(item => {
        return {value: item.id, label: item.name + " - " + item.date_start + " - " + item.study_time};
    });
}

class CreateRegisterOverlay extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.initState = {
            show: false,
            register: {...this.props.student, saler_id: this.props.user && this.props.user.id},
        };
        this.state = this.initState;
    }

    componentWillMount() {
        this.props.createRegisterActions.loadCourses();
        this.props.createRegisterActions.loadCampaigns();
        this.props.createRegisterActions.loadAllProvinces();
        if(!this.props.isLoadingSources)
            this.props.createRegisterActions.loadSources();
        this.props.registerActions.loadSalerFilter();
    }

    updateFormData = (event) => {
        const {name, value} = event.target;
        let register = {...this.state.register};
        register[name] = value;
        this.setState({register});
    };

    updateCampaign = (e) => {
        let register = {...this.state.register};
        register["campaign_id"] = e.value;
        this.setState({register});
    };

    updateCourse = (e) => {
        let register = {...this.state.register};
        register["course_id"] = e.value;
        this.setState({register});
        this.props.createRegisterActions.loadClassesByCourse(e.value);
    };

    updateGender = (e) => {
        let register = {...this.state.register};
        register["gender"] = e.value;
        this.setState({register});
    };
    updateAddress = (e) => {
        let register = {...this.state.register};
        register["address"] = e.value;
        this.setState({register});
    };

    updateClass = (e) => {
        let register = {...this.state.register};
        register["class_id"] = e.value;
        this.setState({register});
    };
    updateSaler = (e) => {
        let register = {...this.state.register};
        register["saler_id"] = e ? e.value : null;
        this.setState({register});
    };
    updateSource = (e) => {
        let register = {...this.state.register};
        register["source_id"] = e ? e.value : null;
        this.setState({register});
    };

    getDataAddress = () => {
        if (!this.props.provinces || this.props.provinces.length <= 0) return;
        let address = [];

        this.props.provinces.forEach((province) => {
            province.districts.forEach((district) => {
                address = [...address, {
                    value: `${district.type} ${district.name}, ${province.type} ${province.name}`,
                    label: `${district.type} ${district.name}, ${province.type} ${province.name}`,
                }];
            });

        });
        return address;
    };

    createRegister = (e) => {

        if (this.state.register.name === null || this.state.register.name === undefined || this.state.register.name === "") {
            helper.showTypeNotification("Vui lòng nhập tên", 'warning');
            return;
        }
        if (this.state.register.phone === null || this.state.register.phone === undefined || this.state.register.phone === "") {
            helper.showTypeNotification("Vui lòng nhập số điện thoại", 'warning');
            return;
        }
        if (this.state.register.email === null || this.state.register.email === undefined || this.state.register.email === "") {
            helper.showTypeNotification("Vui lòng nhập email", 'warning');
            return;
        }
        this.props.createRegisterActions.createRegister(this.state.register, () => {
            this.props.studentActions.loadRegisters(this.props.studentId);
            this.close();
        });
        e.preventDefault();
    };

    toggle = () => {
        this.setState({show: !this.state.show});
    };


    close = () => {
        this.setState(this.initState);
    };

    render() {
        let {isSavingRegister, salers,sources} = this.props;
        let {register} = this.state;
        console.log(register)
        return (

            <div style={{position: "relative"}} className="">
                <button className="btn btn-register-action" mask="create"
                        ref="target" onClick={this.toggle}
                        disabled={isSavingRegister}>
                    Tạo đăng kí mới
                </button>
                <Overlay
                    rootClose={true}
                    show={this.state.show}
                    onHide={this.close}
                    placement="bottom"
                    container={this}
                    target={() => ReactDOM.findDOMNode(this.refs.target)}>
                    <div className="kt-overlay overlay-call-register" style={{width: 300, marginTop: 10}}>
                        <div style={{display: "flex", justifyContent: "space-between", alignItems: 'center'}}>
                            <div><b>Tạo đăng kí mới</b></div>
                            <button
                                onClick={this.close}
                                type="button" className="close"
                                style={{color: '#5a5a5a'}}>
                                <span aria-hidden="true">×</span>
                                <span className="sr-only">Close</span>
                            </button>
                        </div>
                        {(this.props.isLoadingCourses ||
                            this.props.isLoadingCampaigns) && <Loading/>}
                        {!this.props.isSavingRegister && !(this.props.isLoadingCourses ||
                            this.props.isLoadingCampaigns) &&
                        <form role="form" id="form-info-student">
                            {/*<FormInputText*/}
                            {/*    name="name"*/}
                            {/*    placeholder="Tên học viên"*/}
                            {/*    required*/}
                            {/*    value={register.name}*/}
                            {/*    updateFormData={this.updateFormData}*/}
                            {/*/>*/}
                            {/*<FormInputText*/}
                            {/*    name="email"*/}
                            {/*    placeholder="Email học viên"*/}
                            {/*    required*/}
                            {/*    value={register.email}*/}
                            {/*    updateFormData={this.updateFormData}*/}
                            {/*/>*/}
                            {/*<FormInputText*/}
                            {/*    name="phone"*/}
                            {/*    placeholder="Số điện thoại học viên"*/}
                            {/*    required*/}
                            {/*    value={register.phone}*/}
                            {/*    updateFormData={this.updateFormData}*/}
                            {/*/>*/}
                            <div>
                                <label>Mã khuyến mãi</label>
                                <FormInputText
                                    name="coupon"

                                    placeholder="Mã khuyến mãi"
                                    value={register.coupon}
                                    updateFormData={this.updateFormData}
                                />
                            </div>

                            <div>
                                <label>Nhân viên sale</label>
                                <ReactSelect
                                    optionComponent={MemberReactSelectOption}
                                    valueComponent={MemberReactSelectValue}
                                    options={addSelectSaler(salers)}
                                    onChange={this.updateSaler}
                                    value={register.saler_id}
                                    placeholder="Chọn saler"
                                    name="saler_id"
                                /></div>
                            <div>
                                <label>Nguồn</label>
                                <ReactSelect
                                    options={addSelectCampaign(sources)}
                                    onChange={this.updateSource}
                                    value={register.source_id}
                                    placeholder="Chọn nguồn"
                                    name="source_id"
                                /></div>

                            <div>
                                <label>Môn học</label>
                                <ReactSelect
                                    optionComponent={MemberReactSelectOption}
                                    value={register.course_id}
                                    options={addSelectCourse(this.props.courses)}
                                    onChange={this.updateCourse}
                                    placeholder="Chọn môn học"
                                    valueComponent={MemberReactSelectValue}
                                /></div>

                            <div>
                                <label>Lớp học</label>
                                <ReactSelect
                                    value={register.class_id}
                                    options={addSelectClass(this.props.classes)}
                                    onChange={this.updateClass}
                                    placeholder="Chọn lớp học"
                                /></div>

                            <div>
                                <label>Chiến dịch</label>
                                <ReactSelect
                                    value={register.campaign_id}
                                    options={addSelectCampaign(this.props.campaigns)}
                                    onChange={this.updateCampaign}
                                    placeholder="Chọn chiến dịch"
                                /></div>
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
                                            <label>Giới tính</label>
                                            <ReactSelect
                                                value={register.gender}
                                                options={GENDER}
                                                onChange={this.updateGender}
                                                placeholder="Chọn giới tính"
                                            /></div>
                                        <div>
                                            <label>Ngày sinh</label>
                                            <FormInputDate
                                                placeholder="Chọn ngày sinh"
                                                value={register.dob}
                                                updateFormData={this.updateFormData}
                                                id="form-change-dob"
                                                name="dob"
                                            /></div>
                                        <div>
                                            <label>Địa chỉ</label><ReactSelect
                                            value={register.address}
                                            options={this.getDataAddress()}
                                            onChange={this.updateAddress}
                                            placeholder="Địa chỉ"
                                        /></div>
                                        <div>
                                            <label>Trường học</label><FormInputText
                                            name="university"
                                            placeholder="Trường học"
                                            value={register.university}
                                            updateFormData={this.updateFormData}
                                        /></div>
                                        <div>
                                            <label>Nơi làm việc</label><FormInputText
                                            name="work"
                                            placeholder="Nơi làm việc"
                                            value={register.work}
                                            updateFormData={this.updateFormData}
                                        /></div>
                                        <div>
                                            <label>Lý do biết đến</label><FormInputText
                                            name="how_know"
                                            placeholder="Lý do biết đến"
                                            value={register.how_know}
                                            updateFormData={this.updateFormData}
                                        /></div>
                                        <div>
                                            <label>Facebook</label>
                                            <FormInputText
                                                name="facebook"
                                                placeholder="Link Facebook"
                                                value={register.facebook}
                                                updateFormData={this.updateFormData}
                                            /></div>
                                        <div>
                                            <label>Ghi chú</label>
                                            <div className="form-group">
                                                <div className="input-note-register">
                                                         <textarea type="text" className="form-control"
                                                                   rows={5}
                                                                   name="description"
                                                                   placeholder="Mô tả"
                                                                   value={
                                                                       register.description ? register.description : ""
                                                                   }
                                                                   onChange={this.updateFormData}/>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </form>

                        }
                        {this.props.isSavingRegister ? <Loading/> :
                            <div className="flex">
                                <button type="button"
                                        disabled={isSavingRegister}
                                        className="btn btn-white width-50-percent text-center"
                                        data-dismiss="modal"
                                        onClick={this.close}>
                                    Hủy
                                </button>
                                <button type="button"
                                        className="btn btn-success width-50-percent text-center"
                                        disabled={isSavingRegister || this.props.isLoadingCourses ||
                                            this.props.isLoadingCampaigns}
                                        style={{backgroundColor: '#2acc4c'}}
                                        onClick={(e) => this.createRegister(e)}>
                                    Hoàn tất
                                </button>
                            </div>}

                    </div>
                </Overlay>
            </div>


        );
    }
}


CreateRegisterOverlay.propTypes = {
    createRegisterActions: PropTypes.object.isRequired,
    register: PropTypes.object.isRequired,
    campaigns: PropTypes.array.isRequired,
    courses: PropTypes.array.isRequired,
    classes: PropTypes.array.isRequired,
    provinces: PropTypes.array.isRequired,
    isLoadingCourses: PropTypes.bool.isRequired,
    isSavingRegister: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired,
    isLoadingCampaigns: PropTypes.bool.isRequired,
};

function mapStateToProps(state) {
    const {isSavingRegister,sources, isLoading,isLoadingSources, register, courses, classes, isLoadingCourses, campaigns, isLoadingCampaigns, provinces} = state.createRegister;
    return {
        salers: state.registerStudents.salerFilter,
        user: state.login.user,
        isLoading,
        register,
        isLoadingSources,
        courses,
        sources,
        classes,
        isLoadingCourses,
        isLoadingCampaigns,
        campaigns,
        provinces,
        isSavingRegister,

    };
}

function mapDispatchToProps(dispatch) {
    return {
        createRegisterActions: bindActionCreators(createRegisterActions, dispatch),
        registerActions: bindActionCreators(registerActions, dispatch),
        studentActions: bindActionCreators(studentActions, dispatch)

    };
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateRegisterOverlay);
