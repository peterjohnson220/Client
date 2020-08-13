import cloneDeep from 'lodash/cloneDeep';

import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models/state';
import { AsyncStateObjHelper } from 'libs/core/helpers';

import * as fromTotalRewardsStatementPdfActions from '../actions/total-rewards-statement-pdf.actions';
import { TotalRewardsStatementPdf } from '../models';

export interface State {
  totalRewardsStatementPdfsAsync: AsyncStateObj<TotalRewardsStatementPdf[]>;
}

export const initialState: State = {
  totalRewardsStatementPdfsAsync: generateDefaultAsyncStateObj<TotalRewardsStatementPdf[]>([]),
};

export function reducer(state = initialState, action: fromTotalRewardsStatementPdfActions.Actions): State {
  switch (action.type) {
    case fromTotalRewardsStatementPdfActions.GET_TOTAL_REWARDS_STATEMENT_PDFS: {
      return AsyncStateObjHelper.loading(cloneDeep(state), 'totalRewardsStatementPdfsAsync');
    }
    case fromTotalRewardsStatementPdfActions.GET_TOTAL_REWARDS_STATEMENT_PDFS_SUCCESS: {
      return AsyncStateObjHelper.loadingSuccess(cloneDeep(state), 'totalRewardsStatementPdfsAsync', action.payload);
    }
    case fromTotalRewardsStatementPdfActions.GET_TOTAL_REWARDS_STATEMENT_PDFS_ERROR: {
      return AsyncStateObjHelper.loadingError(cloneDeep(state), 'totalRewardsStatementPdfsAsync');
    }
    default: {
      return state;
    }
  }
}

export const getTotalRewardsStatementPdfs = (state: State) => state.totalRewardsStatementPdfsAsync;
export const getTotalRewardsStatementPdfsLoading = (state: State) => state.totalRewardsStatementPdfsAsync.loading;
export const getTotalRewardsStatementPdfsLoadingError = (state: State) => state.totalRewardsStatementPdfsAsync.loadingError;
