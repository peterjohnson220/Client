import { UserAssignedRole } from 'libs/models/security';
import { AddCompanyRoleForm } from 'libs/models/admin';

import { RoleApiResponse, UserRoleTabState } from '../constants/user-role.constants';
import * as fromUserRoleViewActions from '../actions/user-role-view.action';
import cloneDeep from 'lodash/cloneDeep';

export interface IUserRoleState {
  currentTab: UserRoleTabState;
  currentUserRole: UserAssignedRole;
  currentUserRoleDefaultState: UserAssignedRole;
  roles: UserAssignedRole[];
  companyRolesError: string;
  addCompanyRoleError: string;
  addCompanyRoleModalIsOpen: boolean;
  addCompanyRoleForm: AddCompanyRoleForm;
  apiSaveResponse: string;
  disableSaveButton: boolean;
}

export const initialState: IUserRoleState = {
  currentTab: UserRoleTabState.FUNCTION,
  currentUserRole: undefined,
  currentUserRoleDefaultState: undefined,
  roles: undefined,
  companyRolesError: undefined,
  addCompanyRoleError: undefined,
  addCompanyRoleModalIsOpen: false,
  addCompanyRoleForm: null,
  apiSaveResponse: undefined,
  disableSaveButton: false
};

export function reducer(state = initialState, action: fromUserRoleViewActions.Actions): IUserRoleState {
  const noApiResponseState = {
    ...state,
    apiSaveResponse: undefined
  };
  switch (action.type) {
    case fromUserRoleViewActions.FIELD_CHANGE: {
      return {
        ...noApiResponseState,
        addCompanyRoleForm: action.payload
      };
    }
    case fromUserRoleViewActions.UPDATE_USER_ROLE_TAB_STATE: {
      return {
        ...noApiResponseState,
        currentTab: action.payload as UserRoleTabState
      };
    }
    case fromUserRoleViewActions.UPDATE_CURRENT_USER_ROLE: {
      return {
        ...noApiResponseState,
        currentUserRole: action.payload as UserAssignedRole,
        currentUserRoleDefaultState: action.payload as UserAssignedRole
      };
    }
    case fromUserRoleViewActions.UPDATE_COMPANY_ROLES: {
      return {
        ...noApiResponseState,
        roles: action.payload as UserAssignedRole[]
      };
    }
    case fromUserRoleViewActions.LOAD_COMPANY_ROLES_ERROR: {
      return {
        ...noApiResponseState,
        companyRolesError: action.payload as string
      };
    }
    case fromUserRoleViewActions.LOAD_COMPANY_ROLES: {
      return {
        ...noApiResponseState,
        companyRolesError: undefined
      };
    }
    case fromUserRoleViewActions.ADD_COMPANY_ROLE: {
      return {
        ...noApiResponseState,
        addCompanyRoleError: undefined
      };
    }
    case fromUserRoleViewActions.ADD_COMPANY_ROLE_ERROR: {
      return {
        ...noApiResponseState,
        addCompanyRoleError: (action.payload !== null && action.payload.error !== null)
          ? action.payload.error.error.message
          : 'An error has occurred.'
      };
    }
    case fromUserRoleViewActions.OPEN_ADD_COMPANY_ROLE_MODAL: {
      return {
        ...noApiResponseState,
        addCompanyRoleModalIsOpen: true
      };
    }
    case fromUserRoleViewActions.CLOSE_ADD_COMPANY_ROLE_MODAL: {
      return {
        ...noApiResponseState,
        addCompanyRoleModalIsOpen: false
      };
    }
    case fromUserRoleViewActions.SAVE_ROLE_SUCCESS: {
      return {
        ...noApiResponseState,
        apiSaveResponse: RoleApiResponse.Success,
        disableSaveButton: false
      };
    }
    case fromUserRoleViewActions.SAVE_ROLE_ERROR: {
      return {
        ...noApiResponseState,
        apiSaveResponse: RoleApiResponse.Error,
        disableSaveButton: false
      };
    }
    case fromUserRoleViewActions.DISABLE_SAVE_BUTTON: {
      return {
        ...noApiResponseState,
        disableSaveButton: true
      };
    }
    case fromUserRoleViewActions.DISCARD_ROLE_CHANGES: {
      return {
        ...noApiResponseState,
        currentUserRole: cloneDeep(noApiResponseState.currentUserRoleDefaultState)
      };
    }
    case fromUserRoleViewActions.DELETE_ROLE_SUCCESS: {
      return {
        ...noApiResponseState,
        roles: state.roles.filter(r => r.RoleId !== action.payload),
        apiSaveResponse: RoleApiResponse.Success
      };
    }
    case fromUserRoleViewActions.DELETE_ROLE_ERROR: {
      return {
        ...noApiResponseState,
        apiSaveResponse: action.payload
      };
    }
    default: {
      return noApiResponseState;
    }
  }
}

export const getUserRoleViewState = (state: IUserRoleState) => state;
export const getUserRoleCurrentTab = (state: IUserRoleState) => state.currentTab;
export const getCurrentUserRole = (state: IUserRoleState) => state.currentUserRole;
export const getCompanyRoles = (state: IUserRoleState) => state.roles;
export const getAddCompanyRoleModalIsOpen = (state: IUserRoleState) => state.addCompanyRoleModalIsOpen;
export const getAddCompanyRoleForm = (state: IUserRoleState) => state.addCompanyRoleForm;
export const getAddCompanyRoleError = (state: IUserRoleState) => state.addCompanyRoleError;
export const getRoleApiResponse = (state: IUserRoleState) => state.apiSaveResponse;
export const getSaveButtonDisabled = (state: IUserRoleState) => state.disableSaveButton;

