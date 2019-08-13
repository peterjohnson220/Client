import * as cloneDeep from 'lodash.clonedeep';
import { orderBy } from 'lodash';

import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models/state';

import * as fromDataViewActions from '../actions/data-view.actions';
import { Entity, UserDataView, Field } from '../models';

export interface State {
  baseEntitiesAsync: AsyncStateObj<Entity[]>;
  savingUserReport: boolean;
  saveUserReportError: boolean;
  saveUserReportConflict: boolean;
  userDataViewAsync: AsyncStateObj<UserDataView>;
  reportFieldsAsync: AsyncStateObj<Field[]>;
  editingUserReport: boolean;
  editUserReportError: boolean;
  editUserReportConflict: boolean;
  editUserReportSuccess: boolean;
  duplicatingUserReport: boolean;
  duplicateUserReportError: boolean;
  duplicateUserReportConflict: boolean;
  duplicateUserReportSuccess: boolean;
  savingReportFields: boolean;
  savingReportFieldsError: boolean;
  deleteUserReport: boolean;
  deleteUserReportSuccess: boolean;
}

const initialState: State = {
  baseEntitiesAsync: generateDefaultAsyncStateObj<Entity[]>([]),
  saveUserReportConflict: false,
  savingUserReport: false,
  saveUserReportError: false,
  userDataViewAsync: generateDefaultAsyncStateObj<UserDataView>(null),
  reportFieldsAsync: generateDefaultAsyncStateObj<Field[]>([]),
  editingUserReport: false,
  editUserReportError: false,
  editUserReportConflict: false,
  editUserReportSuccess: false,
  duplicatingUserReport: false,
  duplicateUserReportError: false,
  duplicateUserReportConflict: false,
  duplicateUserReportSuccess: false,
  savingReportFields: false,
  savingReportFieldsError: false,
  deleteUserReport: false,
  deleteUserReportSuccess: false
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
        userDataViewAsync: asyncStateObjClone
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
      return {
        ...state,
        userDataViewAsync: asyncStateObjClone
      };
    }
    case fromDataViewActions.GET_REPORT_FIELDS: {
      const asyncStateObjClone = cloneDeep(state.reportFieldsAsync);

      asyncStateObjClone.loading = true;
      asyncStateObjClone.loadingError = false;
      asyncStateObjClone.obj = [];
      return {
        ...state,
        reportFieldsAsync: asyncStateObjClone
      };
    }
    case fromDataViewActions.GET_REPORT_FIELDS_SUCCESS: {
      const asyncStateObjClone = cloneDeep(state.reportFieldsAsync);
      asyncStateObjClone.loading = false;
      asyncStateObjClone.obj = action.payload;

      return {
        ...state,
        reportFieldsAsync: asyncStateObjClone
      };
    }
    case fromDataViewActions.GET_REPORT_FIELDS_ERROR: {
      const asyncStateObjClone = cloneDeep(state.reportFieldsAsync);

      asyncStateObjClone.loading = false;
      asyncStateObjClone.loadingError = true;
      return {
        ...state,
        reportFieldsAsync: asyncStateObjClone
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
    case fromDataViewActions.REMOVE_SELECTED_FIELD: {
      const asyncStateObjClone = cloneDeep(state.reportFieldsAsync);
      const fieldToRemove = asyncStateObjClone.obj.find(x => x.DataElementId === action.payload.DataElementId);
      if (fieldToRemove) {
        fieldToRemove.IsSelected = false;
      }
      return {
        ...state,
        reportFieldsAsync: asyncStateObjClone
      };
    }
    case fromDataViewActions.SAVE_REPORT_FIELDS: {
      return {
        ...state,
        savingReportFields: true,
        savingReportFieldsError: false
      };
    }
    case fromDataViewActions.SAVE_REPORT_FIELDS_SUCCESS: {
      return {
        ...state,
        savingReportFields: false,
        savingReportFieldsError: false
      };
    }
    case fromDataViewActions.SAVE_REPORT_FIELDS_ERROR: {
      return {
        ...state,
        savingReportFields: false,
        savingReportFieldsError: true
      };
    }
    case fromDataViewActions.REORDER_FIELDS: {
      const asyncStateObjClone = cloneDeep(state.reportFieldsAsync);
      asyncStateObjClone.obj = asyncStateObjClone.obj.map(x => {
        const newFieldIndex = action.payload.findIndex(y => y.DataElementId === x.DataElementId);
        if (newFieldIndex !== -1) {
          x.Order = newFieldIndex + 1;
        }
        return x;
      });
      asyncStateObjClone.obj = orderBy(asyncStateObjClone.obj, 'Order');
      return {
        ...state,
        reportFieldsAsync: asyncStateObjClone
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
export const getReportFieldsAsync = (state: State) => state.reportFieldsAsync;
export const getEditingUserReport = (state: State) => state.editingUserReport;
export const getEditUserReportError = (state: State) => state.editUserReportError;
export const getEditUserReportConflict = (state: State) => state.editUserReportConflict;
export const getEditUserReportSuccess = (state: State) => state.editUserReportSuccess;
export const getDuplicatingUserReport = (state: State) => state.duplicatingUserReport;
export const getDuplicateUserReportError = (state: State) => state.duplicateUserReportError;
export const getDuplicateUserReportConflict = (state: State) => state.duplicateUserReportConflict;
export const getDuplicateUserReportSuccess = (state: State) => state.duplicateUserReportSuccess;
export const getSelectedFields = (state: State) => {
  if (state.reportFieldsAsync.obj) {
    return state.reportFieldsAsync.obj.filter((f: Field) => f.IsSelected === true);
  }
};
