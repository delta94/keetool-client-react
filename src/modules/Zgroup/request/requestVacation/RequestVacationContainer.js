import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as requestActions from "../requestActions";
import * as PropTypes from "prop-types";
import Loading from "../../../../components/common/Loading";



class RequestVacationContainer extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {

        };
    }

    componentWillMount() {
        let {requestActions} = this.props;
        requestActions.getAllRequestVacation();
    }

    // componentWillReceiveProps(next){
    //     console.log(next);
    // }


    render() {
        //console.log(this.props);
        return (
            <div className="content">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-12">

                            <div className="card">
                                <div className="card-header card-header-icon" data-background-color="rose">
                                <i className="material-icons">local_hotel</i>
                                </div>

                                <div className="card-content">
                                    <h4 className="card-title">Danh sách xin nghỉ phép</h4>
                                    <Loading/>
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        );
    }
}

RequestVacationContainer.propTypes = {
    isLoading: PropTypes.bool.isRequired,
    requestActions: PropTypes.object,
    paginator: PropTypes.object,
    requestVacations: PropTypes.object,
};

function mapStateToProps(state) {
    return {
        isLoading: state.request.isLoading,
        paginator: state.request.paginator,
        requestVacations: state.request.requestVacations,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        requestActions: bindActionCreators(requestActions, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(RequestVacationContainer);
