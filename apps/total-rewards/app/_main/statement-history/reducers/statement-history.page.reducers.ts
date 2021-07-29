import cloneDeep from 'lodash/cloneDeep';

import * as fromKendo from '@progress/kendo-data-query/';

import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models';
import { Statement } from 'libs/features/total-rewards/total-rewards-statement/models';
import { AsyncStateObjHelper } from 'libs/core';
import { StatementHistoryViewModel } from 'libs/features/total-rewards/total-rewards-statement/models/statement-history-list-view-model';

import * as fromActions from '../actions/statement-history.page.actions';

export interface State {
  statement: AsyncStateObj<Statement>;
  statementHistory: AsyncStateObj<StatementHistoryViewModel>;
  downloadingHistoricalPdf: boolean;
  downloadingHistoricalPdfError: boolean;
  gridState: fromKendo.State;
  pdfIdToExport: string;
}

export const getStatementLoadingError = (state: State) => state.statement.loadingError;
export const initialState: State = {
  statement: generateDefaultAsyncStateObj<Statement>(null),
  statementHistory: generateDefaultAsyncStateObj<StatementHistoryViewModel>(null),
  downloadingHistoricalPdf: false,
  downloadingHistoricalPdfError: false,
  pdfIdToExport: null,
  gridState: {
    skip: 0,
    take: 20,
    filter: {
      filters: [],
      logic: 'and'
    },
    sort: [
      {
        field: 'GeneratedDate',
        dir: 'desc'
      }
    ]
  }
};

export function reducer(state = initialState, action: fromActions.StatementHistoryPageActions): State {
  switch (action.type) {
    case fromActions.LOAD_STATEMENT: {
      const localState: State = cloneDeep(state);
      // get the statementId into the store asap so it can be passed to fetch the main grid without having to wait for the full statement to load
      localState.statement.obj = { StatementId: action.payload.statementId } as Statement;
      // also initialize the grid state so its state from a previous statement history does not affect the initial state of a new statement history
      localState.gridState = {...initialState.gridState};
      return AsyncStateObjHelper.loading(localState, 'statement');
    }
    case fromActions.LOAD_STATEMENT_SUCCESS: {
      return AsyncStateObjHelper.loadingSuccess(state, 'statement', action.payload);
    }
    case fromActions.LOAD_STATEMENT_ERROR: {
      return AsyncStateObjHelper.loadingError(state, 'statement', action.payload);
    }
    case fromActions.LOAD_STATEMENT_HISTORY: {
      return AsyncStateObjHelper.loading(state, 'statementHistory');
    }
    case fromActions.LOAD_STATEMENT_HISTORY_SUCCESS: {
      const statementHistoryViewModel: StatementHistoryViewModel = {
        StatementHistory: action.payload.Data,
        TotalCount: action.payload.TotalCount
      };
      return AsyncStateObjHelper.loadingSuccess(state, 'statementHistory', statementHistoryViewModel);
    }
    case fromActions.LOAD_STATEMENT_HISTORY_ERROR: {
      return AsyncStateObjHelper.loadingError(state, 'statementHistory', action.payload);
    }
    case fromActions.UPDATE_GRID_STATE: {
      const newSort = action.payload.sort[0], initialSort = initialState.gridState.sort[0];
      if (newSort.field === initialSort.field && !newSort.dir) {
        return { ...state, gridState: { ...action.payload, sort: [{ field: newSort.field, dir: 'asc' }] }};
      } else if (!newSort.dir) {
        return { ...state, gridState: { ...action.payload, sort: [initialSort] }};
      }

      return { ...state, gridState: action.payload };
    }
    case fromActions.DOWNLOAD_HISTORICAL_STATEMENT: {
      return {
        ...state,
        downloadingHistoricalPdf: true,
        downloadingHistoricalPdfError: false
      };
    }
    case fromActions.DOWNLOAD_HISTORICAL_STATEMENT_SUCCESS: {
      return {
        ...state,
        downloadingHistoricalPdf: false,
        downloadingHistoricalPdfError: false
      };
    }
    case fromActions.DOWNLOAD_HISTORICAL_STATEMENT_ERROR: {
      return {
        ...state,
        downloadingHistoricalPdf: false,
        downloadingHistoricalPdfError: true
      };
    }
    case fromActions.UPDATE_PDF_ID_TO_EXPORT: {
      return {
        ...state,
        pdfIdToExport: action.payload.pdfId
      };
    }
    default: {
      return state;
    }
  }
}

export const getStatementHistoryLoading = (state: State) => state.statementHistory.loading;
export const getStatementHistoryLoadingError = (state: State) => state.statementHistory.loadingError;
export const getDownloadingHistoricalPdf = (state: State) => state.downloadingHistoricalPdf;
export const getPdfIdToExport = (state: State) => state.pdfIdToExport;
