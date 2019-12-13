import React from 'react';
import FormInputText from "../../../components/common/FormInputText";
import Loading from "../../../components/common/Loading";
import {getAllStaffs} from "../../manageStaff/staffApi";
import {Overlay} from "react-bootstrap";
import * as ReactDOM from "react-dom";
import Search from "../../../components/common/Search";

class PicOverlay extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.initState = {
            show: false,
            create: false,
            staffs:[],
            isLoading: true,
            isProcessing: false,
            isDeleting: false,
            search: ''
        };
        this.state = this.initState;
    }

    componentWillMount() {
        this.getAllStaffs();
    }

    getAllStaffs = () => {
        getAllStaffs().then((res) => {
            if (this.refs.PicOverlay)
                this.setState({
                staffs: res.data.data.staffs,
                isLoading: false
            });
        });
    };

  


    toggle = () => {
        this.setState({
            create: !this.state.create
        });
    };


    assignStaff = () => {
        // this.setState({
        //     isProcessing: true
        // });
        // assignStaff(staff, this.props.student)
        //     .then(() => {
        //         this.getAllStaffs();
        //         let {updateInfoStudent, student} = this.props;
        //         updateInfoStudent({...student, staff_id: staff.id});
        //         this.setState({
        //             isProcessing: false
        //         });
        //     });
    };

    close = () => {
        this.setState({show: false});
    };


    staffName = () => {
        let s = this.state.staffs && this.state.staffs.filter(i => i.id == this.props.student.staff_id)[0];
        return s ? s.name : "Chưa có";
    };

    render() {
        let {isDeleting, isLoading, isProcessing} = this.state;
        let showLoading = isLoading || isProcessing;
        const current = (this.props.student  && this.state.staffs && this.state.staffs.filter(s=>s.id == this.props.student.staff_id)[0]) || {};

        return (
            <div style={{position: "relative",backgroundColor: current.color}} className="source-value" ref="PicOverlay">
                <div onClick={() => this.setState({show: true})}>
                    {this.staffName()}
                </div>
                <Overlay
                    rootClose={true}
                    show={this.state.show}
                    onHide={this.close}
                    placement="bottom"
                    container={this}
                    target={() => ReactDOM.findDOMNode(this.refs.target)}>
                    <div className="kt-overlay" style={{width: "300px", marginTop: 25}}>
                        {!showLoading && <div style={{position: "relative"}}>
                            <button
                                onClick={this.close}
                                type="button" className="close"
                                style={{color: '#5a5a5a', fontSize: 20}}>
                                <span aria-hidden="true">×</span>
                                <span className="sr-only">Close</span>
                            </button>
                            <div style={{textAlign: "center", fontSize: 16, color: 'black', marginBottom: 15}}>
                                P.I.C
                            </div>
                        </div>}
                        <div>{showLoading && <Loading/>}</div>
                        {!this.state.create && !showLoading && <div>
                            <Search
                                placeholder="Tìm theo tên"
                                value={this.state.search}
                                onChange={search => this.setState({search})}
                            />
                        </div>}
                        {
                            this.state.create && !isProcessing ? (
                                <div>
                                    <FormInputText
                                        label="Tên nguồn"
                                        placeholder="Tên nguồn"
                                        name="name"
                                        updateFormData={this.updateFormData}
                                        value={this.state.staff.name || ""}/>
                                    <div style={{paddingLeft: "15px", marginTop: "20px"}}>
                                        <CirclePicker
                                            width="100%"
                                            color={this.state.staff.color}
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
                                                                onClick={() => this.deleteStaff(this.state.staff)}>
                                                            Xác nhận
                                                        </button>
                                                    </div>
                                                )}
                                            </div>

                                        ) : (
                                            <div style={{display: "flex"}}>

                                                {/*{this.state.staff.id &&*/}
                                                {/*    <button style={{margin: "15px 0 10px 5px"}}*/}
                                                {/*            className="btn btn-white width-50-percent"*/}
                                                {/*            onClick={this.toggleDelete}>*/}
                                                {/*        Xoá*/}
                                                {/*    </button>*/}
                                                {/*}*/}
                                                <button style={{margin: "15px 5px 10px 0"}}
                                                        className="btn btn-success width-50-percent"
                                                        onClick={this.saveStaff}>
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
                                                <button
                                                    onClick={() => {
                                                        this.assignStaff({id: null});
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
                                                        justifyContent: "space-between"
                                                    }}>
                                                    Không có nhân viên
                                                    <div>
                                                        {!this.props.student.staff_id ?
                                                            <i className="material-icons">done</i> : ""}
                                                    </div>
                                                </button>


                                                {this.state.staffs && this.state.staffs
                                                    .filter(staff => {
                                                        const s1 = staff.name.trim().toLowerCase();
                                                        const s2 = this.state.search.trim().toLowerCase();
                                                        return s1.includes(s2) || s2.includes(s1);
                                                    })
                                                    .map((staff) => {
                                                        const staffAdded = this.props.student && this.props.student.staff_id == staff.id;
                                                        return (
                                                            <div key={staff.id} style={{
                                                                marginBottom:10,
                                                                display: "flex",
                                                                justifyContent: 'space-between'
                                                            }}>
                                                                <button
                                                                    onClick={() => {
                                                                        this.assignStaff(staff);
                                                                    }}
                                                                    className="btn"
                                                                    style={{
                                                                        textAlign: "left",
                                                                        backgroundColor: `#${staff.color}`,
                                                                        width: "100%",
                                                                        margin: "0",
                                                                        display: "flex",
                                                                        justifyContent: "space-between",
                                                                        height:35,
                                                                        padding: '0 15px',
                                                                    }}>
                                                                    {staff.name}
                                                                    <div>
                                                                        {staffAdded ?
                                                                            <i className="material-icons">done</i> : ""}

                                                                    </div>
                                                                </button>

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

export default PicOverlay;