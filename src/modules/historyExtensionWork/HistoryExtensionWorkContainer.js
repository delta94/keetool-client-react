import React from 'react';
import HistoryExtensionList from "./HistoryExtensionList";
import * as HistoryExtensionWorkActions from "./HistoryExtensionWorkActions";
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Loading from "../../components/common/Loading";
import Search from "../../components/common/Search";
import * as helper from '../../helpers/helper';
import _ from 'lodash';
import PropTypes from 'prop-types';

class HistoryExtensionWorkContainer extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            page: 1,
            ok: 0,
            search: '',
            paginator: {
                current_page: 1,
                limit: 5,
                total_pages: 1,
                total_count: 1
            }
        };
        this.deleteHistoryExtensionWork = this.deleteHistoryExtensionWork.bind(this);
        this.acceptHistoryExtensionWork = this.acceptHistoryExtensionWork.bind(this);
        this.loadHistoryExtensionWork = this.loadHistoryExtensionWork.bind(this);
        this.searchHistoryExtension = this.searchHistoryExtension.bind(this);
    }

    componentWillMount() {
        this.props.HistoryExtensionWorkActions.historyExtensionWork();

    }

    componentWillReceiveProps(nextProps) {
        this.setState({paginator: nextProps.paginator});
        if (this.state.ok === 1) this.props.HistoryExtensionWorkActions.historyExtensionWork(this.state.page);
        this.setState({ok: 0});
    }

    loadHistoryExtensionWork(page = 1) {
        this.setState({page});
        this.props.HistoryExtensionWorkActions.historyExtensionWork(page);
    }

    deleteHistoryExtensionWork(id) {
        helper.confirm('error', 'Hủy', "Bạn muốn từ chối yêu cầu này không?", () => {
            this.props.HistoryExtensionWorkActions.deleteHistoryExtensionWork(id);
            this.setState({ok: 1});
        });
    }

    acceptHistoryExtensionWork(id) {
        helper.confirm('success', 'Đồng ý', "Bạn muốn chấp nhận yêu cầu này không?", () => {
            this.props.HistoryExtensionWorkActions.acceptHistoryExtensionWork(id);
            this.setState({ok: 1});
        });
    }

    searchHistoryExtension(value) {
        this.setState({
            page: 1,
            search: value,
        });
        if (this.timeOut !== null) {
            clearTimeout(this.timeOut);
        }
        this.timeOut = setTimeout(function () {
            this.props.HistoryExtensionWorkActions.historyExtensionWork(1, value);
        }.bind(this), 500);
    }

    render() {
        return (
            <div className="content">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-12">

                            <div className="card">
                                <div className="card-header card-header-icon" data-background-color="rose">
                                    <i className="material-icons">assignment</i>
                                </div>
                                <div className="card-content">
                                    <h4 className="card-title">Lịch sử gia hạn công việc</h4>
                                    <div className="row">
                                        <div className="col-md-12">
                                            <Search
                                                className="col-md-12"
                                                placeholder="Tìm kiếm lịch sử gia hạn công việc"
                                                value={this.state.search}
                                                onChange={this.searchHistoryExtension}
                                            />
                                        </div>
                                    </div>
                                    {
                                        this.props.isLoading ? <Loading/> :
                                            <HistoryExtensionList
                                                data={this.props.data || []}
                                                deleteHistory={this.deleteHistoryExtensionWork}
                                                acceptHistory={this.acceptHistoryExtensionWork}
                                            />
                                    }
                                    <ul className="pagination pagination-primary">
                                        {_.range(1, this.props.paginator.total_pages + 1).map(page => {

                                            if (Number(this.state.page) === page) {
                                                return (
                                                    <li key={page} className="active">
                                                        <a onClick={() => {
                                                            this.loadHistoryExtensionWork(page);
                                                        }}>{page}</a>
                                                    </li>
                                                );
                                            } else {
                                                return (
                                                    <li key={page}>
                                                        <a onClick={() => {
                                                            this.loadHistoryExtensionWork(page);
                                                        }}>{page}</a>
                                                    </li>
                                                );
                                            }
                                        })}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

HistoryExtensionWorkContainer.propTypes = {
    HistoryExtensionWorkActions: PropTypes.object.isRequired,
    isLoading: PropTypes.bool.isRequired,
    data: PropTypes.array.isRequired,
    paginator: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
    return {
        isLoading: state.historyExtension.isLoading,
        data: state.historyExtension.data,
        paginator: state.historyExtension.paginator,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        HistoryExtensionWorkActions: bindActionCreators(HistoryExtensionWorkActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(HistoryExtensionWorkContainer);