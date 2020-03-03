import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import PropTypes from 'prop-types';
import FormInputText from "../../components/common/FormInputText";
import Star from "../../components/common/Star";
import {setFormValidation} from "../../helpers/helper";
import * as leadActions from './leadActions';
import * as createRegisterActions from "../registerStudents/createRegisterActions";
import ReactSelect from "react-select";

class EditLead extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            lead: {}
        };
        this.updateFormData = this.updateFormData.bind(this);
        this.editInfoLead = this.editInfoLead.bind(this);

    }

    componentWillMount() {
        let lead = {...this.props.lead};
        if (this.props.provinces) {
            let city = this.props.provinces.filter(p => p.name == lead.city)[0];
            lead.city = city ? city.id : '';
        }
        this.setState({lead});
    }

    updateFormData(event) {
        const value = event.target.value;
        let lead = {...this.state.lead};
        const field = event.target.name;
        lead[field] = value;
        this.setState({lead: lead});
    }

    updateCity = (e) => {
        let lead = {...this.state.lead};
        lead["city"] = e ? e.value : null;
        this.setState({lead});
    };

    editInfoLead() {
        setFormValidation("#form-edit-lead");
        if ($("#form-edit-lead").valid()) {
            let lead = {...this.state.lead};
            if (this.props.provinces) {
                let city = this.props.provinces.filter(p => p.id == lead.city)[0];
                lead.city = city ? city.name : '';
            }
            this.props.leadActions.editInfoLead(lead, this.props.closeModal);
        }
    }

    render() {
        let provinces = this.props.provinces ? this.props.provinces.map((province) => {
            return {value: province.id, label: province.name};
        }) : [];
        provinces = [{value: '0', label: "Không có"}, ...provinces];
        return (
            <div>
                <form id="form-edit-lead" className="form-grey">
                    {/*<FormInputText*/}
                    {/*    label="Họ tên"*/}
                    {/*    required*/}
                    {/*    name="name"*/}
                    {/*    updateFormData={*/}
                    {/*        this.updateFormData*/}
                    {/*    }*/}
                    {/*    value={this.state.lead.name}*/}
                    {/*/>*/}
                    {/*<FormInputText*/}
                    {/*    label="Email"*/}
                    {/*    required*/}
                    {/*    type="email"*/}
                    {/*    name="email"*/}
                    {/*    updateFormData={*/}
                    {/*        this.updateFormData*/}
                    {/*    }*/}
                    {/*    value={this.state.lead.email}*/}
                    {/*/>*/}
                    {/*<FormInputText*/}
                    {/*    label="Số điện thoại"*/}
                    {/*    required*/}
                    {/*    name="phone"*/}
                    {/*    updateFormData={*/}
                    {/*        this.updateFormData*/}
                    {/*    }*/}
                    {/*    value={this.state.lead.phone}*/}
                    {/*/>*/}
                    <label>Thành phố</label>

                    <ReactSelect
                        options={provinces}
                        onChange={this.updateCity}
                        value={this.state.lead.city}
                        label="Chọn thành phố"
                        placeholder="Chọn thành phố"
                        name="city"
                    />
                    <label>Ghi chú</label>
                    <FormInputText
                        placeholder="Ghi chú"
                        name="note"
                        updateFormData={
                            this.updateFormData
                        }
                        value={this.state.lead.note}
                    />
                    <label>Quan tâm</label>
                    <FormInputText
                        placeholder="Quan tâm"
                        name="interest"
                        updateFormData={
                            this.updateFormData
                        }
                        value={this.state.lead.interest}
                    />
                    {/*<div className="form-group">*/}
                    {/*    <label className="label-control">Chọn màu</label>*/}
                    {/*    <CirclePicker*/}
                    {/*        width="100%"*/}
                    {/*        color={this.state.lead.status ? this.state.lead.status : ''}*/}
                    {/*        colors={LEAD_COLORS}*/}
                    {/*        onChangeComplete={(color) => this.setState({lead: {...this.state.lead, status: color.hex}})}*/}
                    {/*    />*/}
                    {/*</div>*/}
                    <div className="form-group">
                        <label className="label-control">Chọn đánh giá</label>
                        <div className="flex flex-row-center">
                            <Star
                                value={this.state.lead.rate}
                                maxStar={5}
                                onChange={(value) => {
                                    let lead = {...this.state.lead};
                                    lead.rate = value;
                                    this.setState({lead: lead});
                                }}
                            />
                        </div>
                    </div>
                    <div className="flex-end">
                    {this.props.isEditing ? (
                        <button
                            className="btn button-green disabled"
                            type="button"
                            disabled={true}
                        >
                            <i className="fa fa-spinner fa-spin"/>{" "}
                            Đang lưu
                        </button>
                    ) : (
                        <button
                            className="btn button-green"
                            type="button"
                            onClick={this.editInfoLead}
                        >
                            Lưu
                        </button>
                    )}
                    </div>
                </form>
            </div>
        );
    }
}

EditLead.propTypes = {
    isEditing: PropTypes.bool.isRequired,
    lead: PropTypes.object.isRequired,
    leadActions: PropTypes.object.isRequired,
    closeModal: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
    return {
        isEditing: state.lead.isEditing,
        provinces: state.createRegister.provinces,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        createRegisterActions: bindActionCreators(createRegisterActions, dispatch),
        leadActions: bindActionCreators(leadActions, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditLead);