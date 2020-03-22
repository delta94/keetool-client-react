import React from "react";
import {observer} from 'mobx-react';

import {store} from './TicketStore';
import CreateTicketModal from './CreateTicketModal';
import Loading from "../../components/common/Loading";
import Search from "../../components/common/Search";
import Sort from "../../components/common/ReactTable/Sort";
import ReactTable from "react-table-v6";
import {getShortName, isEmptyInput} from "../../helpers/helper";
import TooltipButton from "../../components/common/TooltipButton";
import {Modal, Panel} from "react-bootstrap";
import ToggleStar from "../../components/common/ToggleStar";
import {openModalRegisterDetail, openModalStaffDetail} from "../globalModal/globalModalActions";
import ReactSelect from "react-select";
import ItemReactSelect from "../../components/common/ItemReactSelect";
import StatusesOverlay from "../infoStudent/overlays/StatusesOverlay";
import {STATUS_REFS} from "../../constants/constants";
import TicketPriorityOverlay from "./TicketPriorityOverlay";
import TicketTypeOverlay from "./TicketTypeOverlay";

@observer
export default class TicketContainer extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.statusRef = STATUS_REFS.tickets;
        this.starFilter = [
            {value: '', label: 'Tất cả',},
            {value: '1', label: 'Đã đánh dấu',},
            {value: '2', label: 'Chưa đánh dấu',},
        ];
        this.columns = [
            {
                // eslint-disable-next-line react/jsx-no-undef
                Header: '',
                sortable: true,
                accessor: 'staredBy',
                Cell: props => {
                    let data = props.original;
                    let text = data.staredBy ? `Đánh dấu bởi ${data.staredBy.name} - ${data.stared_at}` : 'Ấn để đánh dấu';
                    return (

                            <TooltipButton text={text} placement="top">
                                <div className="margin-auto">
                                <ToggleStar
                                    value={!isEmptyInput(props.value)}
                                    isLoading={store.isStaring}
                                    onChange={() => {
                                        store.starTicket(props.original.id);
                                    }}
                                />
                                </div>
                            </TooltipButton>

                    );
                }, // Custom cell components!
                minWidth: 65,
                maxWidth: 65
            },
            {
                Header: <Sort title="Tên học viên"/>,
                accessor: 'user',
                Cell: props => {
                    let user = props.value || {name: 'Không có'};
                    let data = props.original;
                    return (<div className="cursor-pointer">

                        <div className=" color-black"
                             onClick={() => openModalRegisterDetail(`/sales/info-student/${props.value.id}`)}>
                            <strong>{user.name}</strong></div>

                        {data.register && data.register.studyClass && data.register.studyClass.gen &&

                        <TooltipButton text={`Khóa ${data.register.studyClass.gen.name}`} placement="top">
                            <a className=" color-black" href={`/teaching/class/${data.register.studyClass.id}`}
                               target="_blank">
                                <strong>{data.register.studyClass.name}</strong></a>
                        </TooltipButton>}


                    </div>);
                },
                minWidth: 150
            },
            {
                Header: <Sort title="Vấn đề"/>,
                accessor: 'name',
                Cell: props => {
                    let data = props.original;
                    return(<div className="cursor-pointer" onClick={()=>store.openModalEdit(data)}>
                        <div><b>{data.name}</b></div>
                        <div>{data.description}</div>
                    </div>);
                }
            },
            {
                Header: <Sort title="Giải quyết"/>,
                accessor: 'solution',
                Cell: props => <div className="cursor-pointer" onClick={()=>store.openModalEdit(props.original)}>{props.value}</div>
            },
            {
                Header: <Sort title="Đảm nhiệm"/>,
                accessor: 'assigner',
                Cell: props => {
                    let data = props.original;
                    let assigner = data.assigner || {name: 'Không có'};
                    let pic = data.pic || {name: 'Không có'};

                    return (
                        <div style={{width: '100%'}}>
                            <TooltipButton text="Người giao" placement="top">
                                <button className="btn btn-xs btn-main width-100"
                                        style={{backgroundColor: "#" + assigner.color}}
                                        onClick={()=>{if(assigner.id)openModalStaffDetail(assigner.id);}}
                                >
                                    {getShortName(assigner.name)}
                                </button>
                            </TooltipButton>

                            <div className="text-center"><b className="caret"/></div>
                            <TooltipButton text="Người nhận" placement="top">

                                <button className="btn btn-xs btn-main width-100"
                                        style={{backgroundColor: "#" + pic.color}}
                                        onClick={()=>{if(pic.id)openModalStaffDetail(pic.id);}}

                                >
                                    {getShortName(pic.name)}
                                </button>
                            </TooltipButton>

                        </div>);
                }, minWidth: 150

            },
            {
                Header: <Sort title="Phân loại"/>,
                accessor: 'type',
                Cell: props => {

                    let data = props.original;
                    let type = data.type || {name: 'Không có'};
                    return (
                        <div style={{width: '100%'}} onClick={()=>store.openModalEdit(props.original)}>
                            <button className="btn btn-xs btn-main width-100"
                                    style={{backgroundColor: type.color}}>
                                {(type.name)}
                            </button>
                        </div>

                    );
                }, minWidth: 150
            },
            {
                Header: <Sort title="Trạng thái"/>,
                accessor: 'status',
                Cell: props => {
                    let data = props.original;
                    let status = data.status || {name: 'Không có'};
                    return (
                        <div style={{width: '100%'}} onClick={()=>store.openModalEdit(props.original)}>
                            <button className="btn btn-xs btn-main width-100"
                                    style={{backgroundColor: status.color}}>
                                {(status.name)}
                            </button>
                        </div>

                    );
                }, minWidth: 150

            },
            {
                Header: <Sort title="Độ ưu tiên"/>,
                accessor: 'priority',
                Cell: props => {
                    let data = props.original;
                    let priority = data.priority || {name: 'Không có'};
                    return (
                        <div style={{width: '100%'}} onClick={()=>store.openModalEdit(props.original)}>
                            <button className="btn btn-xs btn-main width-100"
                                    style={{backgroundColor: priority.color}}>
                                {(priority.name)}
                            </button>
                        </div>

                    );
                }, minWidth: 150
            },
            {
                sortable: false,
                Header: "",
                accessor: 'id',
                Cell: props => {
                    let data = props.original;
                    let archivist = data.archivist;
                    let dataArchive;
                    if (isEmptyInput(archivist)) {
                        dataArchive = {name: 'Lưu trữ', icon: 'assignment_turned_in'};
                    } else {
                        dataArchive = {name: `Đã lưu trữ bới ${archivist.name} - ${data.archived_at}`, icon: 'unarchive'};
                    }
                    return (<div className="flex flex-row flex-align-items-center">
                        <div className="btn-group-action">
                            <TooltipButton text="Chỉnh sửa" placement="top">
                                <a onClick={() => {
                                    store.openModalEdit(data);
                                }}>
                                    <i className="material-icons">edit</i>
                                </a>
                            </TooltipButton>
                            <TooltipButton text={dataArchive.name} placement="top">
                                <a onClick={() => store.archiveTicket(data)}>
                                    <i className="material-icons">{dataArchive.icon}</i>
                                </a>
                            </TooltipButton>
                            <TooltipButton text="Lịch sử" placement="top">
                                <a onClick={() => store.openModalTicketHistory(props.value)}>
                                    <i className="material-icons">history</i>
                                </a>
                            </TooltipButton>

                        </div>
                    </div>);
                },
                maxWidth: 100,
                width: 100
            },
        ];

    }

    componentDidMount() {
        store.loadTickets();
    }

    searchChange = (value) => {
        store.filter.search = value;
    };

    applyFilter = () => {
        store.loadTickets();
    };

    updateSelect = (field, e) => {
        store.filter[field] = e;
        if (!field.includes('id')) store.filter[field + '_id'] = e ? e.id : e;
    };
    getSelectItem = (option) => {
        return (
            <ItemReactSelect label={option.label}
                             url={option.avatar_url}/>
        );
    };

    render() {
        let {isLoading, isLoadingHistory, filter, getTickets, openFilterPanel, modal} = store;
        console.log(...filter);
        return (<div>

            <div className="card" mask="purple">
                <img className="img-absolute"/>
                <div className="card-content">

                    <h5 className="card-title"><strong>Chăm sóc học viên</strong></h5>
                    <div style={{marginTop: '10%'}}/>
                    <div className="flex-align-items-center flex flex-wrap">
                        <Search
                            onChange={this.searchChange}
                            placeholder="Tim kiếm"
                            value={filter.search}
                            className="round-white-seacrh"
                            onSearch={this.applyFilter}
                        />
                        <button
                            onClick={() => {
                                store.openFilterPanel = !openFilterPanel;
                            }}
                            className="btn btn-white btn-round margin-right-10"
                            disabled={this.props.isLoading}
                        >
                            Lọc
                        </button>
                        <div className="btn btn-white btn-round btn-icon"
                             onClick={() => store.openModalCreate()}
                        >Thêm vấn đề<i className="material-icons">add</i>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                {!store.isLoading &&
                <ul className="nav nav-pills nav-pills-dark margin-bottom-20" data-tabs="tabs">
                    {store.tabFilter.tabs.map((tab, key) => {
                        let className = key == store.tabFilter.currentTab ? 'active' : '';
                        return (<li className={className} key={key} onClick={() => store.changeArchiveFilter(key)}>
                            <a>{tab.text}</a>
                        </li>);
                    })}
                </ul>}
            </div>
            <Panel collapsible className="none-margin"
                   expanded={openFilterPanel}>
                <div className="card card-filter margin-top-0">
                    {/*<div className="card-content">*/}
                    <div className="row">
                        <div className="col-md-3">
                            <label>Người tạo vấn đề</label>
                            <ReactSelect.Async
                                loadOptions={(p1, p2) => store.searchUsers(p1, p2, 'creators', true)}
                                loadingPlaceholder="Đang tải..."
                                placeholder="Chọn người dùng"
                                searchPromptText="Không có dữ liệu "
                                onChange={(e) => {
                                    this.updateSelect('creator', e);
                                }}
                                value={filter.creator}
                                id="select-async-filter-creator"
                                optionRenderer={this.getSelectItem}
                                valueRenderer={this.getSelectItem}
                            />
                        </div>
                        <div className="col-md-3">
                            <label>Người giao vấn đề</label>
                            <ReactSelect.Async
                                loadOptions={(p1, p2) => store.searchUsers(p1, p2, 'users', true)}
                                loadingPlaceholder="Đang tải..."
                                placeholder="Chọn người dùng"
                                searchPromptText="Không có dữ liệu "
                                onChange={(e) => {
                                    this.updateSelect('assigner', e);
                                }}
                                value={filter.assigner}
                                id="select-async-filter-assigner"
                                optionRenderer={this.getSelectItem}
                                valueRenderer={this.getSelectItem}
                            />
                        </div>
                        <div className="col-md-3">
                            <label>Người nhận vấn đề</label>
                            <ReactSelect.Async
                                loadOptions={(p1, p2) => store.searchUsers(p1, p2, 'pics', true)}
                                loadingPlaceholder="Đang tải..."
                                placeholder="Chọn người dùng"
                                searchPromptText="Không có dữ liệu "
                                onChange={(e) => {
                                    this.updateSelect('pic', e);
                                }}
                                value={filter.pic}
                                id="select-async-filter-pic"
                                optionRenderer={this.getSelectItem}
                                valueRenderer={this.getSelectItem}
                            />
                        </div>
                        <div className="col-md-3">
                            <label>Trạng thái</label>
                            <StatusesOverlay
                                data={filter.status || {}}
                                onChange={e => this.updateSelect('status', e)}
                                defaultText="Chọn trạng thái"
                                statusRef={this.statusRef}
                                className="btn status-overlay width-100 none-padding none-margin"
                                styleButton={{padding: '11px 15px'}}
                                styleOverlay={{marginTop: 10}}
                            />
                        </div>
                        <div className="col-md-3">
                            <label>Độ ưu tiên</label>
                            <TicketPriorityOverlay
                                text="Chọn độ ưu tiên"
                                priority_id={filter.priority_id}
                                className="btn status-overlay width-100 none-padding none-margin"
                                styleButton={{padding: '10px 15px'}}
                                styleOverlay={{marginTop: 10}}
                                onChange={e => this.updateSelect('priority', e)}
                            />
                        </div>
                        <div className="col-md-3">
                            <label>Loại vấn đề</label>
                            <TicketTypeOverlay
                                text="Chọn loại vấn đề"
                                ticket_type_id={filter.ticket_type_id}
                                className="btn status-overlay width-100 none-padding none-margin"
                                styleButton={{padding: '10px 15px'}}
                                styleOverlay={{marginTop: 10}}
                                onChange={e => this.updateSelect('ticket_type', e)}
                            />
                        </div>
                        <div className="col-md-3">
                            <label>
                                Theo đánh dấu
                            </label>
                            <ReactSelect
                                options={this.starFilter}
                                onChange={e => this.updateSelect('stared_by', e)}
                                value={filter.stared_by}
                                defaultMessage="Tuỳ chọn"
                                name="filter_star"
                            />
                        </div>

                        <div className="col-md-3">
                            <label>Lớp học</label>
                            <ReactSelect.Async
                                loadOptions={(p1, p2) => store.searchClasses(p1, p2)}
                                loadingPlaceholder="Đang tải..."
                                placeholder="Chọn lớp"
                                searchPromptText="Không có dữ liệu "
                                onChange={(e) => {
                                    this.updateSelect('class', e);
                                }}
                                value={filter.class}
                                id="select-async-filter-class"
                                optionRenderer={this.getSelectItem}
                                valueRenderer={this.getSelectItem}
                            />
                        </div>
                        <div className="col-md-12">
                            <div className="flex-end">
                                <div className="btn button-green" onClick={this.applyFilter}>Áp dụng</div>
                            </div>
                        </div>
                    </div>
                    {/*</div>*/}
                </div>
            </Panel>
            {!isLoading &&
            <div className="row">
                <div className="col-md-12">
                    <ReactTable
                        data={getTickets}
                        columns={this.columns}
                        previousText={'Trước'}
                        nextText={'Tiếp'}
                        noDataText={'Không có dữ liệu'}
                        pageText={"Trang"}
                        rowsText={"dòng"}
                        showPagination={false}
                        pageSize={getTickets.length}
                        defaultPageSize={getTickets.length}
                        // defaultSorted={[
                        //     {
                        //         id: "id",
                        //         desc: data.length > 2 && totalKpi.revenue > 0
                        //     }
                        // ]}
                    />
                </div>
            </div>
            }
            {isLoading && <Loading/>}
            <CreateTicketModal/>
            <Modal
                bsSize="large"
                show={modal.showModalHistory}
                onHide={() => {
                    store.modal.showModalHistory = false;
                }}
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        <div className="text-center bold">
                            Lịch sử vấn đề
                        </div>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        {isLoadingHistory && <Loading/>}
                        {!isLoadingHistory && modal.histories.length == 0 &&
                        <div className="text-center">Không có dữ liệu</div>}
                        <div className="table-responsive table-split">
                            <table id="datatables"
                                   className="table table-no-bordered table-hover"
                                   cellSpacing="0" width="100%" style={{width: "100%"}}>
                                <tbody>
                                {!isLoadingHistory && modal.histories && modal.histories.map((history, key) => {
                                    return (<tr key={key}>
                                        <td><b>{history.agent.name}</b></td>
                                        <td>
                                            {/*//eslint-disable-next-line*/}
                                            <div dangerouslySetInnerHTML={{__html: history.action}}/>

                                        </td>
                                        <td>{history.created_at}</td>
                                    </tr>);
                                })}
                                </tbody>
                            </table>
                        </div>
                        </div>
                </Modal.Body>
            </Modal>
        </div>
    );
    }
    }

