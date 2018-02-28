import axios from 'axios';
import * as env from '../../constants/env';

export function loadBankTransfers(page = 1, search = "", status, bank_account_id) {
    let url = env.MANAGE_API_URL + `/v2/transfer-money?page=${page}&search=${search}`;
    let token = localStorage.getItem('token');
    if (token) {
        url += "&token=" + token;
    }
    if (status) {
        url += "&status=" + status;
    }
    if (bank_account_id) {
        url += "&bank_account_id=" + bank_account_id;
    }
    return axios.get(url);
}

export function updateBankTransfer(bankTransfer) {
    let url = env.MANAGE_API_URL + `/finance/bank-transfer/${bankTransfer.id}`;
    const token = localStorage.getItem('token');
    if (token) {
        url += "?token=" + token;
    }
    return axios.put(url, bankTransfer);
}

export function updateTransferStatus(id, status, note, money) {
    let url = env.MANAGE_API_URL + "/v2/transfer-money/" + id + "/status";
    const token = localStorage.getItem('token');
    if (token) {
        url += "?token=" + token;
    }
    if (note)
        return axios.put(url, {
            status: status,
            note: note
        });
    return axios.put(url, {
        status: status,
        money: money
    });
}

export function editTransfer(bankTransfer) {
    let url = env.MANAGE_API_URL + "/v2/transfer-money/" + bankTransfer.id;
    const token = localStorage.getItem('token');
    if (token) {
        url += "?token=" + token;
    }
    return axios.put(url, {
        money: bankTransfer.money,
        note: bankTransfer.note,
        purpose: bankTransfer.purpose
    });
}
