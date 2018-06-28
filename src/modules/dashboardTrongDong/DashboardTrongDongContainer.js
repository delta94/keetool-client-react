import React, {Component} from "react";
import {observer} from "mobx-react";
import {connect} from "react-redux";
import store from "./dashboardStore";
import Loading from "../../components/common/Loading";
import Select from "../../components/common/Select";
import Calendar from "../../components/common/Calendar";
import moment from "moment";
import {
    DATETIME_FORMAT_SQL,
    DATETIME_FORMAT,
    STATUS_REGISTER_ROOM
} from "../../constants/constants";
import {
    convertTimeToSecond, saveWorkBookToExcel,
    setFormValidation,
    showTypeNotification
} from "../../helpers/helper";
import {observable} from "mobx";
import ReactSelect from "react-select";
import PropTypes from "prop-types";
import FormInputText from "../../components/common/FormInputText";
import Button from "../../components/common/Button";
import FormInputDateTime from "../../components/common/FormInputDateTime";
import Checkbox from "../../components/common/Checkbox";
import {loadDashboard, loadRegisters, loadUsers} from "./dashboardApi";
import {OverlayTrigger, Modal, Tooltip} from "react-bootstrap";
import {loadAllRegistersApi} from "../registerManage/registerManageApi";
import XLSX from "xlsx";



let self;

@observer
class DashboardTrongDongContainer extends Component {
    constructor(props) {
        super(props);
        this.onChangeBase = this.onChangeBase.bind(this);
        this.onChangeRoom = this.onChangeRoom.bind(this);
        this.onChangeRoomType = this.onChangeRoomType.bind(this);
        this.updateTime = this.updateTime.bind(this);
        this.onChangeStatus = this.onChangeStatus.bind(this);
        this.openModalBooking = this.openModalBooking.bind(this);
        this.exportResultExcel = this.exportResultExcel.bind(this);
        self = this;
    }

    componentWillMount() {
        store.selectedBaseId = this.props.user.base_id;
        store.loadBases();
        store.loadRooms();
        store.loadRoomTypes();
        store.loadDashboard();
        store.loadCampaigns();
    }

    @observable showModalChangeStatus = false;
    @observable showModalBooking = false;
    @observable booking = {};
    @observable registerRoomSelected = {};
    @observable disableCreateRegister = false;
    @observable selectedUser = {};

    onChangeRoom(value) {
        store.selectedRoomId = value;
        store.loadDashboard();
    }

    onChangeBase(value) {
        store.selectedBaseId = value;
        store.loadDashboard();
    }

    onChangeRoomType(value) {
        store.selectedRoomTypeId = value;
        store.loadDashboard();
    }

    onChangeStatus(value) {
        this.registerRoomSelected.status = value.value;
        store.changeStatus(
            this.registerRoomSelected.id,
            this.registerRoomSelected.status
        );
    }

    updateTime(value) {
        store.changeTime(
            value.register_id,
            value.start.format(DATETIME_FORMAT_SQL),
            value.end.format(DATETIME_FORMAT_SQL)
        );
    }

    openModalBooking(day, room, register) {
        self.showModalBooking = true;
        self.selectedUser = {};
        if (register) {
            self.booking = {
                email: register.register_data.user.email,
                name: register.register_data.user.name,
                phone: register.register_data.user.phone,
                address: register.register_data.user.address,
                id: register.register_room_id,
                register_id: register.register_id,
                campaign_id: register.register_data.campaign_id,
                room: room,
                base_id: room && room.base ? room.base.id : "",
                room_id: room ? room.id : "",
                type: register.type,
                start_time: register.start.format(DATETIME_FORMAT),
                end_time: register.end.format(DATETIME_FORMAT),
                status: register.status,
                note: register.register_data.note,
                similar_room: register.register_data.similar_room
            };
        } else {
            self.booking = {
                room: room,
                base_id: room && room.base ? room.base.id : "",
                room_id: room ? room.id : "",
                start_time: day.add("9", "hours").format(DATETIME_FORMAT),
                end_time: day.add("5", "hours").format(DATETIME_FORMAT),
                status: "seed",
                similar_room: room ? [room.id] : []
            };
        }
    }

