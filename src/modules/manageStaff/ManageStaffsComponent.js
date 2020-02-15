import React from 'react';
import {Link} from 'react-router';
import Loading from '../../components/common/Loading';
import Search from '../../components/common/Search';
import ListStaff from './ListStaff';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {Modal} from 'react-bootstrap';
import AddUserToStaff from './AddUserToStaff';
import HRTab from "../manageDepartment/HRTab";
import TooltipButton from '../../components/common/TooltipButton';
import {
    appendJsonToWorkBook,
    confirm,
    newWorkBook,
    renderExcelColumnArray,
    saveWorkBookToExcel, showErrorNotification,
} from "../../helpers/helper";

class ManageStaffsComponent extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            showModalAddUserToStaff: false,
            showLoadingModal: false,
        };
        this.closeModalAddUserToStaff = this.closeModalAddUserToStaff.bind(this);
        this.openModalAddUserToStaff = this.openModalAddUserToStaff.bind(this);
    }

    closeModalAddUserToStaff() {
        this.setState({showModalAddUserToStaff: false});
    }

    openModalAddUserToStaff() {
        this.setState({showModalAddUserToStaff: true});
    }

    openLoadingModal = () => {
        this.setState({showLoadingModal: true});
        this.props.getAllStaffs(this.props.search, this.exportExcel);
    };

    exportExcel = (input) => {
        let wb = newWorkBook();
        let data;
        let cols = renderExcelColumnArray([5, 25, 25, 15, 12, 15, 10, 15]);//độ rộng cột

        data = input.reverse().map((item, index) => {

            /* eslint-disable */

            let res = {
                'STT': index + 1,
                'Tên': item.name,
                'Email': item.email,
                'Ngày tham gia': item.start_company,
                'SĐT': item.phone,
                'Ngày sinh': item.dob || "Không có",
                'Tuổi': item.age || "Không có",
                'Giới tính': item.gender == 1 ? "Nam" : "Nữ",
            };
            /* eslint-enable */
            return res;
        });
        appendJsonToWorkBook(data, wb, 'Danh sách nhân viên', cols);
        //end điểm danh

        //xuất file
        saveWorkBookToExcel(wb, 'Danh sách nhân viên');

        this.setState({showLoadingModal: false});
    };
    setAdmin = (staff)=>{
        if(this.props.user.role != 2) {
            showErrorNotification("Chỉ admin mới có thể phân quyền!");
            return ;
        }
        if(staff.id == this.props.user.id){
            showErrorNotification("Bạn không thể phân quyền cho bản thân!");
            return;
        }
        let message = (staff && staff.role == 2 ? "Bạn có chắc chắn muốn xóa quyền admin của " : "Bạn có chắc chắn muốn phân quyền admin cho ") + `<br><b>${staff.name}</b>`;
        confirm("warning", "Phân quyền admin", message,
            () => {
                this.props.staffActions.setAdmin(staff.id,()=>{
                    this.props.loadStaffs(this.props.currentPage);
                });
            });


    }
    render() {
        return (
            <div>
                <Modal
                    show={this.state.showLoadingModal}
                    onHide={() => {
                    }}>
                    <Modal.Header><h3>{"Đang xuất file..."}</h3></Modal.Header>
                    <Modal.Body><Loading/></Modal.Body>
                </Modal>
                <div className="col-lg-12">
                    <HRTab path="manage/quan-li-nhan-su"/>
                </div>
                <div className="col-lg-12">
                    <div className="card" mask="purple">
                        <img className="img-absolute"/>
                        <div className="card-content">
                            <div className="tab-content">
                                <div style={{display: "flex", flexDirection: 'row', justifyContent: 'space-between'}}>
                                    <div className="flex-row flex">
                                        <h5 className="card-title">
                                            <strong>Danh sách nhân viên</strong>
                                        </h5>
                                    </div>

                                </div>
                                <div className="flex-row flex flex-wrap" style={{marginTop: '8%'}}>

                                    <Search
                                        onChange={this.props.staffsSearchChange}
                                        value={this.props.search}
                                        placeholder="Tìm kiếm nhân viên"
                                        className="round-white-seacrh"

                                    />
                                    {this.props.user.role == 2 && <div className="dropdown">
                                        <TooltipButton text="Thêm nhân viên" placement="top">
                                            <button className="btn btn-white btn-round margin-right-10"
                                                    type="button" data-toggle="dropdown">
                                                Thêm nhân viên
                                            </button>
                                        </TooltipButton>
                                        <ul className="dropdown-menu dropdown-primary">
                                            <li>
                                                <Link to="/hr/add-staff">Tạo nhân viên</Link>
                                            </li>
                                            <li>
                                                <a onClick={() => this.openModalAddUserToStaff()}>Thêm từ người
                                                    dùng</a>
                                            </li>
                                        </ul>
                                    </div>}
                                    <TooltipButton text="Xuất thành file excel" placement="top">
                                        <button
                                            className="btn btn-white btn-round margin-right-10"
                                            onClick={this.openLoadingModal}
                                        ><i className="material-icons"
                                               style={{height: 5, width: 5, marginLeft: -11, marginTop: -10}}
                                            >file_download</i>
                                        </button>
                                    </TooltipButton>
                                </div>

                            </div>
                        </div>
                    </div>
                    <div className="row">
                        {this.props.isLoadingStaffs ? <Loading/> : (
                            <ListStaff
                                staffs={this.props.staffListData}
                                roles={this.props.roleListData}
                                bases={this.props.baseListData}
                                departments={this.props.departments}
                                changeRoleStaff={this.props.changeRoleStaff}
                                changeBaseStaff={this.props.changeBaseStaff}
                                changeDepartmentStaff={this.props.changeDepartmentStaff}
                                deleteStaff={this.props.deleteStaff}
                                setAdmin={this.setAdmin}
                                disableActions={this.props.user.role != 2}
                                titleList="Danh sách nhân viên"
                            />
                        )
                        }
                    </div>
                    <ul className="pagination pagination-primary" style={{float: "right"}}>
                        {_.range(1, this.props.totalPages + 1).map(page => {
                            if (Number(this.props.currentPage) === page) {
                                return (
                                    <li key={page}>
                                        <a style={{color: "white"}} className="btn-rose"
                                           onClick={() => this.props.loadStaffs(page)}>{page}</a>
                                    </li>
                                );
                            } else {
                                return (
                                    <li key={page}>
                                        <a onClick={() => this.props.loadStaffs(page)}>{page}</a>
                                    </li>
                                );
                            }

                        })}
                    </ul>
                </div>
                <Modal show={this.state.showModalAddUserToStaff} bsSize="large" onHide={this.closeModalAddUserToStaff}>
                    <Modal.Header closeButton>
                        <Modal.Title>Thêm nhân viên từ người dùng</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {
                            this.state.showModalAddUserToStaff && <AddUserToStaff/>
                        }
                    </Modal.Body>
                </Modal>
            </div>
        );
    }
}

ManageStaffsComponent.propTypes = {
    isLoadingStaffs: PropTypes.bool.isRequired,
    baseListData: PropTypes.array.isRequired,
    roleListData: PropTypes.array.isRequired,
    departments: PropTypes.array.isRequired,
    staffListData: PropTypes.array.isRequired,
    changeRoleStaff: PropTypes.func.isRequired,
    changeBaseStaff: PropTypes.func.isRequired,
    changeDepartmentStaff: PropTypes.func.isRequired,
    staffsSearchChange: PropTypes.func.isRequired,
    getAllStaffs: PropTypes.func.isRequired,
    loadStaffs: PropTypes.func.isRequired,
    deleteStaff: PropTypes.func.isRequired,
    search: PropTypes.string.isRequired,
    totalPages: PropTypes.number.isRequired,
    currentPage: PropTypes.number.isRequired,
    user: PropTypes.object.isRequired,

};

export default ManageStaffsComponent;
