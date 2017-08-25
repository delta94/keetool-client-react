/**
 * Created by phanmduong on 8/24/17.
 */
import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import Link from "react-router/es/Link";
import Search from "../../components/common/Search";
import Loading from "../../components/common/Loading";
import ListTemplate from './ListTemplate';
import * as emailTemplatesActions from './emailTemplatesActions';
import _ from 'lodash';

class EmailTemplatesContainer extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            page: 1,
            query: ""
        };
        this.timeOut = null;
        this.templatesSearchChange = this.templatesSearchChange.bind(this);
        this.deleteEmailTemplate = this.deleteEmailTemplate.bind(this);
    }

    componentWillMount() {
        this.loadTemplates();
    }

    templatesSearchChange(value) {
        this.setState({
            page: 1,
            query: value
        });
        if (this.timeOut !== null) {
            clearTimeout(this.timeOut);
        }
        this.timeOut = setTimeout(function () {
            this.props.emailTemplatesActions.loadTemplates(this.state.page, this.state.query);
        }.bind(this), 500);

    }

    loadTemplates(page = 1) {
        this.setState({page});
        this.props.emailTemplatesActions.loadTemplates(page, this.state.query);
    }

    deleteEmailTemplate(emailTemplate){
        this.props.emailTemplatesActions.deleteEmailTemplate(emailTemplate.id);
    }

    render() {
        return (
            <div id="page-wrapper">
                <div className="container-fluid">


                    <div className="card">

                        <div className="card-header card-header-icon" data-background-color="rose">
                            <i className="material-icons">assignment</i>
                        </div>

                        <div className="card-content">
                            <h4 className="card-title">Email templates</h4>
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="col-md-3">
                                        <Link to="/email-template/create" className="btn btn-rose">
                                            Thêm template
                                        </Link>
                                    </div>
                                    <Search
                                        onChange={this.templatesSearchChange}
                                        value={this.state.query}
                                        placeholder="Tìm kiếm template"
                                        className="col-md-9"
                                    />
                                </div>
                            </div>

                            {this.props.isLoadingTemplates ? <Loading/> :
                                <ListTemplate
                                    templates={this.props.templates}
                                    deleteEmailTemplate={this.deleteEmailTemplate}
                                />
                            }
                        </div>
                    </div>

                    <div className="card-content">
                        <ul className="pagination pagination-primary">
                            {_.range(1, this.props.totalPages + 1).map(page => {
                                if (Number(this.props.currentPage) === page) {
                                    return (
                                        <li key={page} className="active">
                                            <a onClick={() => this.loadTemplates(page)}>{page}</a>
                                        </li>
                                    );
                                } else {
                                    return (
                                        <li key={page}>
                                            <a onClick={() => this.loadTemplates(page)}>{page}</a>
                                        </li>
                                    );
                                }

                            })}
                        </ul>
                    </div>

                </div>
            </div>
        );
    }
}

EmailTemplatesContainer.propTypes = {
    templates: PropTypes.array.isRequired,
    isLoadingTemplates: PropTypes.bool.isRequired,
    error: PropTypes.bool.isRequired,
    totalPages: PropTypes.number.isRequired,
    currentPage: PropTypes.number.isRequired,
    emailTemplatesActions: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
    return {
        templates: state.emailTemplates.templates,
        isLoadingTemplates: state.emailTemplates.isLoading,
        error: state.emailTemplates.error,
        totalPages: state.emailTemplates.totalPages,
        currentPage: state.emailTemplates.currentPage,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        emailTemplatesActions: bindActionCreators(emailTemplatesActions, dispatch)
}
    ;
}

export default connect(mapStateToProps, mapDispatchToProps)(EmailTemplatesContainer);
