import * as fromUserActions from '../actions/user.actions';
import { UserAssignedRole } from 'libs/models';
import { UserManagementDto } from 'libs/models/payfactors-api/user';

export interface IUserState {
    loaded: boolean;
    loading: boolean;
    user: UserManagementDto;
    roles: UserAssignedRole[];
    apiError: string;

}

const initialState: IUserState = {
    loaded: false,
    loading: false,
    user: null,
    roles: null,
    apiError: ''
};

export function reducer(state = initialState, action: fromUserActions.UserActions): IUserState {
    const noApiResponseState = {
        ...state,
        apiSaveResponse: undefined
    };
    switch (action.type) {
        case fromUserActions.LOAD_USER:
            return {
                ...noApiResponseState,
                loading: true
            };
        case fromUserActions.LOAD_USER_SUCCESS:
            return {
                ...noApiResponseState,
                loaded: true,
                loading: false,
                user: action.payload,
            };
        case fromUserActions.RESET_USER:
            return {
                ...noApiResponseState,
                user: null,
            };
        case fromUserActions.LOAD_ROLES_SUCCESS:
            return {
                ...noApiResponseState,
                roles: action.payload,
            };
        case fromUserActions.SAVE_USER:
            return {
                ...noApiResponseState,
                loading: true
            };
        case fromUserActions.SAVE_USER_SUCCESS:
            return {
                ...noApiResponseState,
                loading: false
            };
        case fromUserActions.HANDLE_API_ERROR:
            return {
                ...noApiResponseState,
                loading: false,
                apiError: action.payload
            };
        default:
            return state;
    }
}

export const getUserState = (state: IUserState) => state;
export const getUser = (state: IUserState) => state.user;
export const getRoles = (state: IUserState) => state.roles;
export const getUserLoading = (state: IUserState) => state.loading;
export const getUserLoaded = (state: IUserState) => state.loaded;
export const getUserApiError = (state: IUserState) => state.apiError;
