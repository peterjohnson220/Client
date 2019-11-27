import * as cloneDeep from 'lodash.clonedeep';

import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models/state';

import * as fromDataViewActions from '../actions/data-view.actions';
import { Entity, UserDataView, SharedDataViewUser } from '../models';

export interface State {
  baseEntitiesAsync: AsyncStateObj<Entity[]>;
  savingUserReport: boolean;
  saveUserReportError: boolean;
  saveUserReportConflict: boolean;
  userDataViewAsync: AsyncStateObj<UserDataView>;
  editingUserReport: boolean;
  editUserReportError: boolean;
  editUserReportConflict: boolean;
  editUserReportSuccess: boolean;
  duplicatingUserReport: boolean;
  duplicateUserReportError: boolean;
  duplicateUserReportConflict: boolean;
  duplicateUserReportSuccess: boolean;
  deleteUserReport: boolean;
  deleteUserReportSuccess: boolean;
  exportingUserReport: boolean;
  exportEventId: number;
  shareableUsersAsync: AsyncStateObj<SharedDataViewUser[]>;
  sharedUserPermissionsAsync: AsyncStateObj<SharedDataViewUser[]>;
  sharedUserPermissionsLoaded: boolean;
  loadingErrorMessage: string;
}

const initialState: State = {
  baseEntitiesAsync: generateDefaultAsyncStateObj<Entity[]>([]),
  saveUserReportConflict: false,
  savingUserReport: false,
  saveUserReportError: false,
  userDataViewAsync: generateDefaultAsyncStateObj<UserDataView>(null),
  editingUserReport: false,
  editUserReportError: false,
  editUserReportConflict: false,
  editUserReportSuccess: false,
  duplicatingUserReport: false,
  duplicateUserReportError: false,
  duplicateUserReportConflict: false,
  duplicateUserReportSuccess: false,
  deleteUserReport: false,
  deleteUserReportSuccess: false,
  exportingUserReport: false,
  exportEventId : null,
  shareableUsersAsync: generateDefaultAsyncStateObj<SharedDataViewUser[]>([]),
  sharedUserPermissionsAsync: generateDefaultAsyncStateObj<SharedDataViewUser[]>([]),
  sharedUserPermissionsLoaded: false,
  loadingErrorMessage: ''
};

