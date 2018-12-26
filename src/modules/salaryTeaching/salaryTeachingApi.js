import axios from 'axios';
import * as env from '../../constants/env';

export function loadGensApi() {
    let url = env.MANAGE_API_URL + "/gen/all";
    let token = localStorage.getItem('token');
    if (token) {
        url += "?token=" + token;
    }

    return axios.get(url);
}

export function loadSalaryApi(genID = '', baseID = '') {
    let url = env.MANAGE_API_URL + "/finance/salary-teaching?gen_id=" + genID + "&base_id=" + baseID;
    let token = localStorage.getItem('token');
    if (token) {
        url += "&token=" + token;
    }

    return axios.get(url);
}

export function loadEvaluatePersonTeacherApi(userID = '') {
    let url = env.MANAGE_API_URL + "/teaching/evaluate-person-teacher?user_id=" + userID;
    let token = localStorage.getItem('token');
    if (token) {
        url += "&token=" + token;
    }

    return axios.get(url);
}

export function loadEvaluatePersonTeachingAssistantApi(userID = '') {
    let url = env.MANAGE_API_URL + "/teaching/evaluate-person-teaching-assistant?user_id=" + userID;
    let token = localStorage.getItem('token');
    if (token) {
        url += "&token=" + token;
    }

    return axios.get(url);
}


export function loadBasesApi() {
    let url = env.MANAGE_API_URL + "/base/all";
    let token = localStorage.getItem('token');
    if (token) {
        url += "?token=" + token;
    }

    return axios.get(url);
}

