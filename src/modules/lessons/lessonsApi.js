import axios    from 'axios';
import * as env from '../../constants/env';

export function loadLessonDetail(lessonId) {
    //manageapi.keetool.xyz/v2/lesson/get-detail-lesson/34?token=
    let url     = env.MANAGE_API_URL + "/v2/lesson/get-detail-lesson/";
    let token   = localStorage.getItem('token');
    if (token) {
        url +=  lessonId + "?token=" + token;
    }
    return axios.get(url);
}


export function createLesson(data) {
    //manageapi.homestead.app/v2/lesson/create-lesson/{courseId}?token=
    let url = env.MANAGE_API_URL + "/v2/lesson/create-lesson/";
    let token = localStorage.getItem('token');
    if (token) {
        url += data.course_id + "?token=" + token;
    }
    return axios.post(url, data);
}

export function editLesson(data) {
    //manageapi.homestead.app/v2/lesson/create-lesson/{courseId}?token=
    let url = env.MANAGE_API_URL + "/v2/lesson/edit-lesson/";
    let token = localStorage.getItem('token');
    if (token) {
        url += data.id + "?token=" + token;
    }
    return axios.put(url, data);
}
export function loadTerms(courseId) {
    //http://manageapi.keetool.xyz/v2/lesson/term/course/1?token=
    let url = env.MANAGE_API_URL + "/v2/lesson/term/course/";
    let token = localStorage.getItem('token');
    if (token) {
        url += courseId + "?token=" + token;
    }
    return axios.get(url);
}

export function uploadImage(file, completeHandler, error) {
    let url = env.API_URL + '/upload-image-froala';
    let formdata = new FormData();
    formdata.append('image', file);
    let ajax = new XMLHttpRequest();
    ajax.addEventListener("load", completeHandler, false);
    ajax.open("POST", url);
    ajax.send(formdata);
    ajax.addEventListener("error", error, false);
}

