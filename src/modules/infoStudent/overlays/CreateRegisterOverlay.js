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


function getSelectSaler(items) {
    return items && items.map(item => {
        return {
            value: item.id,
            label: item.name,
            icon_url: item.avatar_url,
        };
    });
}

function getSelectCourse(items) {
    return items && items.map(item => {
        return {
            value: item.id,
            label: item.name,
            icon_url: item.icon_url,
        };
    });
}

function getSelectCampaign(items) {
    return items && items.map(item => {
        return {
            value: item.id,
            label: item.name,
        };
    });
}

function getSelectBase(items, studyClasses) {
    return items && items.map(item => {
        const count = studyClasses.filter(sc => sc.base.id == item.id).length;
        return {
            value: item.id,
            label: `${item.province} - ${item.name} - (${count} lớp) - ${item.address}`,
        };
    });
}

function getSelectClass(items) {
    return items && items.map(item => {
        let label = item.name;
        if (item.date_start) {
            label += " - " + item.date_start;
        }
        if (item.study_time) {
            label += " - " + item.study_time;
        }
        return {value: item.id, label};
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
        if (!this.props.isLoadingSources)
            this.props.createRegisterActions.loadSources();
        this.props.registerActions.loadSalerFilter();
        this.loadStatuses(false);
    }

    loadStatuses = (singleLoad) => {
        let {studentActions, isLoadedStatuses} = this.props;
        if (!isLoadedStatuses || singleLoad)
            studentActions.loadStatuses('registers');
    };
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
    updateStatus = (e) => {
        let register = {...this.state.register};
        register["status_id"] = e ? e.value : null;
        this.setState({register});
    };
    updateBase = (e) => {
        let register = {...this.state.register};
        register["base_id"] = e ? e.value : null;
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
        let {register} = this.state;
        if (register.name === null || register.name === undefined || register.name === "") {
            helper.showTypeNotification("Vui lòng nhập tên", 'warning');
            return;
        }
        if (register.phone === null || register.phone === undefined || register.phone === "") {
            helper.showTypeNotification("Vui lòng nhập số điện thoại", 'warning');
            return;
        }
        if (register.email === null || register.email === undefined || register.email === "") {
            helper.showTypeNotification("Vui lòng nhập email", 'warning');
            return;
        }
        if (!register.base_id && !register.class_id) {
            helper.showTypeNotification("Vui lòng chọn lớp hoặc cơ sở", 'warning');
            return;
        }
        this.props.createRegisterActions.createRegister(register, () => {
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
        let {register} = this.state;
        let {isSavingRegister, salers, sources, bases, className, studentId} = this.props;
        let classes = (this.props.classes || []).filter(c => register.base_id ? c.base.id == register.base_id : true);

        let statuses = this.props.statuses.registers;

        return (

            <div style={{position: "relative"}}>
                <div  className={className}  mask="create"
                        ref="target" onClick={this.toggle}
                        disabled={isSavingRegister}>
                    Tạo đăng kí mới {!studentId && <i className="material-icons">
                    add
                </i>}
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
                            <div><b>Tạo đăng kí mới</b></div>
                            <button
                                onClick={this.close}
                                type="button" className="close"
                                style={{color: '#5a5a5a'}}>
                                <span aria-hidden="true">×</span>
                                <span className="sr-only">Close</span>
                            </button>
                        </div>
                        {(this.props.isLoadingCourses || this.props.isLoadingCampaigns) && <Loading/>}
                        {!this.props.isSavingRegister && !(this.props.isLoadingCourses || this.props.isLoadingCampaigns) &&
                        <form role="form" id="form-info-student">
                            {!studentId && <div>
                                <div>
                                    <label>Tên học viên</label>
                                    <FormInputText
                                        name="name"
                                        placeholder="Tên học viên"
                                        required
                                        value={register.name}
                                        updateFormData={this.updateFormData}
                                    /></div>
                                <div>
                                    <label>Tên phụ huynh</label>
                                    <FormInputText
                                        name="father_name"
                                        placeholder="Tên phụ huynh"
                                        required
                                        value={register.father_name}
                                        updateFormData={this.updateFormData}
                                    /></div>
                                <div>
                                    <label>Email</label>
                                    <FormInputText
                                        name="email"
                                        placeholder="Email học viên"
                                        required
                                        value={register.email}
                                        updateFormData={this.updateFormData}
                                    /></div>
                                <div>
                                    <label>Số điện thoại</label>
                                    <FormInputText
                                        name="phone"
                                        placeholder="Số điện thoại học viên"
                                        required
                                        value={register.phone}
                                        updateFormData={this.updateFormData}
                                    /></div>
                            </div>}
                            <div>
                                <label>Môn học</label>
                                <ReactSelect
                                    optionComponent={MemberReactSelectOption}
                                    value={register.course_id}
                                    options={getSelectCourse(this.props.courses)}
                                    onChange={this.updateCourse}
                                    placeholder="Chọn môn học"
                                    valueComponent={MemberReactSelectValue}
                                /></div>
                            <div>
                                <label>Cơ sở</label>
                                <ReactSelect
                                    value={register.base_id}
                                    options={getSelectBase(bases, (this.props.classes || []))}
                                    onChange={this.updateBase}
                                    placeholder="Chọn cơ sở"
                                /></div>
                            <div>
                                <label>Lớp học</label>
                                <ReactSelect
                                    value={register.class_id}
                                    options={getSelectClass(classes)}
                                    onChange={this.updateClass}
                                    placeholder="Lớp chờ"
                                /></div>
                            <div>
                                <label>Trạng thái</label>
                                <ReactSelect
                                    options={getSelectCampaign(statuses)}
                                    onChange={this.updateStatus}
                                    value={register.status_id}
                                    placeholder="Chọn trạng thái"
                                    name="status_id"
                                /></div>
                            <div>
                                <label>Nguồn</label>
                                <ReactSelect
                                    options={getSelectCampaign(sources)}
                                    onChange={this.updateSource}
                                    value={register.source_id}
                                    placeholder="Chọn nguồn"
                                    name="source_id"
                                /></div>
                            <div>
                                <label>Chiến dịch</label>
                                <ReactSelect
                                    value={register.campaign_id}
                                    options={getSelectCampaign(this.props.campaigns)}
                                    onChange={this.updateCampaign}
                                    placeholder="Chọn chiến dịch"
                                /></div>


                            <div>
                                <label>Nhân viên sale</label>
                                <ReactSelect
                                    optionComponent={MemberReactSelectOption}
                                    valueComponent={MemberReactSelectValue}
                                    options={getSelectSaler(salers)}
                                    onChange={this.updateSaler}
                                    value={register.saler_id}
                                    placeholder="Chọn saler"
                                    name="saler_id"
                                /></div>

                            <div>
                                <label>Mã khuyến mãi</label>
                                <FormInputText
                                    name="coupon"

                                    placeholder="Mã khuyến mãi"
                                    value={register.coupon}
                                    updateFormData={this.updateFormData}
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
                                                <div className="input-note-overlay">
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
    const {bases, isSavingRegister, sources, isLoading, isLoadingSources, register, courses, classes, isLoadingCourses, campaigns, isLoadingCampaigns, provinces} = state.createRegister;
    return {
        salers: state.registerStudents.salerFilter,
        bases,
        statuses: state.infoStudent.statuses,
        isLoadingStatuses: state.infoStudent.isLoadingStatuses,
        isLoadedStatuses: state.infoStudent.isLoadedStatuses,
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
