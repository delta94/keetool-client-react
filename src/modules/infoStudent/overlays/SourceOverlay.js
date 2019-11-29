import React from 'react';
import FormInputText from "../../../components/common/FormInputText";
import Loading from "../../../components/common/Loading";
import {loadSources, deleteSource, createSource,assignSource} from "../studentApi";
import {Overlay} from "react-bootstrap";
import * as ReactDOM from "react-dom";
import {isEmptyInput, showErrorNotification} from "../../../helpers/helper";


class SourceOverlay extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.initState = {
            show: false,
            create: false,
            source: {},
            isLoading: false,
            isProcessing: false,
            isDeleting: false
        };
        this.state = this.initState;
    }

    componentDidMount() {
        this.loadSources();
    }

    loadSources = () => {
        this.setState({source: {}, create: false, isLoading: true, isDeleting: false});
        loadSources().then((res) => {
            this.setState({
                sources: res.data.sources,
                isLoading: false
            });

        });
    };

    deleteSource = (source) => {
        this.setState({
            isProcessing: true
        });
        deleteSource(source)
            .then(() => {
                this.loadSources();
            }).catch(()=>{
                showErrorNotification("Nguồn đang sử dụng không thể xóa!");
        }).finally(()=>{
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

    editSource = (source) => {
        this.setState({
            source,
            create: true
        });
    };

    updateFormData = (event) => {
        this.setState({
            source: {
                ...this.state.source,
                name: event.target.value
            }
        });
    };


    toggle = () => {
        this.setState({
            create: !this.state.create
        });
    };

    saveSource = () => {
        if (isEmptyInput(this.state.source.name)) {
            showErrorNotification("Bạn cần nhập tên nguồn");
        } else if (this.state.source.name.length > 20) {
            showErrorNotification("Độ dài tên nguồn không quá 20 kí tự");
        } else {
            this.setState({
                isLoading: true,
                create: false
            });
            createSource(this.state.source)
                .then(() => {
                    this.setState({
                        source: {},
                        create: false
                    });
                    this.loadSources();
                });


        }
    };

    assignSource = (source) => {
        this.setState({
            isProcessing: true
        });
        assignSource(source,this.props.student)
            .then(() => {
                this.loadSources();
                let {updateInfoStudent, student} = this.props;
                updateInfoStudent({...student, source_id:source.id });
                this.setState({
                    isProcessing: false
                });
            });
    };

    close = () => {
        this.setState(this.initState);
    };

    render() {
        let {isDeleting,isLoading, isProcessing} = this.state;
        let showLoading =  isLoading ||isProcessing;
        return (
            <div style={{position: "relative"}} className="source-value">
                <div className=""
                     onClick={() => this.setState({show: true})}>
                    N/A
                </div>
                <Overlay
                    rootClose={true}
                    show={this.state.show}
                    onHide={this.close}
                    placement="bottom"
                    container={this}
                    target={() => ReactDOM.findDOMNode(this.refs.target)}>
                    <div className="kt-overlay" style={{width: "300px", marginTop: 25}}>
                        <button
                            onClick={this.close}
                            type="button" className="close"
                            style={{color: '#5a5a5a'}}>
                            <span aria-hidden="true">×</span>
                            <span className="sr-only">Close</span>
                        </button>

                        {!showLoading && <div style={{position: "relative"}}>
                            {
                                this.state.create ? (
                                    <a className="text-rose" style={{position: "absolute", left: "0px", top: "2px"}}
                                       onClick={this.toggle}>
                                        <i className="material-icons">keyboard_arrow_left</i>
                                    </a>
                                ) : (
                                    <a className="text-rose" style={{position: "absolute", left: "0px", top: "2px"}}
                                       onClick={()=>this.setState({
                                           create: !this.state.create,
                                           source:{}
                                       })}>
                                        <i className="material-icons">add</i>
                                    </a>
                                )
                            }

                            <div style={{textAlign: "center", fontSize: 16, color: 'black', marginBottom: 15}}>Nguồn
                            </div>
                        </div>}
                        <div>{showLoading && <Loading/>}</div>
                        {
                            this.state.create && !isProcessing ? (
                                <div>
                                    <FormInputText
                                        placeholder="Tên nguồn"
                                        name="name"
                                        updateFormData={this.updateFormData}
                                        value={this.state.source.name || ""}/>
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
                                                                onClick={() => this.deleteSource(this.state.source)}>
                                                            Xác nhận
                                                        </button>
                                                    </div>
                                                )}
                                            </div>

                                        ) : (
                                            <div style={{display: "flex"}}>

                                                {this.state.source.id &&
                                                    <button style={{margin: "15px 0 10px 5px"}}
                                                            className="btn btn-white width-50-percent"
                                                            onClick={this.toggleDelete}>
                                                        Xoá
                                                    </button>
                                                }
                                                <button style={{margin: "15px 5px 10px 0"}}
                                                        className="btn btn-success width-50-percent"
                                                        onClick={this.saveSource}>
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
                                                {this.state.sources && this.state.sources.map((source) => {
                                                    const sourceAdded = this.props.student && this.props.student.source_id == source.id;
                                                    return (
                                                        <div key={source.id} style={{display: "flex"}}>
                                                            <button
                                                                onClick={() => {
                                                                    this.assignSource(source);
                                                                }}
                                                                className="btn"
                                                                style={{
                                                                    textAlign: "left",
                                                                    backgroundColor: sourceAdded ? '#629eec' : '',
                                                                    width: "calc(100% - 30px)",
                                                                    margin: "2px 0",
                                                                    display: "flex",
                                                                    justifyContent: "space-between"
                                                                }}>
                                                                {source.name}
                                                                <div>
                                                                    {/*{sourceAdded ? <i className="material-icons">done</i> : ""}*/}
                                                                </div>
                                                            </button>
                                                            <div className="board-action" style={{lineHeight: "45px"}}>
                                                                <a onClick={() => this.editSource(source)}><i
                                                                    className="material-icons">edit</i></a>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
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

export default SourceOverlay;