export function reducer(state = initialState, action: fromDataViewActions.Actions): State {
  switch (action.type) {
    case fromDataViewActions.GET_BASE_ENTITIES: {
      const asyncStateObjClone = cloneDeep(state.baseEntitiesAsync);

      asyncStateObjClone.loading = true;
      asyncStateObjClone.loadingError = false;
      return {
        ...state,
        baseEntitiesAsync: asyncStateObjClone
      };
    }
    case fromDataViewActions.GET_BASE_ENTITIES_SUCCESS: {
      const asyncStateObjClone = cloneDeep(state.baseEntitiesAsync);
      asyncStateObjClone.loading = false;
      asyncStateObjClone.obj = action.payload;

      return {
        ...state,
        baseEntitiesAsync: asyncStateObjClone
      };
    }
    case fromDataViewActions.GET_BASE_ENTITIES_ERROR: {
      const asyncStateObjClone = cloneDeep(state.baseEntitiesAsync);

      asyncStateObjClone.loading = false;
      asyncStateObjClone.loadingError = true;
      return {
        ...state,
        baseEntitiesAsync: asyncStateObjClone
      };
    }
    case fromDataViewActions.SAVE_USER_REPORT: {
      return {
        ...state,
        savingUserReport: true,
        saveUserReportError: false,
        saveUserReportConflict: false
      };
    }
    case fromDataViewActions.SAVE_USER_REPORT_SUCCESS: {
      return {
        ...state,
        savingUserReport: false,
        saveUserReportError: false,
        saveUserReportConflict: false
      };
    }
    case fromDataViewActions.SAVE_USER_REPORT_ERROR: {
      return {
        ...state,
        savingUserReport: false,
        saveUserReportError: true,
        saveUserReportConflict: false
      };
    }
    case fromDataViewActions.SAVE_USER_REPORT_CONFLICT_ERROR: {
      return {
        ...state,
        savingUserReport: false,
        saveUserReportError: false,
        saveUserReportConflict: true
      };
    }
    case fromDataViewActions.GET_USER_DATA_VIEW: {
      const asyncStateObjClone = cloneDeep(state.userDataViewAsync);
      asyncStateObjClone.loading = true;
      asyncStateObjClone.loadingError = false;
      return {
        ...state,
        userDataViewAsync: asyncStateObjClone,
        sharedUserPermissionsLoaded: false
      };
    }
    case fromDataViewActions.GET_USER_DATA_VIEW_SUCCESS: {
      const asyncStateObjClone = cloneDeep(state.userDataViewAsync);
      asyncStateObjClone.loading = false;
      asyncStateObjClone.obj = action.payload;
      return {
        ...state,
        userDataViewAsync: asyncStateObjClone
      };
    }
    case fromDataViewActions.GET_USER_DATA_VIEW_ERROR: {
      const asyncStateObjClone = cloneDeep(state.userDataViewAsync);
      asyncStateObjClone.loading = false;
      asyncStateObjClone.loadingError = true;
      let errorMessage = '';
      if (action.payload.status === 401) {
        errorMessage = 'Sorry, you do not have access to this data view';
      } else {
        errorMessage = 'Error loading this data view';
      }
      return {
        ...state,
        userDataViewAsync: asyncStateObjClone,
        loadingErrorMessage: errorMessage
      };
    }
    case fromDataViewActions.EDIT_USER_REPORT: {
      return {
        ...state,
        editingUserReport: true,
        editUserReportError: false,
        editUserReportConflict: false,
        editUserReportSuccess: false
      };
    }
    case fromDataViewActions.EDIT_USER_REPORT_SUCCESS: {
      const asyncStateObjClone = cloneDeep(state.userDataViewAsync);
      asyncStateObjClone.obj.Name = action.payload.Name;
      asyncStateObjClone.obj.Summary = action.payload.Summary;
      return {
        ...state,
        editingUserReport: false,
        editUserReportError: false,
        editUserReportConflict: false,
        editUserReportSuccess: true,
        userDataViewAsync: asyncStateObjClone
      };
    }
    case fromDataViewActions.EDIT_USER_REPORT_ERROR: {
      return {
        ...state,
        editingUserReport: false,
        editUserReportError: true,
        editUserReportConflict: false
      };
    }
    case fromDataViewActions.EDIT_USER_REPORT_CONFLICT_ERROR: {
      return {
        ...state,
        editingUserReport: false,
        editUserReportError: false,
        editUserReportConflict: true
      };
    }
    case fromDataViewActions.DUPLICATE_USER_REPORT: {
      return {
        ...state,
        duplicatingUserReport: true,
        duplicateUserReportError: false,
        duplicateUserReportConflict: false,
        duplicateUserReportSuccess: false
      };
    }
    case fromDataViewActions.DUPLICATE_USER_REPORT_SUCCESS: {
      return {
        ...state,
        duplicatingUserReport: false,
        duplicateUserReportError: false,
        duplicateUserReportConflict: false,
        duplicateUserReportSuccess: true
      };
    }
    case fromDataViewActions.DUPLICATE_USER_REPORT_ERROR: {
      return {
        ...state,
        duplicatingUserReport: false,
        duplicateUserReportError: true,
        duplicateUserReportConflict: false,
        duplicateUserReportSuccess: false
      };
    }
    case fromDataViewActions.DUPLICATE_USER_REPORT_CONFLICT_ERROR: {
      return {
        ...state,
        duplicatingUserReport: false,
        duplicateUserReportError: false,
        duplicateUserReportConflict: true,
        duplicateUserReportSuccess: false
      };
    }
    case fromDataViewActions.DELETE_USER_REPORT: {
      return {
        ...state,
        deleteUserReport: true,
        deleteUserReportSuccess: false
      };
    }
    case fromDataViewActions.DELETE_USER_REPORT_SUCCESS: {
      return {
        ...state,
        deleteUserReport: false,
        deleteUserReportSuccess: true
      };
    }
    case fromDataViewActions.EXPORT_USER_REPORT: {
      return {
        ...state,
        exportingUserReport: true
      };
    }

    case fromDataViewActions.EXPORT_USER_REPORT_SUCCESS: {
      let eventIdStateClone = cloneDeep(state.exportEventId);
      eventIdStateClone = action.payload;
      return {
        ...state,
        exportEventId: eventIdStateClone
      };
    }

    case fromDataViewActions.EXPORTING_COMPLETE: {
      return {
        ...state,
        exportingUserReport: false,
        exportEventId: null
      };
    }

    case fromDataViewActions.GET_EXPORTING_USER_REPORT_SUCCESS: {
      let exportingUserReportStateClone = cloneDeep(state.exportingUserReport);
      let eventIdStateClone = cloneDeep(state.exportEventId);
      exportingUserReportStateClone = !!action.payload;
      eventIdStateClone = !!action.payload ? action.payload.EventId : null;
      return {
        ...state,
        exportingUserReport: exportingUserReportStateClone,
        exportEventId: eventIdStateClone
      };
    }
    case fromDataViewActions.GET_SHAREABLE_USERS: {
      const asyncStateObjClone = cloneDeep(state.shareableUsersAsync);

      asyncStateObjClone.loading = true;
      asyncStateObjClone.loadingError = false;
      return {
        ...state,
        shareableUsersAsync: asyncStateObjClone
      };
    }
    case fromDataViewActions.GET_SHAREABLE_USERS_SUCCESS: {
      const asyncStateObjClone = cloneDeep(state.shareableUsersAsync);

      asyncStateObjClone.loading = false;
      asyncStateObjClone.obj = action.payload;
      asyncStateObjClone.loadingError = false;
      return {
        ...state,
        shareableUsersAsync: asyncStateObjClone
      };
    }
    case fromDataViewActions.GET_SHAREABLE_USERS_ERROR: {
      const asyncStateObjClone = cloneDeep(state.shareableUsersAsync);

      asyncStateObjClone.loading = false;
      asyncStateObjClone.loadingError = true;
      return {
        ...state,
        shareableUsersAsync: asyncStateObjClone
      };
    }
    case fromDataViewActions.GET_SHARE_PERMISSIONS: {
      const asyncStateObjClone = cloneDeep(state.sharedUserPermissionsAsync);

      asyncStateObjClone.loading = true;
      asyncStateObjClone.loadingError = false;
      asyncStateObjClone.obj = [];
      return {
        ...state,
        sharedUserPermissionsAsync: asyncStateObjClone
      };
    }
    case fromDataViewActions.GET_SHARE_PERMISSIONS_SUCCESS: {
      const asyncStateObjClone = cloneDeep(state.sharedUserPermissionsAsync);
      const sharedUsers = [];
      action.payload.forEach(function(user) {
        const matchingUser = state.shareableUsersAsync.obj.find(x => x.UserId === user.UserId);
        if (!!matchingUser) {
          sharedUsers.push({
            ...matchingUser,
            CanEdit: user.CanEdit
          });
        }
      });

      asyncStateObjClone.loading = false;
      asyncStateObjClone.obj = sharedUsers;
      return {
        ...state,
        sharedUserPermissionsAsync: asyncStateObjClone,
        sharedUserPermissionsLoaded: true
      };
    }
    case fromDataViewActions.SAVE_SHARE_PERMISSIONS_SUCCESS: {
      const asyncStateObjClone = cloneDeep(state.sharedUserPermissionsAsync);

      asyncStateObjClone.loading = false;
      asyncStateObjClone.obj = action.payload;
      return {
        ...state,
        sharedUserPermissionsAsync: asyncStateObjClone
      };
    }
    case fromDataViewActions.GET_SHARE_PERMISSIONS_ERROR: {
      const asyncStateObjClone = cloneDeep(state.sharedUserPermissionsAsync);

      asyncStateObjClone.loading = false;
      asyncStateObjClone.loadingError = true;
      return {
        ...state,
        sharedUserPermissionsAsync: asyncStateObjClone
      };
    }
    case fromDataViewActions.REMOVE_SHARE_PERMISSION_SUCCESS: {
      const asyncStateObjClone = cloneDeep(state.sharedUserPermissionsAsync);

      asyncStateObjClone.obj = asyncStateObjClone.obj.filter(x => x.UserId !== action.payload.UserId);
      return {
        ...state,
        sharedUserPermissionsAsync: asyncStateObjClone
      };
    }
    default: {
      return state;
    }
  }
}

