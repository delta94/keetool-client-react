import axios from 'axios';
import * as env from '../../../constants/env';

export function loadSummaryGoods(page) {
    let url = env.MANAGE_API_URL + '/company/summary-good/all';
    let token = localStorage.getItem('token');
    if (token) {
        url += "?token=" + token + "&page=" + page + "&limit=20";
    }
    return axios.get(url);
}

export function loadHistoryGood(page,id){
    let url = env.MANAGE_API_URL + '/company/history-good/'+ id;
    let token = localStorage.getItem('token');
    if (token) {
        url += "?token=" + token + "&page=" + page + "&limit=20";
    }
    return axios.get(url);
}