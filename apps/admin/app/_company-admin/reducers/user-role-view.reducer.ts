import { UserAssignedRole } from 'libs/models/security';
import { AddCompanyRoleForm } from 'libs/models/admin';

import {SaveButtonText, UserRoleTabState} from '../constants/user-role.constants';
import * as fromUserRoleViewActions from '../actions/user-role-view.action';

export interface IUserRoleState {
  CurrentTab: UserRoleTabState;
  CurrentUserRole: UserAssignedRole;
  CompanyRoles: UserAssignedRole[];
  CompanyRolesError: string;
  AddCompanyRoleError: string;
  AddCompanyRoleModalIsOpen: boolean;
  AddCompanyRoleForm: AddCompanyRoleForm;
  FunctionSaveButtonText: string;
}

export const initialState: IUserRoleState = {
  CurrentTab: UserRoleTabState.DATA_ACCESS,
  CurrentUserRole: undefined,
  CompanyRoles: undefined,
  CompanyRolesError: undefined,
  AddCompanyRoleError: undefined,
  AddCompanyRoleModalIsOpen: false,
  AddCompanyRoleForm: null,
  FunctionSaveButtonText: SaveButtonText.Save
};

export function reducer(state = initialState, action: fromUserRoleViewActions.Actions): IUserRoleState {
  switch (action.type) {
    case fromUserRoleViewActions.FIELD_CHANGE: {
      return {
        ...state,
        AddCompanyRoleForm: action.payload
      };
    }
    case fromUserRoleViewActions.UPDATE_USER_ROLE_TAB_STATE: {
      return {
        ...state,
        CurrentTab: action.payload as UserRoleTabState
      };
    }
    case fromUserRoleViewActions.UPDATE_CURRENT_USER_ROLE: {
      return {
        ...state,
        CurrentUserRole: action.payload as UserAssignedRole
      };
    }
    case fromUserRoleViewActions.UPDATE_COMPANY_ROLES: {
      return {
        ...state,
        CompanyRoles: action.payload as UserAssignedRole[]
      };
    }
    case fromUserRoleViewActions.LOAD_COMPANY_ROLES_ERROR: {
      return {
        ...state,
       CompanyRolesError: action.payload as string
      };
    }
    case fromUserRoleViewActions.LOAD_COMPANY_ROLES: {
      return {
        ...state,
        CompanyRolesError: undefined
      };
    }
    case fromUserRoleViewActions.ADD_COMPANY_ROLE: {
      return {
        ...state,
        AddCompanyRoleError: undefined
      };
    }
    case fromUserRoleViewActions.ADD_COMPANY_ROLE_ERROR: {
      return {
        ...state,
        AddCompanyRoleError: (action.payload !== null && action.payload.error !== null)
          ? action.payload.error.error.message
          : 'An error has occurred.'
      };
    }
    case fromUserRoleViewActions.OPEN_ADD_COMPANY_ROLE_MODAL: {
      return {
        ...state,
        AddCompanyRoleModalIsOpen: true
      };
    }
    case fromUserRoleViewActions.CLOSE_ADD_COMPANY_ROLE_MODAL: {
      return {
        ...state,
        AddCompanyRoleModalIsOpen: false
      };
    }
    case fromUserRoleViewActions.SET_FUNCTION_TAB_SAVE_BUTTON_TEXT: {
      return {
        ...state,
        FunctionSaveButtonText:  action.payload as string
      };
    }
    default: {
      return state;
    }
  }
}

export const getUserRoleViewState = (state: IUserRoleState) => state;
export const getUserRoleCurrentTab = (state: IUserRoleState) => state.CurrentTab;
export const getCurrentUserRole = (state: IUserRoleState) => state.CurrentUserRole;
export const getCompanyRoles = (state: IUserRoleState) => state.CompanyRoles;
export const getAddCompanyRoleModalIsOpen = (state: IUserRoleState) => state.AddCompanyRoleModalIsOpen;
export const getAddCompanyRoleForm = (state: IUserRoleState) => state.AddCompanyRoleForm;
export const getAddCompanyRoleError = (state: IUserRoleState) => state.AddCompanyRoleError;
export const getFunctionSaveButtonText = (state: IUserRoleState) => state.FunctionSaveButtonText;
