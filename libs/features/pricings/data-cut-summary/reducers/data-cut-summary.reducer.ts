import cloneDeep from 'lodash/cloneDeep';

import { AsyncStateObj } from 'libs/models/state';
import { generateDefaultAsyncStateObj } from 'libs/models';
import { AsyncStateObjHelper } from 'libs/core/helpers';
import * as fromDataCutSummaryActions from '../actions/data-cut-summary.actions';

export interface State {
  dataCutSummary: AsyncStateObj<any>;
  dataCutSummaryDictionary: {[key: string]: any};
}

export const initialState: State = {
  dataCutSummary: generateDefaultAsyncStateObj<any>({}),
  dataCutSummaryDictionary: {}
};

export function reducer(state = initialState, action: fromDataCutSummaryActions.Actions): State {
  switch (action.type) {
    case fromDataCutSummaryActions.LOAD_DATA_CUT_SUMMARY:
      return AsyncStateObjHelper.loading(state, 'dataCutSummary');
    case fromDataCutSummaryActions.LOAD_DATA_CUT_SUMMARY_SUCCESS:
      return AsyncStateObjHelper.loadingSuccess(state, 'dataCutSummary', action.payload);
    case fromDataCutSummaryActions.LOAD_DATA_CUT_SUMMARY_ERROR:
      return AsyncStateObjHelper.loadingError(state, 'dataCutSummary');
    case fromDataCutSummaryActions.CLEAR_DATA_CUT_SUMMARY:
      return {
        ...initialState,
        dataCutSummaryDictionary: state.dataCutSummaryDictionary
      };
    case fromDataCutSummaryActions.ADD_DATA_CUT_SUMMARY: {
      const dataCutSummaryDictionaryCopy = cloneDeep(state.dataCutSummaryDictionary);
      dataCutSummaryDictionaryCopy[action.payload.dataCutKey] = action.payload.response;
      return {
        ...state,
        dataCutSummaryDictionary: dataCutSummaryDictionaryCopy
      };
    }
    case fromDataCutSummaryActions.REMOVE_DATA_CUT_SUMMARY: {
      const dataCutSummaryDictionaryCopy = cloneDeep(state.dataCutSummaryDictionary);
      delete dataCutSummaryDictionaryCopy[action.payload.dataCutKey];
      return {
        ...state,
        dataCutSummaryDictionary: dataCutSummaryDictionaryCopy
      };
    }
    default:
      return state;
  }
}

export const getDataCutSummary = (state: State) => state.dataCutSummary;
export const getDataCutSummaryDictionary = (state: State) => state.dataCutSummaryDictionary;
export const getLoading = (state: State) => state.dataCutSummary.loading;
export const getHasError = (state: State) => state.dataCutSummary.loadingError;
