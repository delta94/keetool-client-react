import React from 'react';
import {observer} from 'mobx-react';
import Filter from "./Filter";
import CardRevenue from "./CardRevenue";
import filterStore from "./filterStore";
import cardRevenueStore from "./cardRevenueStore";
import {DATE_FORMAT, DATE_FORMAT_SQL} from "../../../constants/constants";
import DashboardRegisterStore from "./DashboardRegisterStore";
import Loading from "../../../components/common/Loading";
import BarChartFilterDate from "../BarChartFilterDate";
import moment from "moment";
import {dotNumber} from "../../../helpers/helper";

const optionsBarMoney = {
    tooltips: {
        callbacks: {
            label: function (tooltipItem, data) {
                let label = data.datasets[tooltipItem.datasetIndex].label || '';

                if (label) {
                    label += ': ';
                }
                label += `${dotNumber(tooltipItem.value)}đ`;
                return label;
            }
        }
    },
    legend: {
        display: true,
        position: "bottom"
    }
};

const optionsBarRegister = {
    tooltips: {
        callbacks: {
            label: function (tooltipItem, data) {
                let label = data.datasets[tooltipItem.datasetIndex].label || '';

                if (label) {
                    label += ': ';
                }
                label += `${dotNumber(tooltipItem.value)} đơn`;
                return label;
            }
        }
    },
    legend: {
        display: true,
        position: "bottom"
    }
};

@observer
class DashboardRegisterComponent extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.store = new DashboardRegisterStore();
    }

    componentDidMount() {
        const filter = {...filterStore.filter};
        filter.start_time = filterStore.filter.start_time.format(DATE_FORMAT_SQL);
        filter.end_time = filterStore.filter.end_time.format(DATE_FORMAT_SQL);
        this.store.analyticsRegister(filter);
    }

    loadData = (filter) => {
        cardRevenueStore.analyticsRevenue(filter);
        this.store.analyticsRegister(filter);
    }

    formatDates = (dates) => {
        return dates && dates.map((date) => {
            return moment(date, DATE_FORMAT_SQL).format(DATE_FORMAT);
        })
    }

    render() {
        const {isLoading, data} = this.store;
        console.log(data);
        return (
            <div>
                <Filter loadData={this.loadData}/>
                <CardRevenue/>
                {isLoading ? <Loading/> :
                    <div className="row gutter-20">
                        <div className="col-md-12">
                            <div className="card margin-bottom-20 margin-top-0">
                                <div className="card-content text-align-left">
                                    <div className="tab-content">
                                        <h4 className="card-title">
                                            <strong>Số lượng đăng kí theo ngày</strong>
                                        </h4>
                                        {
                                            data.dates && data.dates.length > 0 &&
                                            <BarChartFilterDate
                                                isLoading={isLoading}
                                                dates={this.formatDates(data.dates)}
                                                dateFormat={DATE_FORMAT}
                                                data={[data.registers_by_date, data.paid_by_date]}
                                                optionsBar={optionsBarRegister}
                                                labels={[
                                                    {
                                                        label: "Đơn đăng kí",
                                                        backgroundColor: '#ffaa00',
                                                        borderColor: '#ffaa00',
                                                    },
                                                    {
                                                        label: "Đơn đã nộp tiền",
                                                        backgroundColor: '#4caa00',
                                                        borderColor: '#4caa00',
                                                    }]}
                                            />
                                        }
                                        <br/>

                                    </div>
                                </div>

                            </div>
                        </div>
                        <div className="col-md-12">
                            <div className="card margin-bottom-20 margin-top-0">
                                <div className="card-content text-align-left">
                                    <div className="tab-content">
                                        <h4 className="card-title">
                                            <strong>Doanh thu theo ngày</strong>
                                        </h4>
                                        {
                                            data.dates && data.dates.length > 0 &&
                                            <BarChartFilterDate
                                                isLoading={isLoading}
                                                dates={this.formatDates(data.dates)}
                                                dateFormat={DATE_FORMAT}
                                                data={[data.money_by_date]}
                                                optionsBar={optionsBarMoney}
                                                labels={[
                                                    {
                                                        label: "Doanh thu",
                                                        backgroundColor: '#4caa00',
                                                        borderColor: '#4caa00',
                                                    }]}
                                            />

                                        }
                                        <br/>

                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                }

            </div>

        );
    }
}


export default DashboardRegisterComponent;