    updateFormData = event => {
        const value = event.target.value;
        let booking = {...this.booking};
        const field = event.target.name;
        booking[field] = value;
        this.booking = booking;
    };

    createBookRoom = () => {
        setFormValidation("#form-book-room");
        if ($("#form-book-room").valid()) {
            const start_time = moment(
                this.booking.start_time,
                DATETIME_FORMAT
            ).format("X");
            const end_time = moment(this.booking.end_time, DATETIME_FORMAT).format(
                "X"
            );
            if (start_time >= end_time) {
                showTypeNotification(
                    "Thời gian bắt đầu phải nhỏ hơn thời gian kết thúc",
                    "warning"
                );
                return;
            }
            store.createRegister(this.booking, this.closeModalBooking);
        }
    };

    closeModalBooking = () => {
        this.showModalBooking = false;
    };

    colorBook(status) {
        switch (status) {
            case "seed":
                return "#9b9b9b";
            case "view":
                return "#ffaa00";
            case "cancel":
                return "#ff4444";
            case "done":
                return "#4caa00";
            default:
                return "#9b9b9b";
        }
    }

    changeSimilarRoom = (event, room) => {
        if (event.target.checked) {
            this.booking.similar_room = [...this.booking.similar_room, room.id];
        } else {
            this.booking.similar_room = this.booking.similar_room.filter(
                roomItem => roomItem != room.id
            );
        }
    };

    async exportResultExcel() {
        // this.props.registerManageAction.showGlobalLoading();
        const res = await loadRegisters({base_id: store.selectedBaseId});
        // console.log(res.data.data, "qqqqqqqqqqqqqq");
        // this.props.registerManageAction.hideGlobalLoading();
        const wsData = res.data.data;
        const field = [];
        field[0] = "Tên";
        field[1] = "Email";
        field[2] = "Số điện thoại";
        field[3] = "Ngày đăng kí";
        field[4] = "Saler";
        field[5] = "Chiến dịch";
        field[6] = "Gói thành viên";
        const datas = wsData.map(data => {
            let tmp = [];
            tmp[0] = data.user.name;
            tmp[1] = data.user.email || "Chưa có";
            tmp[2] = data.user.phone || "Chưa có";
            tmp[3] = data.created_at || "Chưa có";
            tmp[4] = (data.saler && data.saler.name) || "Không có";
            tmp[5] = (data.campaign && data.campaign.name) || "Không có";
            tmp[6] = data.subscription && data.subscription.user_pack_name;
            return tmp;
        });
        const tmpWsData = [field, ...datas];
        const ws = XLSX.utils.aoa_to_sheet(tmpWsData);
        const sheetName = "Danh sách đăng kí đặt chỗ";
        let workbook = {
            SheetNames: [],
            Sheets: {},
        };
        workbook.SheetNames.push(sheetName);
        workbook.Sheets[sheetName] = ws;
        saveWorkBookToExcel(workbook, "Danh sách đăng kí đặt chỗ");
    }

    loadUsers = (input, callback) => {
        if (this.timeOut !== null) {
            clearTimeout(this.timeOut);
        }
        this.timeOut = setTimeout(
            function () {
                loadUsers(input).then(res => {
                    let users = res.data.data.users.map(user => {
                        return {
                            ...user,
                            ...{
                                value: user.id,
                                label: user.name + ` (${user.phone})`
                            }
                        };
                    });
                    callback(null, {options: users, complete: true});
                });
            }.bind(this),
            500
        );
    };

