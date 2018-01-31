import React from "react";
import * as helper from "../../helpers/helper";
import Barchart from './Barchart';
import Loading from '../../components/common/Loading';
import TooltipButton from '../../components/common/TooltipButton';
class DashBoardUpComponent extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    componentWillMount() {
       // this.props.loadDashboard();
    }

    render() {
        if (this.props.isLoadingDashBoard) {
            return <Loading/>;
        } else {
            let {
                total_money, target_revenue, register_number, paid_number, zero_paid_number, remain_days,
                percent_remain_days, total_classes, courses, user, count_paid, count_total, registers_by_date, date_array,
                paid_by_date, money_by_date, classes, shifts, now_classes, current_date, end_time_gen

            } = this.props.dashboard;
            console.log(classes,shifts,now_classes,current_date);
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
                                        <p className="category">Đã thanh toán</p>
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
                                            <a href="">Chi tiết</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-6 col-sm-6">
                                <div className="card card-stats">
                                    <div className="card-content text-align-left">
                                        <p className="category">Số phòng còn lại</p>
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
                                            <a href="">Chi tiết</a>
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
                                    <div className="card-header card-header-icon" data-background-color="rose">
                                        <i className="material-icons">insert_chart</i>
                                    </div>
                                    <div className="card-content">
                                        <h4 className="card-title">Số lượng đăng kí theo ngày
                                            <small/>
                                        </h4>
                                        <Barchart
                                            label={date_array}
                                            data={[registers_by_date, paid_by_date]}
                                            id="barchar_register_by_date"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row" id="money-by-date">
                            <div className="col-md-12">
                                <div className="card">
                                    <div className="card-header card-header-icon" data-background-color="rose">
                                        <i className="material-icons">insert_chart</i>
                                    </div>
                                    <div className="card-content">
                                        <h4 className="card-title">Doanh thu theo ngày
                                            <small/>
                                        </h4>
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

                );
            } else {
                return (
                    <h1>Có lỗi xảy ra</h1>
                );
            }
        }
    }
}

export default DashBoardUpComponent;