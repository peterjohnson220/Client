import * as cloneDeep from 'lodash.clonedeep';

import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models/state';

import * as fromDataInsightsPageActions from '../actions/data-insights-page.actions';
import { StandardReport } from '../models';

export interface State {
  standardReportsAsync: AsyncStateObj<StandardReport[]>;
}

const initialState: State = {
  standardReportsAsync: {...generateDefaultAsyncStateObj<StandardReport[]>(), obj: [] }
};

export function reducer(state = initialState, action: fromDataInsightsPageActions.Actions): State {
  switch (action.type) {
    case fromDataInsightsPageActions.GET_STANDARD_REPORTS: {
      const standardReportsAsyncClone = cloneDeep(state.standardReportsAsync);

      standardReportsAsyncClone.loading = true;
      standardReportsAsyncClone.obj = null;
      standardReportsAsyncClone.loadingError = false;

      return {
        ...state,
        standardReportsAsync: standardReportsAsyncClone
      };
    }
    case fromDataInsightsPageActions.GET_STANDARD_REPORTS_SUCCESS: {
      const standardReportsAsyncClone = cloneDeep(state.standardReportsAsync);

      standardReportsAsyncClone.loading = false;
      standardReportsAsyncClone.obj = action.payload;

      return {
        ...state,
        standardReportsAsync: standardReportsAsyncClone
      };
    }
    case fromDataInsightsPageActions.GET_STANDARD_REPORTS_ERROR: {
      const standardReportsAsyncClone = cloneDeep(state.standardReportsAsync);

      standardReportsAsyncClone.loadingError = true;

      return {
        ...state,
        standardReportsAsync: standardReportsAsyncClone
      };
    }
    default: {
      return state;
    }
  }
}

export const getStandardReportsAsync = (state: State) => state.standardReportsAsync;