    renderCalendar(registers, disableCreateRegister, room) {
        let registersData = registers.map(register => {
            let startTime = moment(register.start_time, DATETIME_FORMAT_SQL);
            let endTime = moment(register.end_time, DATETIME_FORMAT_SQL);
            let startSecond = convertTimeToSecond(startTime.format("HH:mm"));
            let endSecond = convertTimeToSecond(endTime.format("HH:mm"));
            let time = convertTimeToSecond("14:00");
            let title = "";
            if (startTime.format("MM-DD") == endTime.format("MM-DD")) {
                if (startSecond <= time && time < endSecond) {
                    title = "Cả ngày: ";
                } else if (startSecond <= time && endSecond <= time) {
                    title = "Ca sáng: ";
                } else {
                    title = "Ca tối: ";
                }
            }
            title += register.user ? register.user.name : "";

            if (register.similar_room) {
                title += " (Phòng: ";

                store.rooms.map(room => {
                    const arrRooms = register.similar_room.filter(
                        room_id => room.id == room_id
                    );
                    if (arrRooms.length > 0) {
                        title += room.name + ", ";
                    }
                });

                title = title.substr(0, title.length - 2);

                title += ")";
            }

            let color = this.colorBook(register.status);
            return {
                title: title,
                register_room_id: register.id,
                register_name: register.user ? register.user.name : "",
                register_data: register,
                room: room ? room.name : null,
                type: room && room.type ? room.type.name : null,
                register_id: register.register_id,
                start: register.start_time,
                end: register.end_time,
                status: register.status,
                color: color,
                overlay: 1
            };
        });
        const Export = <Tooltip id="tooltip">Xuất file excel</Tooltip>;


        return (
            <div className="card" key={room ? room.id : ""}>
                <div className="card-content">
                    {room ? (
                        <div>
                            <h4 className="card-title">
                                <strong>{`Phòng ${room.name} - ${room.type.name} - ${
                                    room.seats_count
                                    } chỗ ngồi`}</strong>
                            </h4>
                            <div>{`Cơ sở ${room.base.name} - ${room.base.address}`}</div>
                        </div>
                    ) : (
                        <div style={{display: "flex", justifyContent: "space-between"}}>
                            <div style={{display: "flex"}}>
                                <h4 className="card-title">
                                    <strong>Lịch đặt phòng</strong>
                                </h4>
                            </div>
                            <div>
                                <OverlayTrigger
                                    placement="top"
                                    overlay={Export}
                                >
                                    <button
                                        className="btn btn-primary btn-round btn-xs button-add none-margin "
                                        onClick={this.exportResultExcel}
                                    >
                                        <i className="material-icons"
                                           style={{margin: "0px -4px", top: 0}}
                                        >
                                            file_download
                                        </i>
                                    </button>
                                </OverlayTrigger>
                            </div>
                        </div>

                    )}
                    <Calendar
                        id={"room-calender-" + (room ? room.id : "")}
                        calendarEvents={registersData}
                        onDropTime={value => this.updateTime(value)}
                        onClick={value => {
                            this.registerRoomSelected = {
                                id: value.register_id,
                                status: value.status,
                                register_name: value.register_name,
                                room: value.room,
                                type: value.type,
                                start_time: value.start.format(DATETIME_FORMAT),
                                end_time: value.end.format(DATETIME_FORMAT)
                            };
                            self.openModalBooking(null, room, value);
                        }}
                        onClickDay={day => {
                            if (disableCreateRegister) return;
                            self.openModalBooking(day, room);
                        }}
                    />
                </div>
            </div>
        );
    }

    selectUser = value => {
        let booking = {...this.booking};
        booking.name = value.name;
        booking.email = value.email;
        booking.address = value.address;
        booking.phone = value.phone;
        this.booking = booking;
        this.selectedUser = value;
    };

