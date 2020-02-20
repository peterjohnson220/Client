import * as cloneDeep from 'lodash.clonedeep';

import * as fromDataViewActions from '../actions/data-view.actions';

export interface State {
  savingUserReport: boolean;
  saveUserReportError: boolean;
  saveUserReportConflict: boolean;
  saveUserReportSuccess: boolean;
}

export const initialState = {
  saveUserReportConflict: false,
  savingUserReport: false,
  saveUserReportError: false,
  saveUserReportSuccess: false
};

export function reducer(state = initialState, action: fromDataViewActions.Actions): State {
  switch (action.type) {
    case fromDataViewActions.SAVE_USER_REPORT: {
      return {
        ...state,
        savingUserReport: true,
        saveUserReportError: false,
        saveUserReportConflict: false,
        saveUserReportSuccess: false
      };
    }
    case fromDataViewActions.SAVE_USER_REPORT_SUCCESS: {
      return {
        ...state,
        savingUserReport: false,
        saveUserReportError: false,
        saveUserReportConflict: false,
        saveUserReportSuccess: true
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

export const getSavingUserReport = (state: State) => state.savingUserReport;
export const getSaveUserReportError = (state: State) => state.saveUserReportError;
export const getSaveUserReportConflict = (state: State) => state.saveUserReportConflict;
export const getSaveUserReportSuccess = (state: State) => state.saveUserReportSuccess;
