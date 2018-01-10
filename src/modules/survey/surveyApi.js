import axios from 'axios';
import * as env from '../../constants/env';

export function createSurvey(surveyName) {
    let url = env.MANAGE_API_URL + "/v2/survey";
    let token = localStorage.getItem('token');
    if (token) {
        url += "?token=" + token;
    }
    return axios.post(url, {
        name: surveyName,
    });
}

export const loadSurveys = (page, search) => {
    let url = env.MANAGE_API_URL + "/v2/survey";
    let token = localStorage.getItem('token');
    if (token) {
        url += "?token=" + token;
    }
    url += "&search=" + search;
    url += "&page=" + page;
    return axios.get(url);
};