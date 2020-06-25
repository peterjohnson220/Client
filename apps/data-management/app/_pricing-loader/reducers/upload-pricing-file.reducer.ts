import { cloneDeep } from 'lodash';
import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models/state';

import * as fromUploadPricingFileActions from '../actions/upload-pricing-file.actions';

export interface State {
  worksheetNames: AsyncStateObj<string[]>;
}

export const initialState: State = {
  worksheetNames: generateDefaultAsyncStateObj<string[]>([])
};

export function reducer(state: State = initialState, action: fromUploadPricingFileActions.Actions): State {
  switch (action.type) {
    case fromUploadPricingFileActions.GET_WORKSHEET_NAMES: {
      const worksheetNamesClone: AsyncStateObj<string[]> = cloneDeep(state.worksheetNames);
      worksheetNamesClone.loading = true;
      worksheetNamesClone.loadingError = false;

      return {
        ...state,
        worksheetNames: worksheetNamesClone
      };
    }
    case fromUploadPricingFileActions.GET_WORKSHEET_NAMES_SUCCESS: {
      const worksheetNamesClone: AsyncStateObj<string[]> = cloneDeep(state.worksheetNames);
      worksheetNamesClone.loading = false;
      worksheetNamesClone.obj = action.payload.worksheetNames;

      return {
        ...state,
        worksheetNames: worksheetNamesClone
      };
    }
    case fromUploadPricingFileActions.GET_WORKSHEET_NAMES_ERROR: {
      const worksheetNamesClone: AsyncStateObj<string[]> = cloneDeep(state.worksheetNames);
      worksheetNamesClone.loading = false;
      worksheetNamesClone.loadingError = true;

      return {
        ...state,
        worksheetNames: worksheetNamesClone
      };
    }
    case fromUploadPricingFileActions.RESET_UPLOAD_STATE: {
      const worksheetNamesClone: AsyncStateObj<string[]> = cloneDeep(state.worksheetNames);
      worksheetNamesClone.loading = false;
      worksheetNamesClone.loadingError = false;
      worksheetNamesClone.obj = [];

      return {
        ...state,
        worksheetNames: worksheetNamesClone
      };
    }
    default: {
      return state;
    }
  }
}

export const getWorksheetNames = (state: State) => state.worksheetNames;
