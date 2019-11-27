import * as cloneDeep from 'lodash.clonedeep';

import { AsyncStateObjHelper } from 'libs/core/helpers';
import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models/state';

import { JobInfoViewField } from '../models';

import * as fromJobInfoViewEditorActions from '../actions/job-info-view-editor.actions';

export interface State {
  jobInfoFieldsAsyncObj: AsyncStateObj<JobInfoViewField[]>;
}

export const initialState: State = {
  jobInfoFieldsAsyncObj: generateDefaultAsyncStateObj<JobInfoViewField[]>([])
};

export function reducer(state = initialState, action: fromJobInfoViewEditorActions.Actions): State {
  switch (action.type) {
    case fromJobInfoViewEditorActions.GET_JOB_INFORMATION_FIELDS: {
      return AsyncStateObjHelper.loading(state, 'jobInfoFieldsAsyncObj');
    }
    case fromJobInfoViewEditorActions.GET_JOB_INFORMATION_FIELDS_SUCCESS: {
      return AsyncStateObjHelper.loadingSuccess(state, 'jobInfoFieldsAsyncObj', action.payload);
    }
    case fromJobInfoViewEditorActions.GET_JOB_INFORMATION_FIELDS_ERROR: {
      return AsyncStateObjHelper.loadingError(state, 'jobInfoFieldsAsyncObj');
    }
    case fromJobInfoViewEditorActions.TOGGLE_JOB_INFO_VIEW_FIELD: {
      const newJobInfoFieldsAsyncObj = cloneDeep(state.jobInfoFieldsAsyncObj);
      const jobInfoViewField = newJobInfoFieldsAsyncObj.obj.find(j => j.Name === action.payload.Name);

      jobInfoViewField.Checked = !jobInfoViewField.Checked;

      return {
        ...state,
        jobInfoFieldsAsyncObj: newJobInfoFieldsAsyncObj
      };
    }
    case fromJobInfoViewEditorActions.SET_ALL_JOB_INFO_VIEW_FIELDS: {
      const newJobInfoFieldsAsyncObj = cloneDeep(state.jobInfoFieldsAsyncObj);

      newJobInfoFieldsAsyncObj.obj = newJobInfoFieldsAsyncObj.obj
        .map(j => {

          if (j.Locked) {
            return j;
          }

          return {
            ...j,
            Checked: action.payload.checked
          };
        });

      return {
        ...state,
        jobInfoFieldsAsyncObj: newJobInfoFieldsAsyncObj
      };
    }
    case fromJobInfoViewEditorActions.RESET: {
        return {
          ...initialState
        };
    }
    default:
      return state;
  }
}

export const getJobInfoFieldsAsyncObj = (state: State) => state.jobInfoFieldsAsyncObj;

