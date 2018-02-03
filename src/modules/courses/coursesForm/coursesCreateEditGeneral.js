import React                            from 'react';
import PropTypes                        from 'prop-types';
import {bindActionCreators}             from 'redux';
import {connect}                        from 'react-redux';
import  * as coursesActions             from '../coursesActions';
import FormInputText                    from '../../../components/common/FormInputText';
import * as helper                      from '../../../helpers/helper';
import MemberReactSelectOption from "../../tasks/board/filter/MemberReactSelectOption";
import MemberReactSelectValue from "../../tasks/board/filter/MemberReactSelectValue";
import ReactSelect from 'react-select';

class coursesCreateEditGeneral extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {};

        this.updateFormData     = this.updateFormData.bind(this);
        this.commitCourseData   = this.commitCourseData.bind(this);
        this.checkValidate      = this.checkValidate.bind(this);
        this.onCategoryChange      = this.onCategoryChange.bind(this);
    }

    componentWillMount() {
        helper.setFormValidation('#form-course-create-edit');

        //console.log('child general will mount',this.props);
    }

    commitCourseData(){
        if(this.checkValidate())
            this.props.coursesActions.commitCourseData(this.props.data);

    }


    updateFormData(e){
        let   feild, value;
        if(e.target){
            feild   = e.target.name;
            value   = e.target.value;
        }else{
            feild = "type_id";
            value = e.id;
        }
        let data = {...this.props.data};
        data[feild] = value;
        this.props.coursesActions.updateData(data);
    }

    checkValidate() {
        if ($('#form-course-create-edit').valid()) {

            if (helper.isEmptyInput(this.props.data.icon_url)) {
                helper.showTypeNotification('Vui lòng chọn ảnh icon', 'warning');
                return false;
            }
            if (helper.isEmptyInput(this.props.data.image_url)) {
                helper.showTypeNotification('Vui lòng chọn ảnh đại điện', 'warning');
                return false;
            }
            if (helper.isEmptyInput(this.props.data.cover_url)) {
                helper.showTypeNotification('Vui lòng chọn cover', 'warning');
                return false;
            }
            return true;
        }
        return false;
    }

    onCategoryChange(obj){
        this.props.coursesActions.onCategoryChange(obj);
    }

    render(){
        return (
            <div className="card-content">
                {
                    <div>
                        <div className="row">

                            <div className="col-md-12">
                                <FormInputText
                                    label="Tên môn học"
                                    required
                                    name="name"
                                    updateFormData={this.updateFormData}
                                    value={this.props.data.name}
                                /></div>

                            {/*<div className="col-md-6">*/}
                            {/*<FormInputText*/}
                            {/*label="Thời lượng"*/}
                            {/*required*/}
                            {/*type="number"*/}
                            {/*name="duration"*/}
                            {/*updateFormData={this.updateFormData}*/}
                            {/*value={this.props.data.duration}*/}
                            {/*/></div>*/}
                            <div className="col-md-12">
                                <FormInputText
                                    label="Giá"
                                    required
                                    name="price"
                                    updateFormData={this.updateFormData}
                                    value={this.props.data.price}
                                />
                            </div>

                            <div className="col-md-12">
                                <FormInputText
                                    label="Mô tả ngắn"
                                    required
                                    name="description"
                                    updateFormData={this.updateFormData}
                                    value={this.props.data.description}
                                /></div>
                            <div className="col-md-6">
                                <FormInputText
                                    label="Link tải phần mềm trên Windows"
                                    name="linkwindow"
                                    updateFormData={this.updateFormData}
                                    value={this.props.data.linkwindow}
                                /></div>
                            <div className="col-md-6">
                                <FormInputText
                                    label="Link hướng dẫn trên Windows"
                                    name="window_how_install"
                                    updateFormData={this.updateFormData}
                                    value={this.props.data.window_how_install}
                                />
                            </div>
                            <div className="col-md-6">
                                <FormInputText
                                    label="Link tải phần mềm trên Mac"
                                    name="linkmac"
                                    updateFormData={this.updateFormData}
                                    value={this.props.data.linkmac}
                                /></div>
                            <div className="col-md-6">
                                <FormInputText
                                    label="Link hướng dẫn trên Mac"
                                    name="mac_how_install"
                                    updateFormData={this.updateFormData}
                                    value={this.props.data.mac_how_install}
                                />
                            </div>
                            <div className="col-md-6">
                                    <label>
                                        Nhãn
                                    </label>
                                    <ReactSelect
                                        placeholder="Nhập nhãn"
                                        style={{width: "100%"}}
                                        value={this.props.data.categories}
                                        name="categories"
                                        multi={true}
                                        valueComponent={MemberReactSelectValue}
                                        optionComponent={MemberReactSelectOption}
                                        options={this.props.categories}
                                        onChange={this.onCategoryChange}
                                    />
                                </div>
                            <div className="col-md-6">
                                <label>
                                    Hình thức
                                </label>
                                <ReactSelect
                                    name="type_id"
                                    className=""
                                    options={this.props.types}
                                    onChange={this.updateFormData}
                                    value={this.props.data.type_id || ""}
                                    defaultMessage="Tuỳ chọn"
                                />
                            </div>

                        </div>

                        {this.props.isCommitting ?
                            <button className="btn btn-rose btn-fill disabled" type="button">
                                <i className="fa fa-spinner fa-spin"/> Đang tải lên
                            </button>
                            :
                            <button
                                className="btn btn-fill btn-rose"
                                type="button"
                                onClick={this.commitCourseData}
                            > Lưu </button>
                        }
                    </div>
                }
            </div>

        );
    }

}


coursesCreateEditGeneral.propTypes = {
    isLoading           : PropTypes.bool.isRequired,
    data                : PropTypes.object,
    isUpdatingAvatar    : PropTypes.bool,
    updateAvatarError   : PropTypes.bool,
    isUpdatingLogo      : PropTypes.bool,
    updateLogoError     : PropTypes.bool,
    isUpdatingCover     : PropTypes.bool,
    updateCoverError    : PropTypes.bool,
    isCommitting        : PropTypes.bool,
    commitSuccess       : PropTypes.bool,
    updateData          : PropTypes.func,
    coursesActions      : PropTypes.object.isRequired,
    types               : PropTypes.array,
    categories          : PropTypes.array,
};

function mapStateToProps(state) {
    return {
        isLoading           : state.courses.isLoading,
        data                : state.courses.data,
        isUpdatingAvatar    : state.courses.isUpdatingAvatar,
        updateAvatarError   : state.courses.updateAvatarError,
        isUpdatingLogo      : state.courses.isUpdatingLogo,
        updateLogoError     : state.courses.updateLogoError,
        isUpdatingCover     : state.courses.isUpdatingCover,
        updateCoverError    : state.courses.updateCoverError,
        isCommitting        : state.courses.isCommitting,
        commitSuccess       : state.courses.commitSuccess,
        types               : state.courses.types,
        categories          : state.courses.categories,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        coursesActions: bindActionCreators(coursesActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(coursesCreateEditGeneral);

