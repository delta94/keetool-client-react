import { observable, action, computed } from "mobx";
import * as roomApi from "./roomApi";
import { showErrorNotification, showNotification } from "../../helpers/helper";
import moment from "moment";
//import { DATETIME_FORMAT, DATETIME_FORMAT_SQL, CONTRACT_TYPES } from "../../../constants/constants";
//import { browserHistory } from 'react-router';

export const store = new class DashboardStaffStore {
    @observable isLoading = false;
    @observable isBooking = false;
    @observable showCreateModal = false;
    @observable registers = [];
    @observable bases = [];
    @observable rooms = [];
    @observable campaigns = [];
    @observable paginator = {
        current_page: 1,
        limit: 20,
        total_count: 0,
        total_pages: 1,
    };
    @observable createData = defaultData;
    @observable filter = {
        start_time: "",
        end_time: "",
      
    };


    @action
    openCreateModal(data) {
        this.showCreateModal = true;
        console.log('on open', data);
        if(data){
            this.createData = data;
        }else{
            this.createData = defaultData;
        }
    }

    @action
    loadRegisters(data) {
        this.isLoading = true;
        roomApi.loadRegisters(data)
            .then((res) => {
                this.isLoading = false;
                this.registers =  res.data.data;
                this.paginator = res.data.paginator;
            })
            .catch(() => {
                showErrorNotification("Có lỗi xảy ra.");
                this.isLoading = false;
            });
    }
    
    @action
    loadCampaigns() {
        roomApi.loadCampaigns()
            .then((res) => {
                this.campaigns =  res.data.data.marketing_campaigns;
            })
            .catch(() => {
                showErrorNotification("Có lỗi xảy ra.");
            });
    }
    
    @action
    loadAllBases() {
        roomApi.loadAllBasesApi()
            .then((res) => {
                this.bases =  res.data.data.bases;
            })
            .catch(() => {
                showErrorNotification("Có lỗi xảy ra.");
            });
    }
    @action
    loadAllRooms() {
        roomApi.loadRooms()
            .then((res) => {
                this.rooms =  res.data.data.rooms;
            })
            .catch(() => {
                showErrorNotification("Có lỗi xảy ra.");
            });
    }


    @computed
    get allBases() {
        let data = this.bases || [];
        return data.map(function (obj) {
            return {
                value: obj.id,
                label: obj.name,
                ...obj
            };
        });
    }
    
    @computed
    get allCampaigns() {
        let data = this.campaigns || [];
        return data.map(function (obj) {
            return {
                value: obj.id,
                label: obj.name,
                ...obj
            };
        });
    }
    @computed
    get allRooms() {
        let data = this.rooms || [];
        return data.map(function (obj) {
            return {
                value: obj.id,
                label: obj.name,
                ...obj
            };
        });
    }

}();

const defaultData = {
    id:null,
    name: '',
    phone: '',
    email: '',
    address: '',
    campaign_id: 0,
    base_id: null,
    room_id: null,
    start_time: moment(moment.now()).format("H:M D-M-Y"),
    end_time: moment(moment.now()).add(1,'days').format("H:M D-M-Y"),
    price: '',
};