import axios from 'axios';
import * as env from '../../../constants/env';
import moment from "moment";
import { DATETIME_FORMAT, DATETIME_FORMAT_SQL } from '../../../constants/constants';


export function submitBooking(register) {
    let url = env.MANAGE_API_URL;

    if (register.id) {
        url += "/trongdong/register-room/edit";
    } else {
        url += "/trongdong/register-room/create";
    }

    let token = localStorage.getItem("token");
    if (token) {
        url += "?token=" + token;
    }
    return axios.put(url, {
        id: register.id ? register.id : '',
        name: register.name,
        email: register.email,
        phone: register.phone,
        address: register.address,
        status: register.status,
        base_id: register.base_id,
        room_id: register.room_id,
        start_time: moment(register.start_time, [DATETIME_FORMAT, DATETIME_FORMAT_SQL]).format(DATETIME_FORMAT_SQL),
        end_time: moment(register.end_time, [DATETIME_FORMAT, DATETIME_FORMAT_SQL]).format(DATETIME_FORMAT_SQL),
        note: register.note,
        campaign_id: register.campaign_id,
    });
}


export function loadRooms() {
    let url = env.MANAGE_API_URL + "/trongdong/room/all";
    let token = localStorage.getItem("token");
    if (token) {
        url += "?token=" + token;
    }

    return axios.get(url);
}

export function loadCampaigns() {
    //http://manageapi.keetool.xyz/marketing-campaign/all?token=
    let token = localStorage.getItem('token');
    let url = env.MANAGE_API_URL + "/marketing-campaign/all?limit=-1&token=" + token;
    return axios.get(url);
}


export function loadAllRegistersApi(filter) {
    filter = filter ? filter : {};
    let {
        limit,
        page = 1,
        search,
        saler_id,
        base_id,
        startTime,
        endTime
    } = filter;
    let url = env.MANAGE_API_URL + '/trongdong/register-room/all?page=' + page;
    if (search) {
        url += "&search=" + search;
    }
    let token = localStorage.getItem('token');
    if (token) {
        url += "&token=" + token;
    }
    if (saler_id) {
        url += "&saler_id=" + (saler_id == -1 ? '' : saler_id);
    }
    if (limit) {
        url += "&limit=" + limit;
    }
    if (startTime) {
        url += "&start_time=" + startTime;
    }
    if (endTime) {
        url += "&end_time=" + endTime;
    }
    if (base_id) {
        url += "&base_id=" + (base_id == -1 ? '' : base_id);
    }
    return axios.get(url);
}


// export function loadDashboard(baseId = "", roomTypeId = "", roomId = "") {
//     let url = env.MANAGE_API_URL + "/trongdong/dashboard";
//     let token = localStorage.getItem("token");
//     if (token) {
//         url += "?token=" + token;
//     }
//     url += `&base_id=${baseId}&room_type_id=${roomTypeId}&room_id=${roomId}`;
//     return axios.get(url);
// }
// export function loadAllRegistersApi(filter) {
//     filter = filter ? filter : {};
//     let {
//         limit,
//         page = 1,
//         search,
//         saler_id,
//         base_id,
//         startTime,
//         endTime
//     } = filter;
//     let url = env.MANAGE_API_URL + '/coworking-space/room-booking?page=' + page;
//     if (search) {
//         url += "&search=" + search;
//     }
//     let token = localStorage.getItem('token');
//     if (token) {
//         url += "&token=" + token;
//     }
//     if (saler_id) {
//         url += "&saler_id=" + (saler_id == -1 ? '' : saler_id);
//     }
//     if (limit) {
//         url += "&limit=" + limit;
//     }
//     if (startTime) {
//         url += "&start_time=" + startTime;
//     }
//     if (endTime) {
//         url += "&end_time=" + endTime;
//     }
//     if (base_id) {
//         url += "&base_id=" + (base_id == -1 ? '' : base_id);
//     }
//     return axios.get(url);
// }



export function loadAllBasesApi() {
    let url = env.MANAGE_API_URL + "/base/all";
    let token = localStorage.getItem('token');
    if (token) {
        url += "?token=" + token;
    }

    return axios.get(url);
}

export function loadAllSalersApi() {
    let url = env.MANAGE_API_URL + '/coworking-space/saler?';
    let token = localStorage.getItem('token');
    if (token) {
        url += "&token=" + token;
    }
    return axios.get(url);
}

export function changeCallStatusApi(status, note, register_id, user_id) {
    let url = env.MANAGE_API_URL + '/coworking-space/save-call?';
    let token = localStorage.getItem('token');
    if (token) {
        url += "&token=" + token;
    }
    return axios.post(url, {
        "register_id": register_id,
        "listener_id": user_id,
        "note": note,
        "call_status": status,
    });
}

export function savePaymentApi(money, note, register_id, user_id) {
    let url = env.MANAGE_API_URL + '/company/payment/create?';
    let token = localStorage.getItem('token');
    if (token) {
        url += "&token=" + token;
    }
    return axios.post(url, {
        "register_id": register_id,
        "user_id": user_id,
        "money_value": money,
        "description": note,
    });
}

export function updateOfficialTimeApi(register) {
    let url = env.MANAGE_API_URL + '/coworking-space/room-booking/' + register.id + '/assign-time?';
    let token = localStorage.getItem('token');
    if (token) {
        url += "&token=" + token;
    }
    return axios.put(url, {
        "start_time": register.official_start_time,
        "end_time": register.official_end_time,
    });
}