export const getBaseEntitiesAsync = (state: State) => state.baseEntitiesAsync;
export const getSavingUserReport = (state: State) => state.savingUserReport;
export const getSaveUserReportError = (state: State) => state.saveUserReportError;
export const getSaveUserReportConflict = (state: State) => state.saveUserReportConflict;
export const getUserDataViewAsync = (state: State) => state.userDataViewAsync;
export const getEditingUserReport = (state: State) => state.editingUserReport;
export const getEditUserReportError = (state: State) => state.editUserReportError;
export const getEditUserReportConflict = (state: State) => state.editUserReportConflict;
export const getEditUserReportSuccess = (state: State) => state.editUserReportSuccess;
export const getDuplicatingUserReport = (state: State) => state.duplicatingUserReport;
export const getDuplicateUserReportError = (state: State) => state.duplicateUserReportError;
export const getDuplicateUserReportConflict = (state: State) => state.duplicateUserReportConflict;
export const getDuplicateUserReportSuccess = (state: State) => state.duplicateUserReportSuccess;
export const getExportingUserReport = (state: State) => state.exportingUserReport;
export const getExportEventId = (state: State) => state.exportEventId;
export const getShareableUsersAsync = (state: State) => state.shareableUsersAsync;
export const getSharedUserPermissionsAsync = (state: State) => state.sharedUserPermissionsAsync;
export const getSharedUserPermissionsLoaded = (state: State) => state.sharedUserPermissionsLoaded;
export const getLoadingErrorMessage = (state: State) => state.loadingErrorMessage;
