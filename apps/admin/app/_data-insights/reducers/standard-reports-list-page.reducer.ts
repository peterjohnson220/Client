import * as cloneDeep from 'lodash.clonedeep';

import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models/state';

import * as fromStandardReportsListPageActions from '../actions/standard-reports-list-page.actions';
import { StandardReportDetails } from '../models';

export interface State {
  standardReportDetailsAsync: AsyncStateObj<StandardReportDetails[]>;
}

const initialState: State = {
  standardReportDetailsAsync: generateDefaultAsyncStateObj<StandardReportDetails[]>([])
};

export function reducer(state = initialState, action: fromStandardReportsListPageActions.Actions): State {
  switch (action.type) {
    case fromStandardReportsListPageActions.GET_STANDARD_REPORT_DETAILS: {
      const standardReportDetailsAsyncClone = cloneDeep(state.standardReportDetailsAsync);

      standardReportDetailsAsyncClone.loading = true;
      standardReportDetailsAsyncClone.obj = null;
      standardReportDetailsAsyncClone.loadingError = false;

      return {
        ...state,
        standardReportDetailsAsync: standardReportDetailsAsyncClone
      };
    }
    case fromStandardReportsListPageActions.GET_STANDARD_REPORT_DETAILS_SUCCESS: {
      const standardReportDetailsAsyncClone = cloneDeep(state.standardReportDetailsAsync);

      standardReportDetailsAsyncClone.loading = false;
      standardReportDetailsAsyncClone.obj = action.payload;

      return {
        ...state,
        standardReportDetailsAsync: standardReportDetailsAsyncClone
      };
    }
    case fromStandardReportsListPageActions.GET_STANDARD_REPORT_DETAILS_ERROR: {
      const standardReportDetailsAsyncClone = cloneDeep(state.standardReportDetailsAsync);

      standardReportDetailsAsyncClone.loadingError = true;

      return {
        ...state,
        standardReportDetailsAsync: standardReportDetailsAsyncClone
      };
    }
    default: {
      return state;
    }
  }
}

export const getStandardReportDetails = (state: State) => state.standardReportDetailsAsync;
