import React from "react";
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Loading from "../../components/common/Loading";
import FormInputText from "../../components/common/FormInputText";
import * as CompanyActions from '../companies/CompanyActions';
import ReactSelect from 'react-select';
import * as helper from '../../helpers/helper';

class CreateCompanyContainer extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.changeFields = this.changeFields.bind(this);
        this.updateFormData = this.updateFormData.bind(this);
        this.updateFormDataBonus = this.updateFormDataBonus.bind(this);
        this.updateFormDataType = this.updateFormDataType.bind(this);
        this.submit = this.submit.bind(this);

    }

    componentWillMount() {
        console.log(this.props.data);
        this.props.CompanyActions.loadFields();
    }
    componentWillReceiveProps() {

    }
    componentDidUpdate(){
        helper.setFormValidation('#form-company');
    }


    changeFields() {
        let data = [];
        data = this.props.fields.map((field) => {
            return {
                value: field.id,
                label: field.name,
            };
        });
        return data;
    }
    updateFormData(e){

        if(!e) return;
        let field = e.target.name;
        let value = e.target.value;
        let newdata = {...this.props.data,[field] : value};
        this.props.CompanyActions.updateFormData(newdata);
    }
    updateFormDataType(e){
        if(!e) return;
        let value = e.value;
        let newdata = {...this.props.data,type : value};
        this.props.CompanyActions.updateFormData(newdata);
    }
    updateFormDataBonus(e){
        if(!e) return;
        let value = e.value;
        let newdata = {...this.props.data,field_id : value};
        this.props.CompanyActions.updateFormData(newdata);

    }
    submit(){
        if($('#form-company').valid()) {
            helper.showNotification("Đang lưu...");
            if(!this.props.companyId) this.props.CompanyActions.addCompany(this.props.data);
            else this.props.CompanyActions.editCompany(this.props.companyId,this.props.data);
        } else helper.showErrorNotification("Vui lòng nhập đủ các thông tin");
    }

    render() {
        return (
            <div className="content">
                <div className="container-fluid">{
                    (this.props.isLoadingFields || this.props.isLoading) ? <Loading/> :
                        <form role="form" id="form-company" onSubmit={(e) => e.preventDefault()}>
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="card">
                                        <div className="card-header card-header-icon" data-background-color="rose">
                                            <i className="material-icons">home</i>
                                        </div>

                                        <div className="card-content">
                                            <h4 className="card-title">Thêm công ty</h4>
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <FormInputText
                                                        label="Tên công ty"
                                                        required
                                                        type="text"
                                                        name="name"
                                                        updateFormData={this.updateFormData}
                                                        value={this.props.data.name || ""}

                                                    />
                                                </div>
                                                <div className="col-md-12">
                                                    <FormInputText
                                                        label="Địa chỉ đăng kí kinh doanh"
                                                        required
                                                        type="text"
                                                        name="registered_business_address"
                                                        updateFormData={this.updateFormData}
                                                        value={this.props.data.registered_business_address||""}

                                                    />
                                                </div>
                                                <div className="col-md-12">
                                                    <FormInputText
                                                        label="Địa chỉ đăng kí kinh doanh"
                                                        required
                                                        type="text"
                                                        name="office_address"
                                                        updateFormData={this.updateFormData}
                                                        value={this.props.data.office_address||""}

                                                    />
                                                </div>
                                                <div className="col-md-12">
                                                    <FormInputText
                                                        label="Số điện thoại"
                                                        required
                                                        type="text"
                                                        name="phone_company"
                                                        updateFormData={this.updateFormData}
                                                        value={this.props.data.phone_company||""}

                                                    />
                                                </div>
                                                <div className="col-md-12">
                                                    <FormInputText
                                                        label="Mã số thuế"
                                                        required
                                                        type="text"
                                                        name="tax_code"
                                                        updateFormData={this.updateFormData}
                                                        value={this.props.data.tax_code||""}

                                                    />
                                                </div>
                                                <div className="col-md-12">
                                                    <label>
                                                        Thông tin tài khoản
                                                    </label></div>
                                                <div className="col-md-6">
                                                    <FormInputText
                                                        label="Số tài khoản"
                                                        required
                                                        type="text"
                                                        name="account_number"
                                                        updateFormData={this.updateFormData}
                                                        value={this.props.data.account_number||""}

                                                    />
                                                </div>
                                                <div className="col-md-6">
                                                    <FormInputText
                                                        label="Tên tài khoản"
                                                        required
                                                        type="text"
                                                        name="account_name"
                                                        updateFormData={this.updateFormData}
                                                        value={this.props.data.account_name||""}

                                                    />
                                                </div>
                                                <div className="col-md-6">
                                                    <FormInputText
                                                        label="Ngân hàng"
                                                        required
                                                        type="text"
                                                        name="bank_name"
                                                        updateFormData={this.updateFormData}
                                                        value={this.props.data.bank_name||""}

                                                    />
                                                </div>
                                                <div className="col-md-6">
                                                    <FormInputText
                                                        label="Chi nhánh"
                                                        required
                                                        type="text"
                                                        name="bank_branch"
                                                        updateFormData={this.updateFormData}
                                                        value={this.props.data.bank_branch||""}

                                                    />
                                                </div>


                                                <div className="col-md-6">
                                                    <label>
                                                        Loại
                                                    </label>
                                                    <ReactSelect
                                                        required
                                                        disabled={false}
                                                        options={[
                                                            {value: 'provided', label: 'Cung cấp',},
                                                            {value: 'share', label: 'Phân phối',},
                                                            {value: 'different', label: 'Khác',},
                                                        ]}
                                                        onChange={this.updateFormDataType}
                                                        value={this.props.data.type||""}

                                                        defaultMessage="Tuỳ chọn"
                                                        name="type"
                                                    />
                                                </div>
                                                <div className="col-md-6">
                                                    <label>
                                                        Lĩnh vực
                                                    </label>
                                                </div>
                                                <div className="col-md-4">

                                                    <ReactSelect
                                                        required
                                                        disabled={false}
                                                        options={this.changeFields()}
                                                        onChange={this.updateFormDataBonus}
                                                        value={this.props.data.field_id||""}
                                                        defaultMessage="Tuỳ chọn"
                                                        name="field_id"
                                                    />
                                                </div>
                                                <div className="col-md-2">
                                                    <button
                                                        className="btn btn-danger btn-round btn-fab btn-fab-mini"
                                                        type="button"
                                                        data-toggle="tooltip" title="Thêm lĩnh vực"
                                                    >
                                                        <i className="material-icons keetool-card">add</i>
                                                    </button>
                                                </div>


                                                <div className="col-md-12">
                                                    <FormInputText
                                                        label="Người liên lạc"
                                                        required
                                                        type="text"
                                                        name="user_contact"
                                                        updateFormData={this.updateFormData}
                                                        value={this.props.data.user_contact||""}
                                                    />
                                                </div>
                                                <div className="col-md-12">
                                                    <FormInputText
                                                        label="Số điện thoại người liên lạc"
                                                        required
                                                        //disabled={true}
                                                        type="text"
                                                        name="user_contact_phone"
                                                        updateFormData={this.updateFormData}
                                                        value={this.props.data.user_contact_phone||""}

                                                    />
                                                </div>

                                                <div className="col-md-12"
                                                     style={{display: "flex", flexFlow: "row-reverse"}}>
                                                    {this.props.isSavingCompany ?
                                                        <button disabled className="btn btn-rose  disabled"
                                                                type="button">
                                                            <i className="fa fa-spinner fa-spin"/> Đang tải lên
                                                        </button>
                                                        :
                                                        <button onClick={this.submit}
                                                            className="btn btn-rose"
                                                        >Lưu</button>
                                                    }

                                                </div>

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

function mapStateToProps(state) {
    return {
        isLoadingFields: state.companies.isLoadingFields,
        isSavingField: state.companies.isSavingField,
        isSavingCompany: state.companies.isSavingCompany,
        isLoanding: state.companies.isLoading,
        data: state.companies.company,
        fields: state.companies.fields,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        CompanyActions: bindActionCreators(CompanyActions, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateCompanyContainer);