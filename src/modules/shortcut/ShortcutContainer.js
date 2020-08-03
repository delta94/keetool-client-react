import React from 'react';
import {connect} from 'react-redux';

const SHORTCUTS = [
    {
        name: 'Học viên',
        description: 'Quản lý danh sách, thông tin chi tiết về học viên',
        color: '#F44236',
        link: '/sales/registerlist',
        icon: 'school'
    },
    {
        name: 'Lớp học',
        description: 'Quản lý danh sách lớp học, môn học, điểm danh',
        color: '#00BCD5',
        link: '/teaching/classes',
        icon: 'home_work'
    },
    {
        name: 'Chấm công',
        description: 'Thống kê chấm công nhân viên, giảng viên, trợ giảng',
        color: '#673BB7',
        link: '/dashboard/checkin-checkout',
        icon: 'fingerprint'
    },
    {
        name: 'CRM',
        description: 'Quản lý các học viên tiềm năng, các đăng kí học',
        color: '#4CB050',
        link: '/customer-services/leads',
        icon: 'contact_phone'
    },
    {
        name: 'Tài chính',
        description: 'Quản lý tài chính, dòng tiền, thu chi',
        color: '#EA1E63',
        link: '/finance/moneycollect',
        icon: 'attach_money'
    },
    {
        name: 'Cài đặt',
        description: 'Người dùng hệ thống, Email, SMS tự động',
        color: '#673BB7',
        link: '/setting',
        icon: 'settings'
    },
    {
        name: 'SMS',
        description: 'Gửi SMS tự động đến hàng loạt học viên',
        color: '#4CB050',
        link: '/sms/campaign-list',
        icon: 'textsms'
    },
    {
        name: 'Email',
        description: 'Gửi Email tự động đến hàng loạt học viên',
        color: '#F44236',
        link: '/email/campaigns',
        icon: 'email'
    }, {
        name: 'Dashboard',
        description: 'Thống kê, báo cáo theo thời gian thực',
        color: '#00BCD5',
        link: '/dashboard/sale',
        icon: 'dashboard'
    },
    {
        name: 'Mobile App',
        description: 'Ứng dụng riêng cho học viên, thống kê và cài đặt',
        color: '#FF9700',
        link: '#',
        icon: 'phone_iphone'
    },
    {
        name: 'Lịch dạy',
        description: 'Xem lịch dạy từng lớp học',
        color: '#673BB7',
        link: '/teaching/teaching-schedule',
        icon: 'event'
    },
    {
        name: 'Trang cá nhận',
        description: 'Thông tin cá nhân của bạn',
        color: '#EA1E63',
        link: '/profile/my-profile',
        icon: 'account_box'
    },
]

class ShortcutContainer extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {

        return (
            <div className="container-fluid">
                <div className="card">
                    <div className="padding-horizontal-20px padding-vertical-20px" style={{paddingBottom: 40}}>
                        <div
                            className="flex flex-col flex-justify-content-center flex-align-items-center margin-vertical-15">
                            <div
                                className="search-shortcut flex-row flex flex-justify-content-center flex-align-items-center ">
                               <span className="material-icons margin-left-10 margin-right-5">
                                search
                                </span>
                                <input type="text" placeholder="Bạn đang muốn làm gì?"/>
                            </div>
                        </div>
                        <div className="row">
                            {
                                SHORTCUTS.map((shortcut) => {
                                        return (
                                            <div className="col-md-3 col-sm-4 col-xs-6">
                                                <a
                                                    href={shortcut.link}
                                                    className="flex flex-col flex-justify-content-center flex-align-items-center padding-vertical-20px cursor-pointer shortcut">
                                                    <div style={{
                                                        width: 100,
                                                        height: 100,
                                                        backgroundColor: shortcut.color,
                                                        padding: 10,
                                                        margin: 10,
                                                        borderRadius: 10
                                                    }}
                                                         className="flex flex-col flex-justify-content-center flex-align-items-center"
                                                    >
                                                        <span className="material-icons">
                                                            {shortcut.icon}
                                                        </span>
                                                    </div>
                                                    <div className="bold">
                                                        {shortcut.name}
                                                    </div>
                                                    <div className="text-center" style={{height: 30}}>
                                                        {shortcut.description}
                                                    </div>
                                                </a>

                                            </div>
                                        );
                                    }
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>

        );
    }
}

function mapStateToProps(state) {
    return {
        user: state.login.user,

    };
}

export default connect(mapStateToProps)(ShortcutContainer);
