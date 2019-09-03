import * as fromUserManagementActions from '../actions/user-management.actions';
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

export function reducer(state = initialState, action: fromUserManagementActions.UserManagementActions): IUserState {
    const noApiResponseState = {
        ...state,
        apiSaveResponse: undefined
    };
    switch (action.type) {
        case fromUserManagementActions.LOAD_USER:
            return {
                ...noApiResponseState,
                loading: true
            };
        case fromUserManagementActions.LOAD_USER_SUCCESS:
            return {
                ...noApiResponseState,
                loaded: true,
                loading: false,
                user: action.payload,
            };
        case fromUserManagementActions.RESET_USER:
            return {
                ...noApiResponseState,
                user: null,
            };
        case fromUserManagementActions.LOAD_ROLES_SUCCESS:
            return {
                ...noApiResponseState,
                roles: action.payload,
            };
        case fromUserManagementActions.SAVE_USER:
            return {
                ...noApiResponseState,
                loading: true
            };
        case fromUserManagementActions.SAVE_USER_SUCCESS:
            return {
                ...noApiResponseState,
                loading: false
            };
        case fromUserManagementActions.HANDLE_API_ERROR:
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
