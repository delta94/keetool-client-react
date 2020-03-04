import React from "react";
import {observer} from "mobx-react";
import validation from "../../../helpers/validateData";
import {isEmptyInput} from "../../../helpers/helper";
import moment from "moment";
import {allowedDateFormats, DATETIME_FORMAT_SQL} from "../../../constants/constants";

const types = [
    {
        key: "leads",
        name: "Leads",
        description: "Danh sách các học viên tiềm năng, các học viên cũ, các học viên đang học",
        icon: "https://d1j8r0kxyu9tj8.cloudfront.net/files/1574699900idmduO8uhmBJyHV.png",
        selected: false,
        properties: [
            {
                key: "user.name",
                // required: true,
                name: 'Họ tên học sinh',
                text_error: 'Họ và tên của leads là bắt buộc',
                // checkFormat: (data) => {
                //     return validation.isNotEmpty(data);
                // }
            },
            {
                key: "user.father_name",
                name: 'Tên phụ huynh 1',
            },
            {
                key: "user.mother_name",
                name: 'Tên phụ huynh 2',
            },
            {
                key: "user.email",
                // required: true,
                name: "Email",
                text_error: 'Email của leads là bắt buộc',
                checkFormat: (data) => {
                    // return validation.isNotEmpty(data) && validation.isEmailAddress(data);
                    return !validation.isNotEmpty(data) || validation.isEmailAddress(data);
                }
            },
            {
                key: "user.phone",
                name: "Số điện thoại",
                checkFormat: (data) => {
                    return isEmptyInput(data) || validation.isPhoneNumber(data);
                },
                reformat: (data) => {
                    if (isEmptyInput(data)) return '';
                    data = data.match(/\d+/g)[0];
                    if (data[0] == '8' && data[1] == '4') {
                        data = data.replace("84", "0");
                    }
                    if (data[0] != '0') {
                        data = '0' + data;
                    }
                    return data;
                }
            },
            {
                key: "user.yob",
                name: "Năm sinh",
            },
            {
                key: "user.dob",
                name: "Ngày sinh",
                format: 'date',
                checkFormat: (data) => {
                    return isEmptyInput(data) || validation.isDate(data);
                },
                reformat: (data) => {
                    if (isEmptyInput(data)) return null;
                    if (validation.isDate(data)) {
                        return (moment(data, allowedDateFormats).format(DATETIME_FORMAT_SQL));
                    }
                    return null;

                }
            },
            {
                key: "user.imported_at",
                name: "Ngày nhập",
                format: 'date',
                checkFormat: (data) => {
                    return isEmptyInput(data) || validation.isDate(data);
                },
                reformat: (data) => {
                    if (isEmptyInput(data)) return null;
                    if (validation.isDate(data)) {
                        return (moment(data, allowedDateFormats).format(DATETIME_FORMAT_SQL));
                    }
                    return null;

                }
            },
            {
                key: "user.address",
                name: "Địa chỉ"
            },
            {
                key: "user.code",
                name: "Mã học viên"
            },
            {
                key: "user.note",
                name: "Ghi chú"
            },
            {
                key: "user.interest",
                name: "Quan tâm"
            },
            {
                key: "user.district",
                name: "Quận/Huyện"
            },
            {
                key: "user.city",
                name: "Tỉnh/Thành Phố",
                reformat: (data) => {
                    if (data.toLowerCase().includes("hcm") || data.toLowerCase().includes("SG") || data.toLowerCase().includes("Sài Gòn")) {
                        return "Hồ Chí Minh";
                    }
                    if (data.toLowerCase().includes("hn")) {
                        return "Hà Nội";
                    }

                    return data;

                }
            },
            {
                key: "user.university",
                name: "Trường học"
            },
            {
                key: "user.rate",
                name: "Phận loại(Sao)"
            },
            {
                key: "marketing_campaign.name",
                name: "Chiến dịch",
                check_new: true,
                check_description: (total, not_available_total) => {
                    return `Chúng tôi nhận thấy có ${total} chiến dịch, trong đó có ${not_available_total} chiến dịch chưa xác định, vui lòng cho chúng tôi biết đó là chiến nào`;
                },
                check_key_data: "marketing_campaigns"
            },
            {
                key: "source.name",
                name: "Nguồn học viên",
                check_new: true,
                check_description: (total, not_available_total) => {
                    return `Chúng tôi nhận thấy có ${total} nguồn học viên, trong đó có ${not_available_total} nguồn chưa xác định, vui lòng cho chúng tôi biết đó là nguồn nào`;
                },
                check_key_data: "sources",
            },
            {
                key: "status_user.name",
                name: "Trạng thái",
                check_new: true,
                check_description: (total, not_available_total) => {
                    return `Chúng tôi nhận thấy có ${total} trạng thái học viên, trong đó có ${not_available_total} trạng thái chưa xác định, vui lòng cho chúng tôi biết đó là trạng thái nào`;
                },
                check_key_data: "statuses_user",
            },
        ]
    },
    {
        key: "deals",
        name: "Deals",
        description: "Danh sách các lượt đăng kí học, thông tin về học phí, lịch sử chăm sóc đăng kí",
        icon: "https://d1j8r0kxyu9tj8.cloudfront.net/files/1574699900KQ2v8YCptdCyuCV.png",
        selected: false,
        properties: [
            {
                key: "class.name",
                name: "Tên lớp",
                text_error: 'Tên lớp là bắt buộc',
                required: true,
            },
            {
                key: "register.note",
                name: "Ghi chú"
            },
            {
                key: "register.money",
                name: "Số tiền",
                checkFormat: (data) => {
                    return validation.isNumber(data);
                },
                reformat: (data) => {
                    if (data) {
                        data = data.match(/\d/g);
                    }
                    if (data) {
                        data = data.join("");
                    }

                    if (isEmptyInput(data)) {
                        data = "";
                    }

                    return data;

                }
            },
            {
                key: "status_register.name",
                name: "Trạng thái",
                check_new: true,
                check_description: (total, not_available_total) => {
                    return `Chúng tôi nhận thấy có ${total} trạng thái đăng kí, trong đó có ${not_available_total} trạng thái chưa xác định, vui lòng cho chúng tôi biết đó là trạng thái nào`;
                },
                check_key_data: "statuses_register",
            },
            {
                key: "course.name",
                name: "Tên môn học",
                text_error: 'Tên môn học là bắt buộc',
                required: true,
            }
        ]
    },
    {
        key: "classes",
        name: "Lớp học",
        description: "Danh sách các lớp học, môn học, thời gian diễn ra và thông tin giảng viên, trợ giảng",
        icon: "https://d1j8r0kxyu9tj8.cloudfront.net/files/1574699900d7B1pYZVBH0YtOJ.png",
        selected: false,
        properties: [
            {
                key: "class.name",
                name: "Tên lớp",
                text_error: 'Tên lớp là bắt buộc',
                required: true,
            },
            {
                key: "course.name",
                name: "Tên môn học",
                text_error: 'Tên môn học là bắt buộc',
                required: true,
            }
        ]
    },
    {
        key: "course",
        name: "Môn học",
        description: "Thông tin chi tiết về lịch sử học tập, điểm, điểm danh, nhận xét của giảng viên đối vói học viên",
        icon: "https://d1j8r0kxyu9tj8.cloudfront.net/files/1574699900oUaNuMRVitwULgQ.png",
        selected: false,
        properties: [
            {
                key: "course.name",
                name: "Tên môn học",
                text_error: 'Tên môn học là bắt buộc',
                required: true,
            },
            {
                key: "course.duration",
                name: "Số buổi học",
            }
        ]
    },

];

@observer
class TypeData extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    componentWillMount() {
        if (this.props.store.currentStep.data.types.length <= 0) {
            this.props.store.currentStep.data.types = [...types];
        }
    }

    onSelectType(typeSelected) {
        typeSelected.selected = !typeSelected.selected;
    }

    render() {
        const {currentStep} = this.props.store;
        return (
            <div className="type-data-container">
                <div className="row">
                    {currentStep.data.types.map((type) => {
                        return (
                            <div className="col-md-3 col-sm-3 col-xs-6">
                                <div className="type-item">
                                    <div className={"type-content " + (type.selected ? " type-active " : "")}
                                         onClick={() => this.onSelectType(type)}>
                                        <img src={type.icon} className="type-icon"/>
                                        <div className="type-title">
                                            {type.name}
                                        </div>
                                        <div className="type-description">
                                            {type.description}
                                        </div>
                                        <div className="checkbox-container type-checkbox">
                                            <input type="checkbox" checked={type.selected}/>
                                            <span className="checkmark"/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

        );
    }
}

export default TypeData;
