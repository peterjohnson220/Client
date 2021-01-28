import cloneDeep from 'lodash/cloneDeep';

import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models/state';
import { Workbook } from 'libs/features/surveys/reports/models';

import * as fromPeerTrendsReportActions from '../actions/peer-trend-report.actions';

export interface State {
  peerTrendsReportWorkbook: AsyncStateObj<Workbook>;
}

const initialState: State = {
  peerTrendsReportWorkbook: generateDefaultAsyncStateObj<Workbook>(null)
};

export function reducer(state = initialState, action: fromPeerTrendsReportActions.Actions): State {
  switch (action.type) {
    case fromPeerTrendsReportActions.LOAD_PEER_TREND_REPORT: {
      const peerTrendsReportWorkbookAsyncClone = cloneDeep(state.peerTrendsReportWorkbook);

      peerTrendsReportWorkbookAsyncClone.loading = true;
      peerTrendsReportWorkbookAsyncClone.obj = null;
      peerTrendsReportWorkbookAsyncClone.loadingError = false;

      return {
        ...state,
        peerTrendsReportWorkbook: peerTrendsReportWorkbookAsyncClone
      };
    }
    case fromPeerTrendsReportActions.LOAD_PEER_TREND_REPORT_SUCCESS: {
      const peerTrendsReportWorkbookAsyncClone = cloneDeep(state.peerTrendsReportWorkbook);

      peerTrendsReportWorkbookAsyncClone.loading = false;
      peerTrendsReportWorkbookAsyncClone.obj = action.payload;

      return {
        ...state,
        peerTrendsReportWorkbook: peerTrendsReportWorkbookAsyncClone
      };
    }
    case fromPeerTrendsReportActions.LOAD_PEER_TREND_REPORT_ERROR: {
      const peerTrendsReportWorkbookAsyncClone = cloneDeep(state.peerTrendsReportWorkbook);

      peerTrendsReportWorkbookAsyncClone.loadingError = true;

      return {
        ...state,
        peerTrendsReportWorkbook: peerTrendsReportWorkbookAsyncClone
      };
    }
    default: {
      return state;
    }
  }
}

export const getPeerTrendsWorkbooksAsync = (state: State) => state.peerTrendsReportWorkbook;