    render() {
        // const disableCreateRegister = !(this.props.user.base_id == store.selectedBaseId && this.props.user.base_id <= 0);
        const disableCreateRegister =
            (this.props.route &&
                this.props.route.path === "/dashboard/view-register") ||
            !(
                this.props.user.base_id == store.selectedBaseId ||
                this.props.user.base_id <= 0
            );
        return (
            <div>
                {store.isLoadingRooms ||
                store.isLoadingRoomTypes ||
                store.isLoadingBases ? (
                    <Loading/>
                ) : (
                    <div>
                        <div className="row">
                            <div className="col-sm-4 col-xs-5">
                                <Select
                                    defaultMessage={"Chọn cơ sở"}
                                    options={store.basesData}
                                    value={store.selectedBaseId}
                                    onChange={this.onChangeBase}
                                />
                            </div>
                            <div className="col-sm-4 col-xs-3">
                                <Select
                                    defaultMessage={"Chọn loại phòng"}
                                    options={store.roomTypesData}
                                    value={store.selectedRoomTypeId}
                                    onChange={this.onChangeRoomType}
                                />
                            </div>
                            <div className="col-sm-4 col-xs-4">
                                <Select
                                    defaultMessage={"Chọn phòng"}
                                    options={store.roomsData}
                                    value={store.selectedRoomId}
                                    onChange={this.onChangeRoom}
                                />
                            </div>
                        </div>
                        {store.isLoading ? (
                            <Loading/>
                        ) : store.registerRooms && store.selectedRoomId == 0 ? (
                            this.renderCalendar(
                                store.registerMergeRooms(),
                                disableCreateRegister
                            )
                        ) : (
                            store.registerRooms.map(room => {
                                return this.renderCalendar(
                                    store.registerMergeRooms(),
                                    disableCreateRegister,
                                    room
                                );
                            })
                        )}
                    </div>
                )}
                <Modal
                    show={this.showModalChangeStatus}
                    onHide={() => {
                        this.showModalChangeStatus = false;
                    }}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>
                            {this.registerRoomSelected.register_name} phòng{" "}
                            {this.registerRoomSelected.room} loại{" "}
                            {this.registerRoomSelected.type}
                        </Modal.Title>
                        <div>
                            Từ {this.registerRoomSelected.start_time} đến{" "}
                            {this.registerRoomSelected.end_time}
                        </div>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="form-group">
                            <label className="label-control">Thay đổi trạng thái</label>
                            <ReactSelect
                                name="form-field-name"
                                value={this.registerRoomSelected.status}
                                options={STATUS_REGISTER_ROOM}
                                onChange={this.onChangeStatus}
                                placeholder="Chọn trang thái"
                                disabled={disableCreateRegister}
                            />
                        </div>
                    </Modal.Body>
                </Modal>
                <Modal show={this.showModalBooking} onHide={this.closeModalBooking}>
                    <Modal.Header closeButton>
                        {this.booking.room ? (
                            <Modal.Title>
                                {this.booking.room && this.booking.id == undefined
                                    ? `Tạo đặt phòng ${this.booking.room.name} - ${
                                        this.booking.room.type.name
                                        }`
                                    : ""}
                                {this.booking.id
                                    ? `${this.booking.name} đặt phòng ${
                                        this.booking.room.name
                                        } loại ${this.booking.type}`
                                    : ""}
                            </Modal.Title>
                        ) : (
                            <Modal.Title>
                                {this.booking.id == undefined
                                    ? "Tạo đặt phòng"
                                    : "Sửa đặt phòng"}
                            </Modal.Title>
                        )}
                    </Modal.Header>
                    <Modal.Body>
                        <form id="form-book-room">
                            {this.booking.id ? (
                                <div/>
                            ) : (
                                <div className="form-group">
                                    <label className="label-control">Tìm khách hàng</label>
                                    <ReactSelect.Async
                                        loadOptions={this.loadUsers}
                                        loadingPlaceholder="Đang tải..."
                                        placeholder="Chọn nhà cung cấp"
                                        searchPromptText="Không có dữ liệu"
                                        onChange={this.selectUser}
                                        value={this.selectedUser}
                                    />
                                </div>
                            )}
                            <FormInputText
                                label="Tên khách hàng"
                                name="name"
                                updateFormData={this.updateFormData}
                                value={this.booking.name}
                                required
                                disabled={disableCreateRegister}
                            />
                            <FormInputText
                                label="Số điện thoại"
                                name="phone"
                                updateFormData={this.updateFormData}
                                value={this.booking.phone}
                                required
                                disabled={disableCreateRegister}
                            />
                            <FormInputText
                                label="Đại chỉ"
                                name="address"
                                updateFormData={this.updateFormData}
                                value={this.booking.address}
                                disabled={disableCreateRegister}
                            />
                            <FormInputText
                                label="Email"
                                name="email"
                                updateFormData={this.updateFormData}
                                value={this.booking.email}
                                type={"email"}
                                disabled={disableCreateRegister}
                            />

                            <FormInputText
                                label="Ghi chú khách hàng"
                                name="note"
                                updateFormData={this.updateFormData}
                                value={this.booking.note}
                                disabled={disableCreateRegister}
                            />
                            <FormInputDateTime
                                id={"booking-start-time"}
                                name="start_time"
                                updateFormData={this.updateFormData}
                                value={this.booking.start_time}
                                label={"Thời gian bắt đầu"}
                                disabled={disableCreateRegister}
                            />
                            <FormInputDateTime
                                id={"booking-end-time"}
                                name="end_time"
                                updateFormData={this.updateFormData}
                                value={this.booking.end_time}
                                label={"Thời gian kết thúc"}
                                disabled={disableCreateRegister}
                            />
                        </form>
                        <div className="form-group">
                            <label className="label-control">Trạng thái</label>
                            <ReactSelect
                                name="form-field-name"
                                value={this.booking.status}
                                options={STATUS_REGISTER_ROOM}
                                onChange={value => {
                                    this.booking.status = value.value;
                                }}
                                placeholder="Chọn trang thái"
                                disabled={disableCreateRegister}
                            />
                        </div>
                        <div className="form-group">
                            <label className="label-control">Chiến dich</label>
                            <ReactSelect
                                name="form-field-name"
                                value={this.booking.campaign_id}
                                options={store.campaignsData}
                                onChange={value => {
                                    let booking = {...this.booking};
                                    booking["campaign_id"] = value ? value.value : "";
                                    this.booking = booking;
                                }}
                                placeholder="Chọn trang thái"
                                disabled={disableCreateRegister}
                            />
                        </div>
                        <div className="form-group">
                            <label className="label-control">Ghép phòng</label>
                            <div className="row">
                                {store.allRoomsSimilar(this.booking.room).map((room, index) => {
                                    const checked =
                                        this.booking.similar_room &&
                                        this.booking.similar_room.filter(
                                            roomItem => roomItem == room.id
                                        ).length > 0;
                                    return (
                                        <div className="col-md-4" key={index}>
                                            <Checkbox
                                                label={room.name}
                                                checked={checked}
                                                checkBoxLeft
                                                disabled={disableCreateRegister}
                                                onChange={event => this.changeSimilarRoom(event, room)}
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        {!disableCreateRegister && (
                            <Button
                                onClick={this.createBookRoom}
                                label={"Lưu"}
                                labelLoading={"Đang lưu"}
                                className={"btn btn-rose"}
                                isLoading={store.isCreatingRegister}
                            />
                        )}
                    </Modal.Body>
                </Modal>
            </div>
        );
    }
}

DashboardTrongDongContainer.propTypes = {
    user: PropTypes.object.isRequired,
    route: PropTypes.object
};

function mapStateToProps(state) {
    return {
        user: state.login.user
    };
}

export default connect(mapStateToProps)(DashboardTrongDongContainer);
