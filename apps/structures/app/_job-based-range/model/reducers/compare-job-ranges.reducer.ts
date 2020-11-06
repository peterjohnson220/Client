import cloneDeep from 'lodash/cloneDeep';

import * as fromCompareJobRangeActions from '../actions';

export interface State {
  compareData: any;
  loadingCompareData: boolean;
  loadingCompareDataError: boolean;
  converting: boolean;
  convertingError: boolean;
}

const initialState: State = {
  compareData: null,
  loadingCompareData: false,
  loadingCompareDataError: false,
  converting: false,
  convertingError: false
};

export function reducer(state = initialState, action: fromCompareJobRangeActions.CompareJobRangesActions): State {
  switch (action.type) {
    case fromCompareJobRangeActions.GET_DATA_FOR_COMPARE:
      return {
        ...state,
        loadingCompareData: true,
        loadingCompareDataError: false,
        compareData: null
      };
    case fromCompareJobRangeActions.GET_DATA_FOR_COMPARE_SUCCESS:
      return {
        ...state,
        loadingCompareData: false,
        compareData: action.payload
      };
    case fromCompareJobRangeActions.GET_DATA_FOR_COMPARE_ERROR:
      return {
        ...state,
        loadingCompareData: false,
        loadingCompareDataError: true
      };
    case fromCompareJobRangeActions.LOAD_MORE_COMPARE_DATA:
      return {
        ...state,
        loadingCompareData: true,
      };
    case fromCompareJobRangeActions.LOAD_MORE_COMPARE_DATA_SUCCESS:
      let compareDataClone = cloneDeep(state.compareData);
      compareDataClone = compareDataClone.concat(action.payload);

      return {
        ...state,
        loadingCompareData: false,
        compareData: compareDataClone
      };
    case fromCompareJobRangeActions.CONVERT_CURRENCY_AND_RATE:
      return {
        ...state,
        converting: true,
        convertingError: false,
        compareData: null
      };
    case fromCompareJobRangeActions.APPEND_CONVERT_CURRENCY_AND_RATE:
      return {
        ...state,
        converting: true,
        convertingError: false,
        compareData: null
      };
    case fromCompareJobRangeActions.APPEND_CONVERT_CURRENCY_AND_RATE_SUCCESS:
      let convertedDataClone = cloneDeep(state.compareData);
      convertedDataClone = compareDataClone.concat(action.payload);

      return {
        ...state,
        converting: false,
        compareData: convertedDataClone
      };
    case fromCompareJobRangeActions.CONVERT_CURRENCY_AND_RATE_SUCCESS:
      return {
        ...state,
        converting: false,
        compareData: action.payload
      };
    case fromCompareJobRangeActions.CONVERT_CURRENCY_AND_RATE_ERROR:
      return {
        ...state,
        converting: false,
        convertingError: true,
      };
    default:
      return state;
  }
}

export const getDataForCompare = (state: State) => state.compareData;
