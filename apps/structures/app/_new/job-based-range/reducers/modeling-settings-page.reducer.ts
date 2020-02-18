import * as cloneDeep from 'lodash.clonedeep';

import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models/state';
import { CurrencyDto } from 'libs/models/common';
import { StructureRangeGroupResponse } from 'libs/models/payfactors-api/structures';

import * as fromModelingSettingsActions from '../actions/modeling-settings-page.actions';

export interface State {
  currenciesAsync: AsyncStateObj<CurrencyDto[]>;
  standardPayElementsAsync: AsyncStateObj<string[]>;
  percentilesAsync: AsyncStateObj<string[]>;
  createModelAsync: AsyncStateObj<StructureRangeGroupResponse>;
}

const initialState: State = {
  currenciesAsync: generateDefaultAsyncStateObj<CurrencyDto[]>([]),
  standardPayElementsAsync: generateDefaultAsyncStateObj<string[]>([]),
  percentilesAsync: generateDefaultAsyncStateObj<string[]>([]),
  createModelAsync: generateDefaultAsyncStateObj<any>(null)
};

export function reducer(state = initialState, action: fromModelingSettingsActions.Actions): State {
  switch (action.type) {
    case fromModelingSettingsActions.GET_CURRENCIES: {
      const companyStructuresAsyncClone = cloneDeep(state.currenciesAsync);

      companyStructuresAsyncClone.loading = true;
      companyStructuresAsyncClone.loadingError = false;

      return {
        ...state,
        currenciesAsync: companyStructuresAsyncClone
      };
    }
    case fromModelingSettingsActions.GET_CURRENCIES_SUCCESS: {
      const companyStructuresAsyncClone = cloneDeep(state.currenciesAsync);

      companyStructuresAsyncClone.loading = false;
      companyStructuresAsyncClone.obj = action.payload;

      return {
        ...state,
        currenciesAsync: companyStructuresAsyncClone
      };
    }
    case fromModelingSettingsActions.GET_CURRENCIES_ERROR: {
      const companyStructuresAsyncClone = cloneDeep(state.currenciesAsync);

      companyStructuresAsyncClone.loading = false;
      companyStructuresAsyncClone.loadingError = true;

      return {
        ...state,
        currenciesAsync: companyStructuresAsyncClone
      };
    }
    case fromModelingSettingsActions.GET_STANDARD_PAY_ELEMENTS: {
      const companyStructuresAsyncClone = cloneDeep(state.standardPayElementsAsync);

      companyStructuresAsyncClone.loading = true;
      companyStructuresAsyncClone.loadingError = false;

      return {
        ...state,
        standardPayElementsAsync: companyStructuresAsyncClone
      };
    }
    case fromModelingSettingsActions.GET_STANDARD_PAY_ELEMENTS_SUCCESS: {
      const companyStructuresAsyncClone = cloneDeep(state.standardPayElementsAsync);

      companyStructuresAsyncClone.loading = false;
      companyStructuresAsyncClone.obj = action.payload;

      return {
        ...state,
        standardPayElementsAsync: companyStructuresAsyncClone
      };
    }
    case fromModelingSettingsActions.GET_STANDARD_PAY_ELEMENTS_ERROR: {
      const companyStructuresAsyncClone = cloneDeep(state.standardPayElementsAsync);

      companyStructuresAsyncClone.loading = false;
      companyStructuresAsyncClone.loadingError = true;

      return {
        ...state,
        standardPayElementsAsync: companyStructuresAsyncClone
      };
    }
    case fromModelingSettingsActions.GET_PERCENTILES: {
      const companyStructuresAsyncClone = cloneDeep(state.percentilesAsync);

      companyStructuresAsyncClone.loading = true;
      companyStructuresAsyncClone.loadingError = false;

      return {
        ...state,
        percentilesAsync: companyStructuresAsyncClone
      };
    }
    case fromModelingSettingsActions.GET_PERCENTILES_SUCCESS: {
      const companyStructuresAsyncClone = cloneDeep(state.percentilesAsync);

      companyStructuresAsyncClone.loading = false;
      companyStructuresAsyncClone.obj = action.payload;

      return {
        ...state,
        percentilesAsync: companyStructuresAsyncClone
      };
    }
    case fromModelingSettingsActions.GET_PERCENTILES_ERROR: {
      const companyStructuresAsyncClone = cloneDeep(state.percentilesAsync);

      companyStructuresAsyncClone.loading = false;
      companyStructuresAsyncClone.loadingError = true;

      return {
        ...state,
        percentilesAsync: companyStructuresAsyncClone
      };
    }
    case fromModelingSettingsActions.CREATE_MODEL: {
      const companyStructuresAsyncClone = cloneDeep(state.createModelAsync);

      companyStructuresAsyncClone.loading = true;
      companyStructuresAsyncClone.loadingError = false;

      return {
        ...state,
        createModelAsync: companyStructuresAsyncClone
      };
    }
    case fromModelingSettingsActions.CREATE_MODEL_SUCCESS: {
      const companyStructuresAsyncClone = cloneDeep(state.createModelAsync);

      companyStructuresAsyncClone.loading = false;
      companyStructuresAsyncClone.obj = action.payload;

      return {
        ...state,
        createModelAsync: companyStructuresAsyncClone
      };
    }
    case fromModelingSettingsActions.CREATE_MODEL_ERROR: {
      const companyStructuresAsyncClone = cloneDeep(state.createModelAsync);

      companyStructuresAsyncClone.loading = false;
      companyStructuresAsyncClone.loadingError = true;

      return {
        ...state,
        createModelAsync: companyStructuresAsyncClone
      };
    }
    default: {
      return state;
    }
  }
}

export const getCurrenciesAsync = (state: State) => state.currenciesAsync;
export const getStandardPayElementsAsync = (state: State) => state.standardPayElementsAsync;
export const getPercentilesAsync = (state: State) => state.percentilesAsync;
export const getCreateModelAsync = (state: State) => state.createModelAsync;
