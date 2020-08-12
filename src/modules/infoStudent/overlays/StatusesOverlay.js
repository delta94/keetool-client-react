import React from 'react';
import FormInputText from "../../../components/common/FormInputText";
import Loading from "../../../components/common/Loading";
import {assignStatuses, createStatuses, deleteStatuses} from "../studentApi";
import {Overlay} from "react-bootstrap";
import * as ReactDOM from "react-dom";
import {isEmptyInput, showErrorNotification, upperCaseFirstLetter} from "../../../helpers/helper";
import {CirclePicker} from "react-color";
import Search from "../../../components/common/Search";
import * as studentActions from "../studentActions";
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {isEmpty} from "../../../helpers/entity/mobx";


class StatusesOverlay extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.initState = {
            show: false,
            create: false,
            status: {},
            isLoading: false,
            isProcessing: false,
            isDeleting: false,
            search: '',
            data:  this.props.data ?this.props.data : {}
        };
        this.state = this.initState;
    }

    componentWillMount() {
        this.loadStatuses(false);
    }

    loadStatuses = (singleLoad) => {
        let {studentActions,statusRef} = this.props;
        let isLoadedStatuses = this.props.isLoadedStatuses[statusRef];
        if(!isLoadedStatuses || singleLoad)
            studentActions.loadStatuses(statusRef);
    };

    deleteStatuses = (status) => {
        this.setState({
            isProcessing: true
        });
        deleteStatuses(status)
            .then(() => {
                this.loadStatuses();
            }).catch(() => {
            showErrorNotification(`${upperCaseFirstLetter(this.props.viName)} đang sử dụng không thể xóa!`);
        }).finally(() => {
            this.setState({
                isProcessing: false
            });
        });
    };

    toggleDelete = () => {
        this.setState({
            isDeleting: !this.state.isDeleting
        });
    };

    editStatuses = (status) => {
        this.setState({
            status,
            create: true
        });
    };

    updateFormData = (event) => {
        this.setState({
            status: {
                ...this.state.status,
                name: event.target.value
            }
        });
    };


    toggle = () => {
        this.setState({
            create: !this.state.create
        });
    };

    saveStatuses = () => {
        if (isEmptyInput(this.state.status.name)) {
            showErrorNotification(`Bạn cần nhập tên`);
        } else if (this.state.status.name.length > 20) {
            showErrorNotification("Độ dài tên không quá 20 kí tự");
        } else if (isEmptyInput(this.state.status.color)) {
            showErrorNotification("Bạn cần chọn màu");
        } else {
            this.setState({
                isLoading: true,
                create: false
            });
            createStatuses({...this.state.status, ref: this.props.statusRef})
                .then(() => {
                    this.setState({
                        status: {},
                        create: false,
                        isLoading:false
                    });
                    this.loadStatuses(true);
                });


        }
    };

    assignStatuses = (status) => {
        if(isEmptyInput(this.props.refId)) {
            if(this.props.onChange) this.props.onChange(status);
            this.setState({
                isProcessing: false,
                show: false,
                data:{...status}
            });
            return;
        }
        if(!isEmptyInput(this.props.refId)){
            this.setState({
                isProcessing: true
            });
            assignStatuses(status, this.props.refId, this.props.statusRef)
                .then(() => {
                    // this.loadStatuses(true);

                    this.setState({
                        isProcessing: false,
                        data:{...status}
                    });
                });
        }
    };

    close = () => {
        this.setState({show: false});
    };

    changeColor = (color) => {
        color = color ? color.hex : '';
        this.setState({
            status: {
                ...this.state.status,
                color
            }
        });
    };

    statusName = () => {
        let statuses =  this.props.statuses[this.props.statusRef] || [];
        let {data}  = this.state;
        let s = statuses && statuses.filter(i => i.id == data.id)[0];
        let defaultText = this.props.defaultText || "No status";
        return (s && !isEmptyInput(s.name)) ? s.name : defaultText;
    };

    render() {
        let {isDeleting, isLoading,data, isProcessing,show} = this.state;
        let { isLoadingStatuses, className,styleWrapper,styleOverlay,styleButton} = this.props;
        let statuses =  this.props.statuses[this.props.statusRef] || [];
        let showLoading = isLoading || isLoadingStatuses || isProcessing;
        let zIndex = show ? 1 : 0;
        let viName = isEmpty(this.props.viName) ? 'trạng thái' : this.props.viName;
        const current = (data && statuses.filter(s => s.id == data.id)[0]) || {};
        return (
            <div style={{position: "relative",backgroundColor: current.color, borderRadius:3, cursor:'pointer',zIndex, ...styleWrapper}}
                 className={className}
                 onClick={() => this.setState({show: !this.props.disabled})}
                 ref="StatusesOverlay">
                <div
                     data-toggle="tooltip"
                     rel="tooltip"
                     data-original-title={upperCaseFirstLetter(viName)}
                     style={styleButton}>
                    {this.statusName()}
                </div>
                <Overlay
                    rootClose={true}
                    show={show}
                    onHide={this.close}
                    placement="bottom"
                    container={this}
                    target={() => ReactDOM.findDOMNode(this.refs.StatusesOverlay)}>
                    <div className="kt-overlay" style={{width: "300px", marginTop: 35,...styleOverlay}}>


                        {!showLoading && <div style={{position: "relative"}}>
                            {
                                this.state.create && (
                                    <a className="text-rose" style={{position: "absolute", left: "0px", top: "2px"}}
                                       onClick={this.toggle}>
                                        <i className="material-icons">keyboard_arrow_left</i>
                                    </a>
                                )
                                // : (
                                //     <a className="text-rose" style={{position: "absolute", left: "0px", top: "2px"}}
                                //        onClick={() => this.setState({
                                //            create: !this.state.create,
                                //            status: {}
                                //        })}>
                                //         <i className="material-icons">add</i>
                                //     </a>
                                // )
                            }
                            <button
                                onClick={this.close}
                                type="button" className="close"
                                style={{color: '#5a5a5a', fontSize: 20}}>
                                <span aria-hidden="true">×</span>
                                <span className="sr-only">Close</span>
                            </button>
                            <div style={{textAlign: "center", fontSize: 16, color: 'black', marginBottom: 15}}>
                                {upperCaseFirstLetter(viName)}
                            </div>
                        </div>}
                        <div>{showLoading && <Loading/>}</div>
                        {!this.state.create && !showLoading && <div>
                            <Search
                                placeholder="Tìm theo tên" className="margin-bottom-10"
                                value={this.state.search}
                                onChange={search => this.setState({search})}
                            />
                        </div>}
                        {
                            this.state.create && !isProcessing ? (
                                <div>
                                    <FormInputText
                                        placeholder={`Tên ${viName}`}
                                        name="name"
                                        updateFormData={this.updateFormData}
                                        value={this.state.status.name || ""}/>
                                    <div style={{paddingLeft: "15px", marginTop: "20px"}}>
                                        <CirclePicker
                                            width="100%"
                                            color={this.state.status.color}
                                            onChangeComplete={this.changeColor}/>
                                    </div>
                                    {
                                        isDeleting ? (
                                            <div>
                                                {!isProcessing && (
                                                    <div style={{display: "flex", flexWrap: 'no-wrap'}}>
                                                        <button style={{margin: "15px 0 10px 5px"}}
                                                                className="btn btn-white width-50-percent"
                                                                onClick={this.toggleDelete}>
                                                            Huỷ
                                                        </button>
                                                        <button style={{margin: "15px 5px 10px 0"}}
                                                                className="btn btn-danger width-50-percent"
                                                                onClick={() => this.deleteStatuses(this.state.status)}>
                                                            Xác nhận
                                                        </button>
                                                    </div>
                                                )}
                                            </div>

                                        ) : (
                                            <div style={{display: "flex"}}>

                                                {/*{this.state.status.id &&*/}
                                                {/*    <button style={{margin: "15px 0 10px 5px"}}*/}
                                                {/*            className="btn btn-white width-50-percent"*/}
                                                {/*            onClick={this.toggleDelete}>*/}
                                                {/*        Xoá*/}
                                                {/*    </button>*/}
                                                {/*}*/}
                                                <button style={{margin: "15px 5px 10px 0"}}
                                                        className="btn btn-success width-50-percent"
                                                        onClick={this.saveStatuses}>
                                                    Lưu
                                                </button>

                                            </div>
                                        )
                                    }


                                </div>
                            ) : (
                                <div>
                                    {
                                        !showLoading && (
                                            <div>

                                                {!this.state.isCreate &&
                                                <a className="btn btn-add"
                                                   onClick={() => this.setState({
                                                       create: !this.state.create,
                                                       status: {}
                                                   })}>
                                                    Thêm {viName} mới
                                                    <i className="material-icons">add</i>
                                                </a>
                                                }
                                                <button
                                                    onClick={() => {
                                                        this.assignStatuses({id: null});
                                                    }}
                                                    className="btn"
                                                    style={{
                                                        textAlign: "left",
                                                        width: "100%",
                                                        marginBottom: 10,
                                                        display: "flex",
                                                        backgroundColor: 'transparent',
                                                        border: '1.5px dashed #e6e6e6',
                                                        color: '#a9a9a9',
                                                        justifyContent: "space-between",
                                                        alignItems: "center",
                                                    }}>
                                                    Không có {viName}
                                                    <div>
                                                        {(!data || (data && !data.id) )?
                                                            <i className="material-icons">done</i> : ""}
                                                    </div>
                                                </button>

                                                <div className="kt-scroll">
                                                {statuses && statuses
                                                    .filter(status => {
                                                        const s1 = status.name.trim().toLowerCase();
                                                        const s2 = this.state.search.trim().toLowerCase();
                                                        return s1.includes(s2) || s2.includes(s1);
                                                    })
                                                    .map((status) => {
                                                        const statusAdded = data && data.id == status.id;
                                                        return (
                                                            <div key={status.id} style={{
                                                                marginBottom: 10,
                                                                display: "flex",
                                                                justifyContent: 'space-between'
                                                            }}>
                                                                <button
                                                                    onClick={() => {
                                                                        this.assignStatuses(status);
                                                                    }}
                                                                    className="btn"
                                                                    style={{
                                                                        textAlign: "left",
                                                                        backgroundColor: status.color,
                                                                        width: "calc(100% - 30px)",
                                                                        margin: "0",
                                                                        display: "flex",
                                                                        justifyContent: "space-between",
                                                                        height: 35,
                                                                        padding: '0 15px',
                                                                        alignItems: "center",
                                                                    }}>
                                                                    {status.name}
                                                                    <div>
                                                                        {statusAdded ?
                                                                            <i className="material-icons">done</i> : ""}

                                                                    </div>
                                                                </button>
                                                                <div className="board-action">
                                                                    <a onClick={() => this.editStatuses(status)}

                                                                    ><i style={{
                                                                        backgroundColor: status.color|| '#999999',
                                                                        color: 'white'
                                                                    }}
                                                                        className="material-icons">edit</i></a>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                            </div>
                                            </div>
                                        )
                                    }
                                </div>
                            )
                        }


                    </div>
                </Overlay>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        statuses: state.infoStudent.statuses,
        isLoadingStatuses: state.infoStudent.isLoadingStatuses,
        isLoadedStatuses: state.infoStudent.isLoadedStatuses,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        studentActions: bindActionCreators(studentActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(StatusesOverlay);
