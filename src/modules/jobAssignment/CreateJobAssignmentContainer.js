/* eslint-disable no-undef */
import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as jobAssignmentAction from '../jobAssignment/jobAssignmentAction';
import * as PropTypes from "prop-types";
import Loading from "../../components/common/Loading";
import FormInputText from "../../components/common/FormInputText";
import FormInputDateTime from "../../components/common/FormInputDateTime";
import ReactSelect from 'react-select';
import FormInputSelect from "../../components/common/FormInputSelect";
import Select from 'react-select';
import ListStaffs from './ListStaffs';
import ItemReactSelect from "../../components/common/ItemReactSelect";
import * as helper from '../../helpers/helper';

class CreateJobAssignmentContainer extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.updateFormData = this.updateFormData.bind(this);
        this.updateFormDataType = this.updateFormDataType.bind(this);
        this.updateFormDataBonusType = this.updateFormDataBonusType.bind(this);
        this.submit = this.submit.bind(this);
    }

    componentWillMount() {
        helper.setFormValidation('#form-job-assignment');
    }

    componentWillReceiveProps(nextProps) {
        console.log(nextProps);
    }

    componentDidUpdate(){
        helper.setFormValidation('#form-job-assignment');
    }

    updateFormData(e){
        if(!e) return;
        let feild = e.target.name;
        let value = e.target.value;
        let newdata = {...this.props.data,[feild] : value};
        this.props.jobAssignmentAction.updateFormData(newdata);
    }

    updateFormDataType(e){
        if(!e) return;
        let value = e.value;
        let newdata = {...this.props.data,type : value};
        this.props.jobAssignmentAction.updateFormData(newdata);
    }

    updateFormDataBonusType(e){
        if(!e) return;
        let value = e.value;
        let newdata = {...this.props.data,bonus_type : value};
        this.props.jobAssignmentAction.updateFormData(newdata);
        if(!e) return;
    }



    submit(){
        if ($('#form-job-assignment').valid()) {
            helper.showNotification("OK");
        }
    }

    render() {
        return (
            <div className="content">
                <div className="container-fluid">
                    {
                        this.props.isLoading ? <Loading/> :
                        <form role="form" id="form-job-assignment" onSubmit={(e) => e.preventDefault()}>
                            <div className="row">
                                <div className="col-md-8">
                                    <div className="card">
                                        <div className="card-header card-header-icon" data-background-color="rose">
                                            <i className="material-icons">assignment</i>
                                        </div>

                                        <div className="card-content">
                                            <h4 className="card-title">Tạo công việc</h4>
                                            <div className="row">
                                                <div className="col-md-12">
                                                <FormInputText
                                                    label="Tên công việc"
                                                    required
                                                    type="text"
                                                    name="name"
                                                    updateFormData={this.updateFormData}
                                                    value={this.props.data.name}
                                                /></div><div className="col-md-12">
                                                <label className="">
                                                    Loại
                                                </label>
                                                <ReactSelect
                                                    disabled={this.props.isLoading}
                                                    options={[
                                                        {value: 'personal', label: 'Cá nhân',},
                                                        {value: 'team', label: 'Nhóm',},
                                                        {value: 'person_project', label: 'Dự án riêng',},
                                                    ]}
                                                    onChange={this.updateFormDataType}
                                                    value={this.props.data.type}
                                                    defaultMessage="Tuỳ chọn"
                                                    name="type"
                                                /></div><div className="col-md-12">
                                                <FormInputText
                                                    label="Chi phí"
                                                    required
                                                    type="number"
                                                    name="cost"
                                                    updateFormData={this.updateFormData}
                                                    value={this.props.data.cost}
                                                /></div><div className="col-md-12">
                                                <FormInputDateTime
                                                    label="Deadline"
                                                    name="deadline"
                                                    updateFormData={this.updateFormData}
                                                    value={this.props.data.deadline}
                                                    id="deadline"
                                                    maxDate=""

                                                /></div>
                                                <div className="col-md-8">
                                                    <FormInputText
                                                        label="Điểm cộng"
                                                        required
                                                        type="number"
                                                        name="bonus_value"
                                                        updateFormData={this.updateFormData}
                                                        value={this.props.data.bonus_value}
                                                    /></div>
                                                <div className="col-md-4">
                                                    <ReactSelect
                                                    disabled={this.props.isLoading}
                                                    options={[
                                                        {value: 'vnd', label: 'VNĐ',},
                                                        {value: 'coin', label: 'Coin',},
                                                    ]}
                                                    onChange={this.updateFormDataBonusType}
                                                    value={this.props.data.bonus_type}
                                                    defaultMessage="Đơn vị"
                                                    style={{marginTop : "20px", width: "100%"}}
                                                /></div>
                                                <div className="col-md-8"/>
                                                <div className="col-md-4">
                                                    <button onClick={this.submit} className="btn btn-rose">Lưu</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="card">
                                        <div className="card-header card-header-icon" data-background-color="rose">
                                            <i className="material-icons">contacts</i>
                                        </div>

                                        <div className="card-content">
                                            <h4 className="card-title">Người thực hiện</h4>
                                            <div className="row">
                                                <div className="col-sm-12">
                                                    <div className="form-group">
                                                        <label className="label-control">Trợ giảng</label>
                                                        <Select
                                                            name="form-field-name"
                                                            value={"Chọn nhân viên"}
                                                            options={this.props.staffs}
                                                            onChange={(e)=>{return this.props.jobAssignmentAction.chooseStaff(e);}}
                                                            optionRenderer={(option) => {
                                                                return (
                                                                    <ItemReactSelect label={option.label} url={option.avatar_url}/>
                                                                );
                                                            }}
                                                            valueRenderer={(option) => {
                                                                return (
                                                                    <ItemReactSelect label={option.label} url={option.avatar_url}/>
                                                                );
                                                            }}
                                                            placeholder="Chọn nhân viên"
                                                        />
                                                    </div>
                                                </div>
                                                <ListStaffs staffs={this.props.data.staffs} remove={(e)=>{
                                                    this.props.jobAssignmentAction.removeStaff(e);
                                                }}/>


                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    }
                </div>
            </div>
        );
    }
}

CreateJobAssignmentContainer.propTypes = {
    isLoading: PropTypes.bool.isRequired,
    data: PropTypes.object,
    staffs: PropTypes.array,
};

function mapStateToProps(state) {
    return {
        isLoading : state.jobAssignment.isLoading,
        data : state.jobAssignment.data,
        staffs : state.jobAssignment.staffs,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        jobAssignmentAction: bindActionCreators(jobAssignmentAction, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateJobAssignmentContainer);