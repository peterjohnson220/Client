import { cloneDeep } from 'lodash';

import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models/state';
import { KendoTypedDropDownItem } from 'libs/models/kendo';

import * as fromGeneralFormActions from '../actions/general-form.actions';

export interface State {
  countries: AsyncStateObj<KendoTypedDropDownItem[]>;
  currencies: AsyncStateObj<KendoTypedDropDownItem[]>;
  linkedPayMarkets: AsyncStateObj<KendoTypedDropDownItem[]>;
}

const initialState: State = {
  countries: generateDefaultAsyncStateObj<KendoTypedDropDownItem[]>([]),
  currencies: generateDefaultAsyncStateObj<KendoTypedDropDownItem[]>([]),
  linkedPayMarkets: generateDefaultAsyncStateObj<KendoTypedDropDownItem[]>([])
};

export function reducer(state = initialState, action: fromGeneralFormActions.Actions): State {
  switch (action.type) {
    case fromGeneralFormActions.GET_COUNTRIES: {
      const countriesClone: AsyncStateObj<KendoTypedDropDownItem[]> = cloneDeep(state.countries);
      countriesClone.loading = true;
      countriesClone.loadingError = false;

      return {
        ...state,
        countries: countriesClone
      };
    }
    case fromGeneralFormActions.GET_COUNTRIES_SUCCESS: {
      const countriesClone: AsyncStateObj<KendoTypedDropDownItem[]> = cloneDeep(state.countries);
      countriesClone.loading = false;
      countriesClone.obj = action.payload;

      return {
        ...state,
        countries: countriesClone
      };
    }
    case fromGeneralFormActions.GET_COUNTRIES_ERROR: {
      const countriesClone: AsyncStateObj<KendoTypedDropDownItem[]> = cloneDeep(state.countries);
      countriesClone.loading = false;
      countriesClone.loadingError = true;

      return {
        ...state,
        countries: countriesClone
      };
    }
    case fromGeneralFormActions.GET_CURRENCIES: {
      const currenciesClone: AsyncStateObj<KendoTypedDropDownItem[]> = cloneDeep(state.currencies);
      currenciesClone.loading = true;
      currenciesClone.loadingError = false;
      return {
        ...state,
        currencies: currenciesClone
      };
    }
    case fromGeneralFormActions.GET_CURRENCIES_SUCCESS: {
      const currenciesClone: AsyncStateObj<KendoTypedDropDownItem[]> = cloneDeep(state.currencies);
      currenciesClone.loading = false;
      currenciesClone.obj = action.payload;
      return {
        ...state,
        currencies: currenciesClone
      };
    }
    case fromGeneralFormActions.GET_CURRENCIES_ERROR: {
      const currenciesClone: AsyncStateObj<KendoTypedDropDownItem[]> = cloneDeep(state.currencies);
      currenciesClone.loading = false;
      currenciesClone.loadingError = true;
      return {
        ...state,
        currencies: currenciesClone
      };
    }
    case fromGeneralFormActions.GET_LINKED_PAY_MARKETS: {
      const linkedPayMarketsClone: AsyncStateObj<KendoTypedDropDownItem[]> = cloneDeep(state.linkedPayMarkets);
      linkedPayMarketsClone.loading = true;
      linkedPayMarketsClone.loadingError = false;
      return {
        ...state,
        linkedPayMarkets: linkedPayMarketsClone
      };
    }
    case fromGeneralFormActions.GET_LINKED_PAY_MARKETS_SUCCESS: {
      const linkedPayMarketsClone: AsyncStateObj<KendoTypedDropDownItem[]> = cloneDeep(state.linkedPayMarkets);
      linkedPayMarketsClone.loading = false;
      linkedPayMarketsClone.obj = action.payload;
      return {
        ...state,
        linkedPayMarkets: linkedPayMarketsClone
      };
    }
    case fromGeneralFormActions.GET_LINKED_PAY_MARKETS_ERROR: {
      const linkedPayMarketsClone: AsyncStateObj<KendoTypedDropDownItem[]> = cloneDeep(state.linkedPayMarkets);
      linkedPayMarketsClone.loading = false;
      linkedPayMarketsClone.loadingError = true;
      return {
        ...state,
        linkedPayMarkets: linkedPayMarketsClone
      };
    }
    default: {
      return state;
    }
  }
}

export const getCountries = (state: State) => state.countries;
export const getCurrencies = (state: State) => state.currencies;
export const getLinkedPayMarkets = (state: State) => state.linkedPayMarkets;
