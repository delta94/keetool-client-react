import axios from 'axios';
import * as env from '../../constants/env';

export function createPayment(object){
    let url = env.MANAGE_API_URL + '/company/payment';
    let token = localStorage.getItem('token');
    if (token) {
        url += "?token=" + token;
    }
    return axios.post(url,{
        'bill_image_url': object.bill_mage_url,
        'payer_id': object.payer.id,
        'receiver_id': object.receiver.id,
        'money_value': object.money_value,
        'description': object.description,
    });

}
export function editPayment(id,object){
    let url = env.MANAGE_API_URL + '/company/payment/' + id ;
    let token = localStorage.getItem('token');
    if (token) {
        url += "?token=" + token;
    }
    return axios.post(url,{
        'bill_image_url': object.bill_mage_url,
        'payer_id': object.payer.id,
        'receiver_id': object.receiver.id,
        'money_value': object.money_value,
        'description': object.description,
    });

}
export function loadPayments(page,search){
    let url = env.MANAGE_API_URL + '/company/payment';
    let token = localStorage.getItem('token');
    if (token) {
        url += "?token=" + token + "&page=" + page + "&search=" + search;
    }
    return axios.get(url);
}

export function loadPayment(id){
    let url = env.MANAGE_API_URL + '/company/payment/' + id;
    let token = localStorage.getItem('token');
    if (token) {
        url += "?token=" + token ;
    }
    return axios.get(url);
}
export function loadCompanies(){
    let url = env.MANAGE_API_URL + '/company/all';
    let token = localStorage.getItem('token');
    if (token) {
        url += "?token=" + token + "&limit=-1";
    }
    return axios.get(url);
}
export function uploadImage(file,completeHandler, progressHandler, error){
    let url = env.API_URL + '/upload-image-froala';
    let formdata = new FormData();
    formdata.append("image", file);
    let ajax = new XMLHttpRequest();
    ajax.addEventListener("load", completeHandler, false);
    ajax.upload.onprogress = progressHandler;
    ajax.addEventListener("error", error, false);
    ajax.open("POST", url);
    ajax.send(formdata);
}