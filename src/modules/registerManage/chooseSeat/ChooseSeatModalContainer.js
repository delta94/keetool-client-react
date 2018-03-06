import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as chooseSeatActions from "./chooseSeatActions";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import Loading from "../../../components/common/Loading";
import RoomGrid from "../../bases/room/RoomGrid";
import { DATETIME_VN_FORMAT } from "../../../constants/constants";
import FormInputDateTime from "../../../components/common/FormInputDateTime";
import moment from "moment";

class ChooseSeatModalContainer extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.handleClose = this.handleClose.bind(this);
        this.setActiveRoom = this.setActiveRoom.bind(this);
        this.onChooseSeat = this.onChooseSeat.bind(this);
        this.mergeSeats = this.mergeSeats.bind(this);
        this.onFromDateInputChange = this.onFromDateInputChange.bind(this);
        this.onToDateInputChange = this.onToDateInputChange.bind(this);
        this.state = {
            from: "",
            to: "",
        };
        this.loadSeats = this.loadSeats.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (!this.props.showModal && nextProps.showModal && nextProps.base) {
            this.props.chooseSeatActions.loadRooms(nextProps.base.id);
        }
    }

    loadSeats(roomId = null) {
        let { from, to } = this.state;
        const { room } = this.props;
        from = moment(from, DATETIME_VN_FORMAT).unix();
        to = moment(to, DATETIME_VN_FORMAT).unix();

        if (from && to && roomId) {
            this.props.chooseSeatActions.loadSeats(roomId, from, to);
        }

        if (from && to && room.id) {
            this.props.chooseSeatActions.loadSeats(room.id, from, to);
        }
    }

    mergeSeats(bookedSeats = [], seats = []) {
        return [
            ...seats,
            ...bookedSeats.map(seat => {
                return {
                    ...seat,
                    booked: true,
                };
            }),
        ].map(seat => {
            return {
                ...seat,
                index: seat.id,
            };
        });
    }

    onChooseSeat(index) {
        const seat = this.props.seats.filter(seat => {
            return index === seat.id;
        })[0];
        console.log(seat);
    }

    handleClose() {
        this.props.chooseSeatActions.toggleShowChooseSeatModal(false);
    }

    setActiveRoom(roomId) {
        this.props.chooseSeatActions.setActiveRoom(roomId);
        this.loadSeats(roomId);
    }

    onFromDateInputChange(event) {
        const from = event.target.value;
        const to = moment(event.target.value, DATETIME_VN_FORMAT)
            .add(this.props.register.subscription.hours, "hours")
            .format(DATETIME_VN_FORMAT);

        this.setState({
            from,
            to,
        });
        this.loadSeats();
    }

    onToDateInputChange(event) {
        const to = event.target.value;
        const from = moment(event.target.value, DATETIME_VN_FORMAT)
            .add(this.props.register.subscription.hours, "hours")
            .format(DATETIME_VN_FORMAT);

        this.setState({
            from,
            to,
        });
        this.loadSeats();
    }

    render() {
        const { rooms } = this.props;

        return (
            <Modal
                bsSize="large"
                show={this.props.showModal}
                onHide={this.handleClose}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Cơ sở {this.props.base.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="row">
                        <div className="col-md-6 col-lg-4">
                            <FormInputDateTime
                                format={DATETIME_VN_FORMAT}
                                name="from"
                                id="from"
                                label="Từ ngày"
                                value={this.state.from}
                                updateFormData={this.onFromDateInputChange}
                            />
                        </div>
                        <div className="col-md-6 col-lg-4">
                            <FormInputDateTime
                                name="to"
                                format={DATETIME_VN_FORMAT}
                                id="to"
                                label="Tới ngày"
                                value={this.state.to}
                                updateFormData={this.onToDateInputChange}
                            />
                        </div>
                    </div>
                    {this.props.isLoading ? (
                        <Loading />
                    ) : (
                        <div className="card-content">
                            <ul className="nav nav-pills nav-pills-rose">
                                {rooms &&
                                    rooms.map(room => (
                                        <li
                                            key={room.id}
                                            className={
                                                room.isActive ? "active" : ""
                                            }
                                        >
                                            <a
                                                onClick={() =>
                                                    this.setActiveRoom(room.id)
                                                }
                                                aria-expanded="true"
                                            >
                                                {room.name}
                                            </a>
                                        </li>
                                    ))}
                            </ul>
                            <div
                                className="tab-content"
                                style={{ marginTop: 20 }}
                            >
                                {this.props.isLoadingSeats ? (
                                    <Loading />
                                ) : (
                                    rooms &&
                                    rooms.filter(r => r.isActive).map(room => {
                                        return (
                                            <div
                                                key={room.id}
                                                className="tab-pane active"
                                            >
                                                <div>
                                                    <RoomGrid
                                                        canvasId={
                                                            "room-canvas" +
                                                            room.id
                                                        }
                                                        gridSize={30}
                                                        gridOn={false}
                                                        onClick={() => {}}
                                                        onDrag={() => {}}
                                                        roomLayoutUrl={
                                                            room.room_layout_url
                                                        }
                                                        onPointClick={
                                                            this.onChooseSeat
                                                        }
                                                        width={room.width}
                                                        height={room.height}
                                                        seats={this.mergeSeats(
                                                            this.props
                                                                .bookedSeats,
                                                            this.props.seats,
                                                        )}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    )}
                </Modal.Body>
            </Modal>
        );
    }
}

ChooseSeatModalContainer.propTypes = {
    chooseSeatActions: PropTypes.object.isRequired,
    showModal: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired,
    base: PropTypes.object.isRequired,
    register: PropTypes.object.isRequired,
    rooms: PropTypes.array.isRequired,
    isLoadingSeats: PropTypes.bool.isRequired,
    seats: PropTypes.array.isRequired,
    seatsCount: PropTypes.number.isRequired,
    availableSeats: PropTypes.number.isRequired,
    bookedSeats: PropTypes.array.isRequired,
    room: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
    const {
        seats,
        seatsCount,
        availableSeats,
        bookedSeats,
        from,
        rooms,
        room,
        to,
        register,
        isLoading,
        showModal,
        base,
        isLoadingSeats,
    } = state.chooseSeat;
    return {
        seats,
        seatsCount,
        availableSeats,
        bookedSeats,
        from,
        rooms,
        room,
        to,
        register,
        isLoading,
        showModal,
        base,
        isLoadingSeats,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        chooseSeatActions: bindActionCreators(chooseSeatActions, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(
    ChooseSeatModalContainer,
);
