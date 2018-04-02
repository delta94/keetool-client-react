import React from 'react';
import Loading from '../../components/common/Loading';
import * as helper from '../../helpers/helper';
import TooltipButton from '../../components/common/TooltipButton';
import Barchart from './Barchart';
import ListClass from './ListClass';
import PropTypes from 'prop-types';
import ListAttendanceShift from './ListAttendanceShift';
import ListAttendanceClass from './ListAttendanceClass';
import {DATE} from '../../constants/constants';

class DashboardComponent extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    componentWillMount() {
        this.props.loadDashboard();
    }

    render() {
        if (this.props.isLoading) {
            return <Loading/>;
        } else {
            let {
                total_money, target_revenue, register_number, paid_number, zero_paid_number, remain_days,
                percent_remain_days, total_classes, courses, user, count_paid, count_total, registers_by_date, date_array,
                paid_by_date, money_by_date, classes, shifts, now_classes, current_date, end_time_gen

            } = this.props.dashboard;
            let classProfile = user.is_saler && user.rating ? 'col-md-3' : 'col-md-4';
            if (this.props.dashboard.user) {
                return (
                    <div>
                        <div className="row">
                            <div className="col-lg-3 col-md-6 col-sm-6">
                                <div className="card card-stats">
                                    <div className="card-content text-align-left">
                                        <p className="category">Doanh
                                            thu</p>
                                        <h3 className="card-title">{helper.convertDotMoneyToK(helper.dotNumber(total_money))}/{helper.convertDotMoneyToK(helper.dotNumber(target_revenue))}</h3>
                                        <TooltipButton placement="top"
                                                       text={Math.round(total_money * 100 / target_revenue) + '%'}>
                                            <div className="progress progress-line-primary"
                                            >
                                                <div className="progress-bar" role="progressbar"
                                                     style={{width: total_money * 100 / target_revenue + '%'}}/>
                                            </div>
                                        </TooltipButton>
                                    </div>
                                    <div className="card-footer">
                                        <div className="stats">
                                            <i className="material-icons">timeline</i>
                                            <a href="#money-by-date">Chi tiết</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-6 col-sm-6">
                                <div className="card card-stats">
                                    <div className="card-content text-align-left">
                                        <p className="category">Đã đóng tiền</p>
                                        <h3 className="card-title">{paid_number}/{register_number}</h3>
                                        <div className="progress progress-line-danger">
                                            <TooltipButton placement="top"
                                                           text={`${paid_number} học viên đã nộp tiền`}>
                                                <div className="progress-bar progress-bar-success"
                                                     style={{width: paid_number * 100 / register_number + '%'}}/>
                                            </TooltipButton>
                                            <TooltipButton placement="top"
                                                           text={`${zero_paid_number} học viên nộp 0 đồng`}>
                                                <div className="progress-bar progress-bar-warning"
                                                     style={{width: zero_paid_number * 100 / register_number + '%'}}/>
                                            </TooltipButton>
                                            <TooltipButton placement="top"
                                                           text={`${register_number - zero_paid_number - paid_number} chưa nộp tiền`}>
                                                <div className="progress progress-line-danger"
                                                     style={{width: (register_number - zero_paid_number - paid_number) * 100 / register_number + '%'}}/>
                                            </TooltipButton>
                                        </div>
                                    </div>
                                    <div className="card-footer">
                                        <div className="stats">
                                            <i className="material-icons">list</i>
                                            <a href="/finance/paidlist">Chi tiết</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-6 col-sm-6">
                                <div className="card card-stats">
                                    <div className="card-content text-align-left">
                                        <p className="category">Số lớp còn lại</p>
                                        <h3 className="card-title">{total_classes}</h3>
                                        <div className="progress progress-line-danger">
                                            {courses.map((course, index) => {
                                                return (
                                                    <TooltipButton placement="top" key={index}
                                                                   text={`${course.name}: ${course.total_classes} lớp`}>
                                                        <div className="progress-bar"
                                                             style={{
                                                                 width: (course.total_classes * 100 / total_classes) + '%',
                                                                 background: course.color
                                                             }}/>
                                                    </TooltipButton>
                                                );
                                            })}
                                        </div>
                                    </div>
                                    <div className="card-footer">
                                        <div className="stats">
                                            <i className="material-icons">list</i>
                                            <a href="#list-class">Chi tiết</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-6 col-sm-6">
                                <div className="card card-stats">
                                    <div className="card-content text-align-left">
                                        <p className="category">Số ngày còn lại</p>
                                        <h3 className="card-title">{remain_days}</h3>
                                        <div className="progress progress-line-danger">
                                            <TooltipButton placement="top"
                                                           text={`${Math.round((100 - percent_remain_days))}%`}>
                                                <div className="progress progress-line-rose">
                                                    <div className="progress-bar progress-bar-rose" role="progressbar"
                                                         style={{width: (100 - percent_remain_days) + '%'}}/>
                                                </div>
                                            </TooltipButton>
                                        </div>
                                    </div>
                                    <div className="card-footer">
                                        <div className="stats">
                                            <i className="material-icons">update</i> {end_time_gen}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12">
                                <div className="card card-stats">
                                    <div className="card-content">
                                        <div className="row">
                                            <div className={"text-align-left " + classProfile}>
                                                <p className="category">Nhân viên</p>
                                                <h3 className="card-title">{user.name}</h3>
                                                <div className="card-footer" style={{
                                                    margin: '10px 0 10px',
                                                }}>
                                                    <div className="stats">
                                                        <i className="material-icons">account_box</i>
                                                        <a href="/profile/my-profile">Trang cá nhân</a>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={"text-align-left " + classProfile}>
                                                <p className="category">Chức vụ</p>
                                                <h3 className="card-title">{user.current_role.role_title}</h3>
                                            </div>
                                            {(user.is_saler) &&
                                            <div className={"text-align-left " + classProfile}>
                                                <p className="category">Chỉ tiêu</p>
                                                <h3 className="card-title">{`${count_paid}/${count_total}`}</h3>
                                                <TooltipButton placement="top"
                                                               text={`${count_paid}/${count_total}`}>
                                                    <div className="progress progress-line-rose">
                                                        <div className="progress-bar progress-bar-rose"
                                                             role="progressbar"
                                                             style={{width: `${count_paid * 100 / count_total}%`}}/>
                                                    </div>
                                                </TooltipButton>
                                                <div className="card-footer" style={{margin: '0 0 10px'}}>
                                                    <div className="stats">
                                                        <i className="material-icons">list</i>
                                                        <a href={"/teaching/registerlist/" + user.id}>Danh sách đăng
                                                            kí</a>
                                                    </div>
                                                </div>
                                            </div>
                                            }
                                            {
                                                (user.rating) &&
                                                <div className={"text-align-left " + classProfile}>
                                                    <p className="category">Đánh giá</p>
                                                    <TooltipButton placement="top"
                                                                   text={helper.calculatorRating([user.rating.rating_number_teach, user.rating.rating_number_ta],
                                                                       [user.rating.rating_avg_teach, user.rating.rating_avg_ta])}>
                                                        <div className="star-rating float-left">
                                            <span style={{
                                                width: 20 * helper.calculatorRating([user.rating.rating_number_teach, user.rating.rating_number_ta],
                                                    [user.rating.rating_avg_teach, user.rating.rating_avg_ta]) + '%'
                                            }}/>
                                                        </div>
                                                    </TooltipButton>
                                                </div>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row" id="register-by-date">
                            <div className="col-md-12">
                                <div className="card">
                                    <div className="card-content">
                                        <div className="tab-content">
                                            <h4 className="card-title">
                                                <strong>Số lượng đăng kí theo ngày</strong>
                                            </h4>
                                            <br/><br/>
                                            <Barchart
                                                label={date_array}
                                                data={[registers_by_date, paid_by_date]}
                                                id="barchar_register_by_date"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row" id="money-by-date">
                            <div className="col-md-12">
                                <div className="card">
                                    <div className="card-content">
                                        <div className="tab-content">
                                            <h4 className="card-title">
                                                <strong>Doanh thu theo ngày</strong>
                                            </h4>
                                            <br/><br/>
                                            <Barchart
                                                label={date_array}
                                                data={[money_by_date]}
                                                id="barchar_money_by_date"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {
                            (shifts || this.props.dateShifts !== current_date) &&
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="card">
                                        <div className="card-content">
                                            <div className="tab-content">
                                                <div className="flex flex-row flex-space-between">
                                                    <h4 className="card-title">
                                                        <strong>{this.props.dateShifts === current_date ? 'Lịch trực hôm nay' : 'Lịch trực ' + this.props.dateShifts}</strong>
                                                    </h4>
                                                    <div className="flex flex-row">
                                                        <button
                                                            className="btn btn-rose btn-sm"
                                                            onClick={() => this.props.loadAttendanceShift(-DATE)}
                                                        >
                                                        <span className="btn-label">
                                                            <i className="material-icons">keyboard_arrow_left</i>
                                                        </span>
                                                            Trước
                                                        </button>
                                                        <button
                                                            className="btn btn-rose btn-sm"
                                                            onClick={() => this.props.loadAttendanceShift(DATE)}
                                                        >
                                                            Sau
                                                            <span className="btn-label btn-label-right">
                                                            <i className="material-icons">
                                                                keyboard_arrow_right
                                                            </i>
                                                        </span>
                                                        </button>
                                                    </div>
                                                </div>
                                                <br/>
                                                {
                                                    this.props.isLoadingAttendanceShifts ? <Loading/> :
                                                        (
                                                            shifts ?
                                                                <ListAttendanceShift
                                                                    baseId={this.props.baseId}
                                                                    shifts={shifts}
                                                                /> : <div><strong>Hiện không có lịch trực</strong></div>
                                                        )
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }
                        {
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="card">
                                        <div className="card-content">
                                            <div className="tab-content">
                                                <div className="flex flex-row flex-space-between">
                                                    <h4 className="card-title">
                                                        <strong>{this.props.dateClasses === current_date ? 'Lớp học hôm nay' : 'Lớp học ' + this.props.dateClasses}</strong>
                                                    </h4>
                                                    <div className="flex flex-row">
                                                        <button
                                                            className="btn btn-rose btn-sm"
                                                            onClick={() => this.props.loadAttendanceClass(-DATE)}
                                                        >
                                                        <span className="btn-label">
                                                            <i className="material-icons">keyboard_arrow_left</i>
                                                        </span>
                                                            Trước
                                                        </button>
                                                        <button
                                                            className="btn btn-rose btn-sm"
                                                            onClick={() => this.props.loadAttendanceClass(DATE)}
                                                        >
                                                            Sau
                                                            <span className="btn-label btn-label-right">
                                                            <i className="material-icons">
                                                                keyboard_arrow_right
                                                            </i>
                                                        </span>
                                                        </button>
                                                    </div>
                                                </div>
                                                <br/>
                                                {
                                                    this.props.isLoadingAttendanceClasses ? <Loading/> :
                                                        (
                                                            now_classes ?
                                                                <ListAttendanceClass
                                                                    baseId={this.props.baseId}
                                                                    now_classes={now_classes}
                                                                /> : <div><strong>Hiện không có lớp học</strong></div>
                                                        )
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }

                        <div className="row" id="list-class">
                            <div className="col-md-12">
                                <div className="card">
                                    <div className="card-content">
                                        <div className="tab-content">
                                            <h4 className="card-title"><strong>Danh sách lớp</strong></h4>
                                            <br/>
                                            <ListClass
                                                classes={classes}
                                                user={user}
                                                changeClassStatus={this.props.changeClassStatus}
                                                openModalClass={this.props.openModalClass}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            } else {
                return (
                    <h1>Có lỗi xảy ra</h1>
                );
            }
        }
    }
}

DashboardComponent.propTypes = {
    isLoading: PropTypes.bool.isRequired,
    isLoadingAttendanceShifts: PropTypes.bool.isRequired,
    isLoadingAttendanceClasses: PropTypes.bool.isRequired,
    dashboard: PropTypes.object.isRequired,
    changeClassStatus: PropTypes.func.isRequired,
    openModalClass: PropTypes.func.isRequired,
    loadAttendanceShift: PropTypes.func.isRequired,
    loadAttendanceClass: PropTypes.func.isRequired,
    baseId: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]).isRequired,
    dateShifts: PropTypes.string.isRequired,
    dateClasses: PropTypes.string.isRequired,
    loadDashboard: PropTypes.func.isRequired,
};


export default DashboardComponent;
