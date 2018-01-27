import * as types from '../../constants/actionTypes';
import * as roomApi from './roomApi';
import * as helper from "../../helpers/helper";

/*eslint no-console: 0 */

export function loadBasesData() {
    return function (dispatch) {
        dispatch({type: types.BEGIN_LOAD_BASES_ROOM_DATA});
        roomApi.getBases()
            .then(function (res) {
                dispatch({
                    type: types.LOAD_BASES_ROOM_DATA_SUCCESS,
                    bases: res.data.data.bases
                });
            }).catch(() => {
            dispatch({
                type: types.LOAD_BASES_ROOM_DATA_ERROR
            });
        });
    };
}

export function changeAvatar(file) {
    return function (dispatch) {
        const error = () => {
            helper.showErrorNotification("Có lỗi xảy ra");
        };
        const completeHandler = (event) => {
            const data = JSON.parse(event.currentTarget.responseText);
            helper.showNotification("Tải lên ảnh đại diện thành công");
            dispatch({
                type: types.UPLOAD_ROOM_AVATAR_COMPLETE,
                avatar_url: data.url
            });
        };
        const progressHandler = (event) => {
            const percentComplete = Math.round((100 * event.loaded) / event.total);
            dispatch({
                type: types.UPDATE_ROOM_AVATAR_PROGRESS,
                percent: percentComplete
            });
        };

        dispatch({
            type: types.BEGIN_UPLOAD_ROOM_AVATAR
        });
        roomApi.changeAvatarApi(file,
            completeHandler, progressHandler, error);
    };
}


export function changeImage(file, length, first_length) {
    return function (dispatch) {
        dispatch({
            type: types.BEGIN_UPLOAD_IMAGE_ROOM
        });
        const error = () => {
            helper.showErrorNotification("Có lỗi xảy ra");
        };
        const completeHandler = (event) => {
            const data = JSON.parse(event.currentTarget.responseText);
            helper.showNotification("Tải lên ảnh thành công");
            dispatch({
                type: types.UPLOAD_IMAGE_COMPLETE_ROOM,
                image: data.url,
                length,
                first_length
            });
        };
        const progressHandler = (event) => {
            const percentComplete = Math.round((100 * event.loaded) / event.total);
            dispatch({
                type: types.UPDATE_ROOM_AVATAR_PROGRESS,
                percent: percentComplete
            });
        };
        roomApi.changeAvatarApi(file,
            completeHandler, progressHandler, error);
    };
}

export function loadRoomsData(page, search, baseId) {
    return function (dispatch) {
        dispatch({type: types.BEGIN_LOAD_ROOMS_DATA});
        roomApi.getRooms(page, search, baseId)
            .then(function (res) {
                dispatch({
                    type: types.LOAD_ROOMS_DATA_SUCCESS,
                    rooms: res.data.rooms,
                    currentPage: res.data.paginator.current_page,
                    totalPages: res.data.paginator.total_pages
                });
            }).catch(() => {
            dispatch({
                type: types.LOAD_ROOMS_DATA_ERROR
            });
        });
    };
}

export function deleteImage(image) {
    return {
        type: types.DELETE_IMAGE_ROOM,
        image
    };
}

export function storeRoom(room, closeModal) {
    const isEdit = !!room.id;
    return function (dispatch) {
        dispatch({type: types.BEGIN_STORE_ROOM_DATA});
        roomApi.storeRoom(room)
            .then(function (res) {
                helper.showNotification("Lưu phòng học thành công.");
                closeModal();
                dispatch({
                    type: types.STORE_ROOM_DATA_SUCCESS,
                    room: res.data.data.room,
                    isEdit
                });
            }).catch(() => {
            helper.showTypeNotification("Lưu phòng học thất bại.", "warning");
            dispatch({
                type: types.STORE_ROOM_DATA_ERROR
            });
        });
    };
}

export function showRoomEditModal(index) {
    return {
        type: types.TOGGLE_ROOM_EDIT_MODAL,
        index
    };
}

export function handleRoomEditModal(room) {
    return {
        type: types.HANDLE_ROOM_EDIT_MODAL,
        room
    };
}