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

export function loadEvaluateClassesApi(genID = '', baseID = '') {
    let url = env.MANAGE_API_URL + "/teaching/evaluate-classes?gen_id=" + genID + "&base_id=" + baseID;
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
