import * as cloneDeep from 'lodash.clonedeep';

import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models/state';

import * as fromDataViewActions from '../actions/data-view.actions';
import { Entity } from '../models';

export interface State {
  baseEntitiesAsync: AsyncStateObj<Entity[]>;
  savingUserReport: boolean;
  saveUserReportError: boolean;
  saveUserReportConflict: boolean;
}

const initialState: State = {
  baseEntitiesAsync: generateDefaultAsyncStateObj<Entity[]>([]),
  saveUserReportConflict: false,
  savingUserReport: false,
  saveUserReportError: false
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
    default: {
      return state;
    }
  }
}

export const getBaseEntitiesAsync = (state: State) => state.baseEntitiesAsync;
export const getSavingUserReport = (state: State) => state.savingUserReport;
export const getSaveUserReportError = (state: State) => state.saveUserReportError;
export const getSaveUserReportConflict = (state: State) => state.saveUserReportConflict;
