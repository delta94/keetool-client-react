import React from 'react';
import {observer} from 'mobx-react';
import filterStore from "./filterStore";
import {Modal} from "react-bootstrap";
import setKpiStore from "./setKpiStore";
import {getValueFromKey} from "../../../helpers/entity/object";
import FormInputText from "../../../components/common/FormInputText";
import ReactSelect from "react-select";
import moment from "moment";
import DateRangePicker from "../../../components/common/DateTimePicker";

@observer
class DashboardKpiComponent extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    componentDidMount() {

    }

    loadData = () => {

    }

    toggleModal = () => {
        setKpiStore.showModal = !setKpiStore.showModal;
    }

    onChangeGen = (value) => {
        const gen_id = value ? value.value : 0;

        if (value) {
            setKpiStore.setKpi.start_time = moment(value.start_time);
            setKpiStore.setKpi.end_time = moment(value.end_time);
        }

        setKpiStore.setKpi = {...setKpiStore.setKpi, gen_id};
    }

    changeDateRangePicker = (start_time, end_time) => {
        setKpiStore.setKpi = {...setKpiStore.setKpi, start_time, end_time, gen_id: 0};
    }

    submitKpi = () => {
        setKpiStore.storeKpi(() => {
            this.toggleModal();
            this.props.reload();
        });

    }

    render() {
        let {isStoring, setKpi, selectedSaler, showModal} = setKpiStore;
        return (

            <Modal show={showModal} bsSize="large" onHide={this.toggleModal}>
                <Modal.Header closeButton>
                    <div className="title">Set KPI</div>
                </Modal.Header>
                <Modal.Body>
                    {
                        selectedSaler &&
                        <div className="flex flex-row flex-align-items-center">
                            <div>
                                <img className="circle"
                                     src={selectedSaler.avatar_url} alt="" style={{height: 80, width: 80}}/>
                            </div>
                            <div className="flex flex-col margin-left-15">
                                <strong>{selectedSaler.name}</strong>
                                {selectedSaler.base &&
                                <div>{getValueFromKey(selectedSaler, "base.name")} - Thành
                                    phố {getValueFromKey(selectedSaler, "base.district.province.name")}</div>}

                            </div>
                        </div>
                    }
                    <div className="margin-top-20" className="set-kpi-form">
                        <div className="form-modal">
                            <div className="row">
                                <div className="col-md-4">
                                    <label>Thời gian</label>
                                    <DateRangePicker
                                        className="padding-vertical-10px cursor-pointer margin-bottom-20"
                                        start={setKpi.start_time} end={setKpi.end_time}
                                        style={{padding: '5px 10px 5px 20px', lineHeight: '34px'}}
                                        onChange={this.changeDateRangePicker}
                                    />
                                </div>
                                <div className="col-md-4">
                                    <label>Khóa</label>
                                    <ReactSelect
                                        value={setKpi.gen_id}
                                        options={filterStore.gensData}
                                        onChange={this.onChangeGen}
                                        className="cursor-pointer margin-bottom-20"
                                        placeholder="Chọn khóa"
                                        clearable={false}
                                    />
                                </div>
                                <div className="col-md-4">
                                    <label>KPI</label>
                                    <FormInputText
                                        placeholder="KPI"
                                        name="number"
                                        required
                                        value={setKpiStore.setKpi.money}
                                        updateFormData={(e) => {
                                            setKpiStore.setKpi = {...setKpiStore.setKpi, money: e.target.value}
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                        {isStoring ?
                            <div className="flex flex-align-items-center flex-end">
                                <div className="btn btn-white">
                                    Hủy
                                </div>
                                <div className="btn btn-success">
                                    <i className="fa fa-spinner fa-spin"/> Đang lưu
                                </div>
                            </div>
                            :
                            <div className="flex flex-align-items-center flex-end">
                                <div className="btn btn-white" onClick={this.toggleModal}>
                                    Hủy
                                </div>
                                <div className="btn btn-success" onClick={this.submitKpi}>
                                    Lưu
                                </div>
                            </div>
                        }
                    </div>
                </Modal.Body>
            </Modal>
        );
    }
}


export default DashboardKpiComponent;
