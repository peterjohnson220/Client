import * as cloneDeep from 'lodash.clonedeep';

import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models/state';

import * as fromStandardReportsListPageActions from '../actions/standard-reports-list-page.actions';
import { StandardReportDetails } from '../models';

export interface State {
  standardReportDetailsAsync: AsyncStateObj<StandardReportDetails[]>;
  syncingReports: boolean;
}

const initialState: State = {
  standardReportDetailsAsync: generateDefaultAsyncStateObj<StandardReportDetails[]>([]),
  syncingReports: false
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
    case fromStandardReportsListPageActions.SYNC_STANDARD_REPORTS: {
      return {
        ...state,
        syncingReports: true
      };
    }
    case fromStandardReportsListPageActions.SYNC_STANDARD_REPORTS_SUCCESS:
    case fromStandardReportsListPageActions.SYNC_STANDARD_REPORTS_ERROR: {
      return {
        ...state,
        syncingReports: false
      };
    }
    default: {
      return state;
    }
  }
}

export const getStandardReportDetails = (state: State) => state.standardReportDetailsAsync;
export const getSyncingStandardReports = (state: State) => state.syncingReports;
