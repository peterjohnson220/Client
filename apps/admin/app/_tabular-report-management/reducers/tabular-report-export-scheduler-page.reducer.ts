import cloneDeep from 'lodash/cloneDeep';

import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models/state';
import { Workbook } from 'libs/features/reports/models';

import * as fromTabularReportExportSchedulerPageActions from '../actions/tabular-report-export-scheduler-page.actions';

export interface State {
  tabularReportsAsync: AsyncStateObj<Workbook[]>;
}

const initialState: State = {
  tabularReportsAsync: generateDefaultAsyncStateObj<any[]>([])
};

export function reducer(state = initialState, action: fromTabularReportExportSchedulerPageActions.Actions): State {
  switch (action.type) {
    case fromTabularReportExportSchedulerPageActions.GET_TABULAR_REPORTS: {
      const tabularReportsAsyncClone = cloneDeep(state.tabularReportsAsync);
      tabularReportsAsyncClone.loading = true;
      tabularReportsAsyncClone.obj = null;
      tabularReportsAsyncClone.loadingError = false;

      return {
        ...state,
        tabularReportsAsync: tabularReportsAsyncClone
      };
    }
    case fromTabularReportExportSchedulerPageActions.GET_TABULAR_REPORTS_SUCCESS: {
      const tabularReportsAsyncClone = cloneDeep(state.tabularReportsAsync);
      tabularReportsAsyncClone.loading = false;
      tabularReportsAsyncClone.obj = action.payload;

      return {
        ...state,
        tabularReportsAsync: tabularReportsAsyncClone
      };
    }
    case fromTabularReportExportSchedulerPageActions.GET_TABULAR_REPORTS_ERROR: {
      const tabularReportsAsyncClone = cloneDeep(state.tabularReportsAsync);
      tabularReportsAsyncClone.loading = false;
      tabularReportsAsyncClone.loadingError = true;

      return {
        ...state,
        tabularReportsAsync: tabularReportsAsyncClone
      };
    }
    default:
      return state;
  }
}

export const getTabularReportsAsync = (state: State) => state.tabularReportsAsync;

