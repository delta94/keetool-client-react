import * as types from '../../constants/actionTypes';
import initialState from '../../reducers/initialState';

let categoriesList;
export default function categoriesReducer(state = initialState.categories, action) {

    switch (action.type) {

        /*          EDIT            */

        case types.BEGIN_EDIT_CATEGORY:
            return {
                ...state,
                addCategory: {
                    isSaving: true,
                }
            };
        case types.EDIT_CATEGORY_SUCCESS:
            categoriesList = changeCategory(action.id, action.name, state.categoriesList);
            return {
                ...state,
                categoriesList: categoriesList,
                addCategory: {
                    isSaving: false,
                }
            };
        case types.EDIT_CATEGORY_ERROR:
            return {
                ...state,
                addCategory: {
                    isSaving: false,
                }
            };


        /*          DELETE            */


        case types.BEGIN_DELETE_CATEGORY:
            return {
                ...state,
                isLoading: true,
            };


        case types.DELETE_CATEGORY_SUCCESS:
            categoriesList = deleteCategory(action.id, state.categoriesList);
            return {
                ...state,
                categoriesList: categoriesList,
                isLoading: false,
            };
        case types.DELETE_CATEGORY_ERROR:
            return {
                ...state,
                isLoading: false,
            };


        /*          ADD            */


        case types.ADD_CATEGORY_SUCCESS :
            return {
                ...state,
                categoriesList: [action.category, ...state.categoriesList],
                addCategoriesModal: {
                    isSaving: false,
                }
            };
        case types.ADD_CATEGORY_ERROR :
            return {
                ...state,
                addCategoriesModal: {
                    isSaving: false,
                }
            };
        case types.BEGIN_ADD_CATEGORY :
            return {
                ...state,
                addCategoriesModal: {
                    isSaving: true,
                }
            };



        /*          MODAL            */


        case types.OPEN_ADD_CATEGORY_MODAL_CONTAINER:
            return {
                ...state,
                ...{
                    addCategoriesModal:
                        {
                            id: action.id,
                            parent_id: action.parent_id,
                            name: action.name,
                            isEdit: action.isEdit,
                            isShowModal: true,
                        }
                }
            };
        case types.CLOSE_ADD_CATEGORY_MODAL_CONTAINER:
            return {
                ...state,
                ...{
                    addCategoriesModal:
                        {
                            isShowModal: false,
                        }
                }
            };


        /*          LOAD            */


        case types.BEGIN_LOAD_CATEGORIES_DATA:
            return {
                ...state,
                ...{
                    isLoading: true,
                    error: false,
                }
            };
        case types.LOADED_CATEGORIES_DATA_SUCCESS:
            return {
                ...state,
                ...{
                    isLoading: false,
                    error: false,
                    categoriesList: action.categoriesList,
                }
            };
        case types.LOADED_CATEGORIES_DATA_ERROR:
            return {
                ...state,
                ...{
                    isLoading: false,
                    error: true,
                }
            };
        default :
            return state;
    }

}


/*          Support            */

function deleteCategory(id, categoriesList) {
    if (categoriesList) {
        categoriesList = categoriesList.filter(category => category.id !== id);
    }
    return categoriesList;
}

function changeCategory(id, name, categoriesList) {
    if (categoriesList) {
        categoriesList = categoriesList.map(function (category) {
            if (category.id === id) {
                return {...category, name: name};
            }
            else return category;
        });
    }
    return categoriesList;
}


