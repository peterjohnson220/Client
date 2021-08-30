import { AsyncStateObjHelper } from 'libs/core';
import { AsyncStateObj, generateDefaultAsyncStateObj, GenericKeyValue } from 'libs/models';
import { JobInsights } from 'libs/models/payfactors-api';

import * as fromJobInsightsActions from '../actions/job-insights.actions';

export interface State {
  jobInsights: AsyncStateObj<JobInsights>;
  udfFields: AsyncStateObj<GenericKeyValue<string, string>[]>;
}

export const initialState: State = {
  jobInsights: generateDefaultAsyncStateObj<JobInsights>(null),
  udfFields: generateDefaultAsyncStateObj<GenericKeyValue<string, string>[]>(null)
};

export function reducer(state = initialState, action: fromJobInsightsActions.Actions): State {
  switch (action.type) {
    case fromJobInsightsActions.LOAD_JOB_INSIGHTS:
    case fromJobInsightsActions.LOAD_JOB_INSIGHTS_FOR_PRINT: {
      return AsyncStateObjHelper.loading(state, 'jobInsights');
    }
    case fromJobInsightsActions.LOAD_JOB_INSIGHTS_SUCCESS: {
      return AsyncStateObjHelper.loadingSuccess(state, 'jobInsights', action.payload);
    }
    case fromJobInsightsActions.LOAD_JOB_INSIGHTS_ERROR: {
      return AsyncStateObjHelper.loadingError(state, 'jobInsights');
    }
    case fromJobInsightsActions.LOAD_CUSTOM_JOB_FIELDS: {
      return AsyncStateObjHelper.loading(state, 'udfFields');
    }
    case fromJobInsightsActions.LOAD_CUSTOM_JOB_FIELDS_SUCCESS: {
      return AsyncStateObjHelper.loadingSuccess(state, 'udfFields', action.payload);
    }
    case fromJobInsightsActions.LOAD_CUSTOM_JOB_FIELDS_ERROR: {
      return AsyncStateObjHelper.loadingError(state, 'udfFields');
    }
    default: {
      return state;
    }
  }
}

export const getJobInsights = (state: State) => state.jobInsights;
export const getJobCustomFields = (state: State) => state.udfFields;
