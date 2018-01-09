/* eslint-disable no-undef */
import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as jobAssignmentAction from '../jobAssignment/jobAssignmentAction';
import  CardWork from '../jobAssignment/CardWork';
import * as PropTypes from "prop-types";
import Loading from "../../components/common/Loading";
import * as helper from "../../helpers/helper";
import WorkInfoModal from './WorkInfoModal';
import {Link} from "react-router";
import Select from 'react-select';
import ItemReactSelect from "../../components/common/ItemReactSelect";
import ReactSelect from 'react-select';
import {STATUS_WORK} from "../../constants/constants";

const workTypes=[
    {value: 'all', label: 'Tất cả',},
    {value: 'personal', label: 'Cá nhân',},
    {value: 'team', label: 'Nhóm',},
    {value: 'person_project', label: 'Dự án riêng',},
];

class JobAssignmentContainer extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.deleteWork =this.deleteWork.bind(this);
        this.changeWorkStatus =this.changeWorkStatus.bind(this);
        this.openInfoModal =this.openInfoModal.bind(this);
        this.closeInfoModal =this.closeInfoModal.bind(this);
        this.acceptWork =this.acceptWork.bind(this);
        this.doneWork =this.doneWork.bind(this);
        this.revertWork =this.revertWork.bind(this);
        this.onWorkTypeChange =this.onWorkTypeChange.bind(this);
        this.state = {
            showInfoModal: false,
            modalType: STATUS_WORK[0],
            work: {
                staffs:[],
            },
            staffFilter: "",
            typeFilter: "all",
        }
    }

    componentWillMount() {
        this.props.jobAssignmentAction.loadWorks();
        this.props.jobAssignmentAction.loadStaffs();
    }

    // componentWillReceiveProps(nextProps) {
    //     console.log('l',nextProps);
    // }

    deleteWork(id){
        helper.confirm('error', 'Xóa', "Bạn có muốn xóa công việc này không?", () => {
            this.props.jobAssignmentAction.deleteWork(id, ()=>{
                return this.props.jobAssignmentAction.loadWorks();
            });
        });
    }

    changeWorkStatus(work, stt){
        helper.confirm('error', 'Hủy', "Bạn có muốn hủy công việc này không?", () => {
            this.props.jobAssignmentAction.editWork(work, stt, ()=>{
                return this.props.jobAssignmentAction.loadWorks();
            });
        });
    }

    openInfoModal(work, status){
        this.setState({showInfoModal: true, work:work, modalType : status });
    }

    closeInfoModal(){
        this.setState({showInfoModal: false});
    }

    acceptWork(workId, staffId){
        this.props.jobAssignmentAction.changeStatusWork(workId,staffId, STATUS_WORK[1].value, ()=>{
            helper.showNotification("Đã chấp nhận công việc.");
            return this.props.jobAssignmentAction.loadWorks();
        });
    }

    doneWork(workId, staffId){
        this.props.jobAssignmentAction.changeStatusWork(workId,staffId, STATUS_WORK[2].value, ()=>{
            helper.showNotification("Đã hoàn thành công việc.");
            return this.props.jobAssignmentAction.loadWorks();
        });
    }

    revertWork(work){
        this.props.jobAssignmentAction.editWork(work, "doing", this.props.jobAssignmentAction.loadWorks);
    }

    onWorkTypeChange(obj){
        console.log(obj);
        this.setState({typeFilter: obj.value});
    }

    render() {
        let pending = [], doing = [], done = [], cancel = [];
        let {works} = this.props;
        let {typeFilter} =this.state;
        works = works.filter(obj => typeFilter == "all"  ? true : (obj.type == typeFilter));
        works.forEach((obj)=>{
            switch (obj.status){
                case STATUS_WORK[0].value:{
                    pending = [...pending, obj];
                    break;
                }
                case STATUS_WORK[1].value:{
                    doing = [...doing, obj];
                    break;
                }
                case STATUS_WORK[2].value:{
                    done = [...done, obj];
                    break;
                }
                case STATUS_WORK[3].value:{
                    cancel = [...cancel, obj];
                    break;
                }
            }
        });
        return (
            <div>
                <WorkInfoModal
                    show={this.state.showInfoModal}
                    onHide={this.closeInfoModal}
                    data={this.state.work}
                    modalType={this.state.modalType}
                />
                <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between", paddingLeft: "5px",}}>
                    <div className="filter-container" style={{alignItems:"center"}}>
                        <div className="select-container">
                            <Select
                                name="form-field-name"
                                value={"Lọc theo nhân viên"}
                                options={this.props.staffs}
                                onChange={()=>{}}
                                optionRenderer={(option) => {
                                    return (
                                        <ItemReactSelect label={option.label} url={helper.validateLinkImage(option.avatar_url)}/>
                                    );
                                }}
                                valueRenderer={(option) => {
                                    return (
                                        <ItemReactSelect label={option.label} url={helper.validateLinkImage(option.avatar_url)}/>
                                    );
                                }}
                                placeholder="Chọn nhân viên"
                                disabled={this.props.isLoading}
                                style={{minWidth: 200, maxWidth: 400}}
                            />
                        </div>
                        <div className="select-container">
                            <ReactSelect
                                disabled={this.props.isLoading}
                                options={workTypes}
                                onChange={this.onWorkTypeChange}
                                value={this.state.typeFilter}
                                defaultMessage="Tuỳ chọn"
                                name="type"
                                style={{minWidth: 150, maxWidth: 300}}
                            />
                        </div>

                    </div>
                    <div className="filter-item">
                        <Link to="hr/job-assignment/create" className="btn btn-rose">
                            <i className="material-icons keetool-card">add</i>
                            Thêm công việc
                        </Link>
                    </div>
                </div>
                <div className="board-canvas">

                    <div className="board-container">
                    {/*1*/}
                        <div  data-order="0" className="card card-container keetool-board">
                            <div className="board-title undraggable">
                                <span style={{fontWeight: 600}}>Đợi chấp nhận</span>
                                <div className="board-action">

                                    <div className="dropdown">
                                        <a className="dropdown-toggle btn-more-dropdown" type="button"
                                           data-toggle="dropdown">
                                            <i className="material-icons">more_horiz</i>
                                        </a>
                                        <ul className="dropdown-menu dropdown-menu-right">
                                            <li className="more-dropdown-item">
                                                <a onClick={() => {}}>
                                                    <i className="material-icons">edit</i>
                                                    1
                                                </a>
                                            </li>
                                            <li className="more-dropdown-item">
                                                <a onClick={() => {}}>
                                                    <i className="material-icons">add</i>
                                                    2
                                                </a>
                                            </li>
                                            <li className="more-dropdown-item">
                                                <a onClick={() => {}}>
                                                    <i className="material-icons">archive</i>
                                                    3
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div className="board">
                                {this.props.isLoading ?
                                    <Loading/>
                                    :
                                    pending.map((work)=>{
                                        return (
                                            <CardWork
                                                work={work}
                                                delete={this.deleteWork}
                                                change={this.changeWorkStatus}
                                                status="pending"
                                                openModal={()=>{return this.openInfoModal(work, STATUS_WORK[0].value);}}
                                                user={this.props.user}
                                                acceptWork={this.acceptWork}
                                            />
                                        );
                                    })
                                }
                            </div>
                        </div>
                    {/*1*/}
                    {/*2*/}
                        <div  data-order="1" className="card card-container keetool-board">
                            <div className="board-title undraggable">
                                <span style={{fontWeight: 600}}>Đang làm</span>
                                <div className="board-action">

                                    <div className="dropdown">
                                        <a className="dropdown-toggle btn-more-dropdown" type="button"
                                           data-toggle="dropdown">
                                            <i className="material-icons">more_horiz</i>
                                        </a>
                                        <ul className="dropdown-menu dropdown-menu-right">
                                            <li className="more-dropdown-item">
                                                <a onClick={() => {}}>
                                                    <i className="material-icons">edit</i>
                                                    1
                                                </a>
                                            </li>
                                            <li className="more-dropdown-item">
                                                <a onClick={() => {}}>
                                                    <i className="material-icons">add</i>
                                                    2
                                                </a>
                                            </li>
                                            <li className="more-dropdown-item">
                                                <a onClick={() => {}}>
                                                    <i className="material-icons">archive</i>
                                                    3
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className="board">
                                {this.props.isLoading ?
                                    <Loading/>
                                    :
                                    doing.map((work)=>{
                                        return (
                                            <CardWork
                                                work={work}
                                                delete={this.deleteWork}
                                                status="doing"
                                                openModal={()=>{return this.openInfoModal(work, STATUS_WORK[1].value);}}
                                                user={this.props.user}
                                                doneWork={this.doneWork}
                                            />
                                        );
                                    })
                                }

                            </div>
                        </div>
                    {/*2*/}
                    {/*3*/}

                        <div  data-order="2" className="card card-container keetool-board">

                            <div className="board-title undraggable">
                                <span style={{fontWeight: 600}}>Hoàn thành</span>
                                <div className="board-action">
                                    <div className="dropdown">
                                        <a className="dropdown-toggle btn-more-dropdown" type="button"
                                           data-toggle="dropdown">
                                            <i className="material-icons">more_horiz</i>
                                        </a>
                                        <ul className="dropdown-menu dropdown-menu-right">
                                            <li className="more-dropdown-item">
                                                <a onClick={() => {}}>
                                                    <i className="material-icons">edit</i>
                                                    1
                                                </a>
                                            </li>
                                            <li className="more-dropdown-item">
                                                <a onClick={() => {}}>
                                                    <i className="material-icons">add</i>
                                                    2
                                                </a>
                                            </li>
                                            <li className="more-dropdown-item">
                                                <a onClick={() => {}}>
                                                    <i className="material-icons">archive</i>
                                                    3
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className="board">
                                {this.props.isLoading ?
                                    <Loading/>
                                    :
                                    done.map((work)=>{
                                        return (
                                            <CardWork
                                                work={work}
                                                delete={this.deleteWork}
                                                status="done"
                                                openModal={()=>{return this.openInfoModal(work, STATUS_WORK[2].value);}}
                                                user={this.props.user}
                                                revertWork={this.revertWork}
                                            />
                                        );
                                    })
                                }

                            </div>
                        </div>
                    {/*3*/}
                    {/*4*/}

                        <div  data-order="3" className="card card-container keetool-board">

                            <div className="board-title undraggable">
                                <span style={{fontWeight: 600}}>Hủy</span>
                                <div className="board-action">

                                    <div className="dropdown">
                                        <a className="dropdown-toggle btn-more-dropdown" type="button"
                                           data-toggle="dropdown">
                                            <i className="material-icons">more_horiz</i>
                                        </a>
                                        <ul className="dropdown-menu dropdown-menu-right">
                                            <li className="more-dropdown-item">
                                                <a onClick={() => {}}>
                                                    <i className="material-icons">edit</i>
                                                    1
                                                </a>
                                            </li>
                                            <li className="more-dropdown-item">
                                                <a onClick={() => {}}>
                                                    <i className="material-icons">add</i>
                                                    2
                                                </a>
                                            </li>
                                            <li className="more-dropdown-item">
                                                <a onClick={() => {}}>
                                                    <i className="material-icons">archive</i>
                                                    3
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className="board">
                                {this.props.isLoading ?
                                    <Loading/>
                                    :
                                    cancel.map((work)=>{
                                        return (
                                            <CardWork
                                                work={work}
                                                delete={this.deleteWork}
                                                status="cancel"
                                                openModal={()=>{return this.openInfoModal(work, STATUS_WORK[3].value);}}
                                                user={this.props.user}
                                            />
                                        );
                                    })
                                }

                            </div>
                        </div>

                    {/*4*/}
                    </div>
                </div>
            </div>
        );
    }
}

JobAssignmentContainer.propTypes = {
    isLoading: PropTypes.bool.isRequired,
    works: PropTypes.array.isRequired,
    user: PropTypes.object.isRequired,
    jobAssignmentAction: PropTypes.object.isRequired,
    staffs: PropTypes.array,
};

function mapStateToProps(state) {
   return {
       isLoading : state.jobAssignment.isLoading,
       works : state.jobAssignment.works,
       user: state.login.user,
       staffs : state.jobAssignment.staffs,
   };
}

function mapDispatchToProps(dispatch) {
    return {
        jobAssignmentAction: bindActionCreators(jobAssignmentAction, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(JobAssignmentContainer);