import cloneDeep from 'lodash/cloneDeep';

import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models/state';

import * as fromStandardReportsListPageActions from '../actions/standard-reports-list-page.actions';
import { StandardReportDetails } from '../models';
import { PayfactorsApiModelMapper } from '../helpers';

export interface State {
  standardReportDetailsAsync: AsyncStateObj<StandardReportDetails[]>;
  syncingReports: boolean;
  savingReport: boolean;
}

const initialState: State = {
  standardReportDetailsAsync: generateDefaultAsyncStateObj<StandardReportDetails[]>([]),
  syncingReports: false,
  savingReport: false
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
    case fromStandardReportsListPageActions.UPDATE_REPORT_DETAILS: {
      return {
        ...state,
        savingReport: true
      };
    }
    case fromStandardReportsListPageActions.UPDATE_REPORT_DETAILS_SUCCESS: {
      const standardReportDetailsAsyncClone = cloneDeep(state.standardReportDetailsAsync);
      let updatedReport = standardReportDetailsAsyncClone.obj.find((x: StandardReportDetails) =>
        x.Id === action.payload.Id);
      updatedReport = PayfactorsApiModelMapper.updateStandardReportDetails(updatedReport, action.payload);
      return {
        ...state,
        savingReport: false,
        standardReportDetailsAsync: standardReportDetailsAsyncClone
      };
    }
    case fromStandardReportsListPageActions.UPDATE_REPORT_DETAILS_ERROR: {
      return {
        ...state,
        savingReport: false
      };
    }
    default: {
      return state;
    }
  }
}

export const getStandardReportDetails = (state: State) => state.standardReportDetailsAsync;
export const getSyncingStandardReports = (state: State) => state.syncingReports;
export const getSavingReport = (state: State) => state.savingReport;
