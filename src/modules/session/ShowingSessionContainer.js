import React from "react";
import SessionComponent from "./SessionComponent";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import * as sessionAction from "./sessionAction";
import {bindActionCreators} from 'redux';

class ShowingSessionContainer extends React.Component{
    render(){
        return (
            <div className="wrapper">
                <div className="content">
                    <div className="content">
                        <div className="container-fluid">
                            <div>
                                <div className="row">
                                    <div className="col-md-12">
                                        <div style={{
                                            display: "flex",
                                            flexDirection: "row",
                                            justifyContent: "space-between"
                                        }}>
                                            <div>
                                                <button onClick={()=>this.props.sessionAction.toggleSessionModal()}
                                                        rel="tooltip" data-placement="top" title=""
                                                        className="btn btn-rose">
                                                    Thêm suất chiếu
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <div className="card">
                                            <div className="card-header card-header-icon"
                                                 data-background-color="rose"><i
                                                className="material-icons">assignment</i>
                                            </div>
                                            <div className="card-content"><h4 className="card-title">Danh sách
                                                suất chiếu đang chiếu</h4>
                                                <br/>
                                                <SessionComponent
                                                    sessions={this.props.showingSession}/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        );
    }
}
ShowingSessionContainer.propTypes = {
    showingSession: PropTypes.array.isRequired,
    sessionAction: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return {
        showingSession: state.session.showingSession,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        sessionAction: bindActionCreators(sessionAction, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ShowingSessionContainer);