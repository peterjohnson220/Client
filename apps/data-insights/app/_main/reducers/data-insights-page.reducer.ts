import cloneDeep from 'lodash/cloneDeep';

import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models/state';

import * as fromDataInsightsPageActions from '../actions/data-insights-page.actions';
import { Workbook } from '../models';

export interface State {
  standardWorkbooksAsync: AsyncStateObj<Workbook[]>;
}

const initialState: State = {
  standardWorkbooksAsync: generateDefaultAsyncStateObj<Workbook[]>([])
};

export function reducer(state = initialState, action: fromDataInsightsPageActions.Actions): State {
  switch (action.type) {
    case fromDataInsightsPageActions.GET_STANDARD_REPORTS: {
      const standardWorkbooksAsyncClone = cloneDeep(state.standardWorkbooksAsync);

      standardWorkbooksAsyncClone.loading = true;
      standardWorkbooksAsyncClone.obj = null;
      standardWorkbooksAsyncClone.loadingError = false;

      return {
        ...state,
        standardWorkbooksAsync: standardWorkbooksAsyncClone
      };
    }
    case fromDataInsightsPageActions.GET_STANDARD_REPORTS_SUCCESS: {
      const standardWorkbooksAsyncClone = cloneDeep(state.standardWorkbooksAsync);

      standardWorkbooksAsyncClone.loading = false;
      standardWorkbooksAsyncClone.obj = action.payload;

      return {
        ...state,
        standardWorkbooksAsync: standardWorkbooksAsyncClone
      };
    }
    case fromDataInsightsPageActions.GET_STANDARD_REPORTS_ERROR: {
      const standardWorkbooksAsyncClone = cloneDeep(state.standardWorkbooksAsync);

      standardWorkbooksAsyncClone.loadingError = true;

      return {
        ...state,
        standardWorkbooksAsync: standardWorkbooksAsyncClone
      };
    }
    default: {
      return state;
    }
  }
}

export const getStandardWorkbooksAsync = (state: State) => state.standardWorkbooksAsync;
