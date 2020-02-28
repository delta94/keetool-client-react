import React from 'react';
import PropTypes from 'prop-types';
import {Bar} from "react-chartjs-2";
import _ from 'lodash';
import moment from "moment";
import {DATE_FORMAT} from "../../constants/constants";
import Loading from "../../components/common/Loading";

const filter = [
    {
        key: "date",
        value: "Ngày",
    },
    {
        key: "week",
        value: "Tuần",
    },
    {
        key: "month",
        value: "Tháng",
    },
    {
        key: "quarter",
        value: "Quý",
    },
    {
        key: "year",
        value: "Năm",
    }
];


class BarChartFilterDate extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            currentFilter: "date"
        };
    }

    onChangeFilter = (filter) => {
        this.setState({
            currentFilter: filter
        });
    };

    getLabels = (groupDates) => {

        switch (this.state.currentFilter) {
            case "date":
                return this.props.dates;
            case "week":
            case "month":
            case "quarter":
            case "year":
                return Object.keys(groupDates).map((key) => {
                    return groupDates[key][0] + " - " + groupDates[key][groupDates[key].length - 1];
                });
            default :
                return this.props.dates;
        }
    };

    getDataSet = (groupDates) => {
        let data = [];
        switch (this.state.currentFilter) {
            case "date":
                data = this.props.data;
                break;
            case "week":
            case "month":
            case "quarter":
            case "year":
                data = this.props.data.map((dataArray) => {
                    let firstIndex = 0;
                    return Object.keys(groupDates).map((key) => {
                        const newData = _.sumBy(dataArray.slice(firstIndex, firstIndex + groupDates[key].length), (item) => Number.parseInt(item));
                        firstIndex = groupDates[key].length + firstIndex;
                        return newData;
                    });
                });
                break;
            default :
                data = this.props.data;
                break;
        }

        return this.props.labels.map((value, index) => {
            return {
                ...value,
                data: [...data[index]]
            };
        });
    }

    renderFilter = () => {
        const {currentFilter} = this.state;

        return (
            <div className="flex flex-wrap flex-space-between flex-row flex-align-items-center">
                <div>
                    {this.props.children}
                </div>
                <ul className="nav nav-pills nav-pills-dark" data-tabs="tabs"
                    style={{marginTop: 15, marginBottom: "15"}}>
                    {filter.map((item, index) => {
                        let className = currentFilter === item.key ? 'active' : '';
                        return (
                            <li className={className} key={index}>
                                <a onClick={() => this.onChangeFilter(item.key)}>
                                    {item.value}
                                </a>
                            </li>
                        );
                    })}
                </ul>
            </div>
        );
    }

    render() {
        const {dateFormat, optionsBar, isLoading} = this.props;
        const {currentFilter} = this.state;

        if (isLoading) {
            return (
                <div>
                    {this.renderFilter()}
                    <Loading/>
                </div>);
        }

        const groupDates = _.groupBy(this.props.dates, (result) => moment(result, dateFormat).startOf(currentFilter));

        const dataSet = {
            labels: this.getLabels(groupDates),
            datasets: this.getDataSet(groupDates)
        };

        return (
            <div>
                {this.renderFilter()}
                <Bar
                    data={dataSet}
                    options={optionsBar}
                />
            </div>
        );
    }
}

BarChartFilterDate.defaultProps = {
    dateFilterFormat: DATE_FORMAT
};

BarChartFilterDate.propTypes = {
    dates: PropTypes.array.isRequired,
    labels: PropTypes.array.isRequired,
    data: PropTypes.array.isRequired,
    dateFormat: PropTypes.string,
    optionsBar: PropTypes.object,
    isLoading: PropTypes.bool,
};

export default BarChartFilterDate;
