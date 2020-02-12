import axios from 'axios';
import * as env from '../../constants/env';

export function loadLeads(page = 1, search = "", startTime = "", endTime = "", staffId = "", rate = "", top = "",address='',leadStatusId='',orderBy='',orderByType='') {

    let url = env.MANAGE_API_URL + "/lead/all";
    let token = localStorage.getItem('token');
    if (token) {
        url += "?token=" + token;
    }
    url += "&page=" + page;
    url += "&search=" + search;
    url += "&start_time=" + startTime;
    url += "&end_time=" + endTime;
    url += "&carer_id=" + staffId;
    url += "&leadStatusId=" + leadStatusId;
    url += "&rate=" + rate;
    url += "&top=" + top;
    url += "&address=" + address;
    url += "&orderBy=" + orderBy;
    url += "&orderByType=" + orderByType;
    return axios.get(url);
}

export function searchStaffs(search) {
    let url = env.MANAGE_API_URL + `/get-staffs?search=` + search;
    let token = localStorage.getItem('token');
    if (token) {
        url += "&token=" + token;
    }

    return axios.get(url);
}

export function uploadLeads(leads) {
    let url = env.MANAGE_API_URL + `/lead/create`;
    let token = localStorage.getItem('token');
    if (token) {
        url += "?token=" + token;
    }

    return axios.post(url, {
        'leads': leads
    });
}

export function editInfoLead(lead) {
    let url = env.MANAGE_API_URL + `/lead/edit-info`;
    let token = localStorage.getItem('token');
    if (token) {
        url += "?token=" + token;
    }

    return axios.put(url, {
        ...lead,
        'id': lead.id,
        'name': lead.name,
        'email': lead.email,
        'phone': lead.phone,
        'rate': lead.rate,
        'status': lead.status,
        'note': lead.note,
    });
}
export function changeLeadRate(lead) {
    let url = env.MANAGE_API_URL + `/lead/change-rate-lead`;
    let token = localStorage.getItem('token');
    if (token) {
        url += "?token=" + token;
    }

    return axios.put(url, {
        'id': lead.id,
        'rate': lead.rate,
    });
}

export function loadLeadWithIds(search = "", startTime = "", endTime = "", staffId = "", rate = "", top = "") {

    let url = env.MANAGE_API_URL + "/lead/all-ids";
    let token = localStorage.getItem('token');
    if (token) {
        url += "?token=" + token;
    }
    url += "&search=" + search;
    url += "&start_time=" + startTime;
    url += "&end_time=" + endTime;
    url += "&carer_id=" + staffId;
    url += "&rate=" + rate;
    url += "&top=" + top;
    return axios.get(url);
}

export function uploadDistributionLead(leadIds, carerId) {

    let url = env.MANAGE_API_URL + "/lead/upload-distribution-leads";
    let token = localStorage.getItem('token');
    if (token) {
        url += "?token=" + token;
    }
    return axios.post(url, {
        lead_ids: leadIds,
        carer_id: carerId,
    });
}

export function removeLead(lead_id) {

    let url = env.MANAGE_API_URL + "/lead/remove-lead";
    let token = localStorage.getItem('token');
    if (token) {
        url += "?token=" + token;
    }
    return axios.post(url, {
        lead_id
    });
}
export function removeDistributionLead(leadIds, carerId = '') {

    let url = env.MANAGE_API_URL + "/lead/remove-distribution-leads";
    let token = localStorage.getItem('token');
    if (token) {
        url += "?token=" + token;
    }
    return axios.post(url, {
        lead_ids: leadIds,
        carer_id: carerId,
    });
}


export function getAlladdresss() {
    let url = env.MANAGE_API_URL + "/address/all";
    const token = localStorage.getItem('token');
    if (token) {
        url += "?token=" + token;
    }
    return axios.get(url);
}