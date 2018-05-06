import * as types from './filmActionTypes';
import initialState from "../../reducers/initialState";


export default function filmReducer(state = initialState.film, action) {
    switch (action.type) {
        case types.BEGIN_LOAD_ALL_FILMS:
            return{
                ...state,
                isLoading:true
            };
        case types.LOAD_ALL_FILMS_SUCCESS:
            return {
                ...state,
                allFilms: action.allFilms,
                isLoading: false
            };
        case types.LOAD_ALL_FILMS_HAVE_PAGINATION_SUCCESS:
            return{
                ...state,
                allFilmsHavePagination: action.allFilms,
                isLoading: false,
                currentPage: action.currentPage,
                limit: action.limit,
                totalCount: action.totalCount,
                totalPages: action.totalPages
            };
        case types.SHOW_ADD_EDIT_FILM_MODAL:
            return{
                ...state,
                addEditFilmModal: !state.addEditFilmModal
            };
        case types.DELETE_FILM_SUCCESS:
            return{
                ...state,
                allFilms: state.allFilms.filter(film => film.id !== action.film.id)
            };
        case types.BEGIN_SAVE_FILM:
            return{
                ...state,
                isSavingFilm: true,
                isSaving: true,
            };
        case types.SAVE_FILM_SUCCESS:
            return{
                ...state,
                isSaving:false,
                isSavingFilm:false,
                addEditFilmModal: false,
                allFilms:[action.film, ...state.allFilms]
            };
        case types.EDIT_FILM_ERROR:
            return{
                ...state,
                isSavingFilm:false,
            };
        case types.HANDLE_AVATAR_WEBSITE_TAB_FILM:
                return {
                    ...state,
                    filmModal: {
                        ...state.filmModal,
                        avatar_url: action.image
                    },
                };
        case types.HANDLE_FILM_MODAL:
            return{
                ...state,
                filmModal:action.film,
            };
        case types.EDIT_FILM_SUCCESS:
        {
            let film = state.allFilms.map((film) => {
                if (film.id === action.film.id){
                    return {
                        ...film,
                        name:action.film.name,
                        avatar_url:action.film.avatar_url,
                        trailer_url:action.film.trailer_url,
                        director:action.film.director,
                        cast:action.film.cast,
                        running_time:action.film.running_time,
                        release_date:action.film.release_date,
                        country:action.film.country,
                        language:action.film.language,
                        film_genre:action.film.film_genre,
                        rate:action.film.rate,
                        summary:action.film.summary,
                        film_rated:action.film.film_rated,
                    };
                }
                return film;
            });
            return {
                ...state,
                isSavingFilm:false,
                addEditFilmModal: false,
                allFilms: film
            };
        }
        case types.EDIT_STATUS_SUCCESS:
        {
            let film = state.allFilms.map((film) => {
                if (film.id === action.id){
                    return {
                        ...film,
                        film_status:action.status,
                    };
                }
                return film;
            });
            return {
                ...state,
                allFilms: film
            };
        }
        default:
            return state;
    }
}