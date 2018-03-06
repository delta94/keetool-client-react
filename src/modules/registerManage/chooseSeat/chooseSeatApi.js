import axios from "axios";
import * as env from "../../../constants/env";

export function getRooms(baseId) {
    let url = `${env.MANAGE_API_URL_V3}/base/${baseId}/rooms`;
    let token = localStorage.getItem("token");
    if (token) {
        url += "?token=" + token;
    }
    return axios.get(url);
}

export function getSeats(roomId, from, to) {
    let token = localStorage.getItem("token");
    let url = `${
        env.MANAGE_API_URL_V3
    }/seat/available?token=${token}&from=${from}&to=${to}&limit=-1&room_id=${roomId}`;
    return axios.get(url);
}
