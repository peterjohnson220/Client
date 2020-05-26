import { orderBy, cloneDeep } from 'lodash';

import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models/state';
import { KendoTypedDropDownItem } from 'libs/models/kendo';
import { GroupedListItem } from 'libs/models/list';
import { DefaultUserPayMarket } from 'libs/models';

import * as fromGeneralFormActions from '../actions/general-form.actions';
import { GeneralFormHelper } from '../helpers';

export interface State {
  countries: AsyncStateObj<KendoTypedDropDownItem[]>;
  currencies: AsyncStateObj<KendoTypedDropDownItem[]>;
  linkedPayMarkets: AsyncStateObj<KendoTypedDropDownItem[]>;
  sizes: AsyncStateObj<GroupedListItem[]>;
  defaultPayMarket: AsyncStateObj<DefaultUserPayMarket>;
  industries: AsyncStateObj<GroupedListItem []>;
  locations: AsyncStateObj<GroupedListItem[]>;
}

const initialState: State = {
  countries: generateDefaultAsyncStateObj<KendoTypedDropDownItem[]>([]),
  currencies: generateDefaultAsyncStateObj<KendoTypedDropDownItem[]>([]),
  linkedPayMarkets: generateDefaultAsyncStateObj<KendoTypedDropDownItem[]>([]),
  sizes: generateDefaultAsyncStateObj<GroupedListItem[]>([]),
  defaultPayMarket: generateDefaultAsyncStateObj<DefaultUserPayMarket>(null),
  industries: generateDefaultAsyncStateObj<GroupedListItem[]>([]),
  locations: generateDefaultAsyncStateObj<GroupedListItem[]>([])
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
    case fromGeneralFormActions.GET_SIZES: {
      const sizesClone: AsyncStateObj<GroupedListItem[]> = cloneDeep(state.sizes);
      sizesClone.loading = true;
      sizesClone.loadingError = false;
      return {
        ...state,
        sizes: sizesClone
      };
    }
    case fromGeneralFormActions.GET_SIZES_SUCCESS: {
      const sizesClone: AsyncStateObj<GroupedListItem[]> = cloneDeep(state.sizes);
      sizesClone.loading = true;
      sizesClone.obj = [GeneralFormHelper.buildAllItem()];
      if (action.payload && action.payload.length) {
        sizesClone.obj = sizesClone.obj.concat(action.payload);
      }
      return {
        ...state,
        sizes: sizesClone
      };
    }
    case fromGeneralFormActions.GET_SIZES_ERROR: {
      const sizesClone: AsyncStateObj<GroupedListItem[]> = cloneDeep(state.sizes);
      sizesClone.loading = false;
      sizesClone.loadingError = true;
      return {
        ...state,
        sizes: sizesClone
      };
    }
    case fromGeneralFormActions.GET_DEFAULT_USER_PAY_MARKET: {
      const defaultPayMarketClone: AsyncStateObj<DefaultUserPayMarket> = cloneDeep(state.defaultPayMarket);
      defaultPayMarketClone.loading = true;
      defaultPayMarketClone.loadingError = false;
      return {
        ...state,
        defaultPayMarket: defaultPayMarketClone
      };
    }
    case fromGeneralFormActions.GET_DEFAULT_USER_PAY_MARKET_SUCCESS: {
      const defaultPayMarketClone: AsyncStateObj<DefaultUserPayMarket> = cloneDeep(state.defaultPayMarket);
      defaultPayMarketClone.loading = false;
      defaultPayMarketClone.obj = action.payload;
      return {
        ...state,
        defaultPayMarket: defaultPayMarketClone
      };
    }
    case fromGeneralFormActions.GET_DEFAULT_USER_PAY_MARKET_ERROR: {
      const defaultPayMarketClone: AsyncStateObj<DefaultUserPayMarket> = cloneDeep(state.defaultPayMarket);
      defaultPayMarketClone.loading = false;
      defaultPayMarketClone.loadingError = true;
      return {
        ...state,
        defaultPayMarket: defaultPayMarketClone
      };
    }
    case fromGeneralFormActions.GET_ALL_INDUSTRIES: {
      const industriesClone = cloneDeep(state.industries);
      industriesClone.loading = true;
      industriesClone.loadingError = false;
      return {
        ...state,
        industries: industriesClone
      };
    }
    case fromGeneralFormActions.GET_ALL_INDUSTRIES_SUCCESS: {
      const industriesClone = cloneDeep(state.industries);
      industriesClone.obj = [GeneralFormHelper.buildAllItem()];
      if (action.payload && action.payload.length) {
        industriesClone.obj = industriesClone.obj.concat(orderBy(action.payload, ['Name'], 'asc'));
      }
      industriesClone.loading = false;
      return {
        ...state,
        industries: industriesClone
      };
    }
    case fromGeneralFormActions.GET_ALL_INDUSTRIES_ERROR: {
      const industriesClone = cloneDeep(state.industries);
      industriesClone.loading = false;
      industriesClone.loadingError = true;
      return {
        ...state,
        industries: industriesClone
      };
    }
    case fromGeneralFormActions.GET_LOCATIONS: {
      const locationsClone: AsyncStateObj<GroupedListItem[]> = cloneDeep(state.locations);
      locationsClone.loading = true;
      locationsClone.loadingError = false;
      return {
        ...state,
        locations: locationsClone
      };
    }
    case fromGeneralFormActions.GET_LOCATIONS_SUCCESS: {
      const locationsClone: AsyncStateObj<GroupedListItem[]> = cloneDeep(state.locations);
      locationsClone.loading = false;
      if (action.payload.reset) {
        locationsClone.obj = [GeneralFormHelper.buildAllItem()];
        locationsClone.obj = locationsClone.obj.concat(action.payload.results);
      } else {
        locationsClone.obj = !!action.payload.locationExpandedKey
          ? GeneralFormHelper.updateLocations(locationsClone.obj, action.payload.locationExpandedKey, action.payload.results)
          : action.payload.results;
      }
      return {
        ...state,
        locations: locationsClone
      };
    }
    case fromGeneralFormActions.GET_LOCATIONS_ERROR: {
      const locationsClone: AsyncStateObj<GroupedListItem[]> = cloneDeep(state.locations);
      locationsClone.loading = false;
      locationsClone.loadingError = true;
      return {
        ...state,
        locations: locationsClone
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
export const getSizes = (state: State) => state.sizes;
export const getDefaultPayMarket = (state: State) => state.defaultPayMarket;
export const getAllIndustries = (state: State) => state.industries;
export const getLocations = (state: State) => state.locations;
