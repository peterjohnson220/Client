import * as cloneDeep from 'lodash.clonedeep';

import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models/state';

import * as fromDataInsightsPageActions from '../actions/data-insights-page.actions';
import { Workbook } from '../models';

export interface State {
  standardWorkbooksAsync: AsyncStateObj<Workbook[]>;
  showStandardReportsSection: boolean;
}

const initialState: State = {
  standardWorkbooksAsync: generateDefaultAsyncStateObj<Workbook[]>([]),
  showStandardReportsSection: false
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
    case fromDataInsightsPageActions.GET_STANDARD_REPORTS_DISPLAY_SETTING_SUCCESS: {
      return {
        ...state,
        showStandardReportsSection: action.payload.settingValue
      };
    }
    case fromDataInsightsPageActions.GET_STANDARD_REPORTS_DISPLAY_SETTING_ERROR: {
      return {
        ...state,
        showStandardReportsSection: true
      };
    }
    default: {
      return state;
    }
  }
}

export const getStandardWorkbooksAsync = (state: State) => state.standardWorkbooksAsync;
export const getShowStandardReportsSection = (state: State) => state.showStandardReportsSection;
