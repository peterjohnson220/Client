import { orderBy, cloneDeep } from 'lodash';

import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models/state';
import { GroupedListItem } from 'libs/models/list';

import * as fromMdScopeActions from '../actions/market-data-scope.actions';
import { GeneralFormHelper } from '../helpers';
import { ScopeLabel } from '../models';

export interface State {
  sizes: AsyncStateObj<GroupedListItem[]>;
  industries: AsyncStateObj<GroupedListItem []>;
  locations: AsyncStateObj<GroupedListItem[]>;
}

const initialState: State = {
  sizes: generateDefaultAsyncStateObj<GroupedListItem[]>([]),
  industries: generateDefaultAsyncStateObj<GroupedListItem[]>([]),
  locations: generateDefaultAsyncStateObj<GroupedListItem[]>([])
};

export function reducer(state = initialState, action: fromMdScopeActions.Actions): State {
  switch (action.type) {
    case fromMdScopeActions.GET_SIZES: {
      const sizesClone: AsyncStateObj<GroupedListItem[]> = cloneDeep(state.sizes);
      sizesClone.loading = true;
      sizesClone.loadingError = false;
      return {
        ...state,
        sizes: sizesClone
      };
    }
    case fromMdScopeActions.GET_SIZES_SUCCESS: {
      const sizesClone: AsyncStateObj<GroupedListItem[]> = cloneDeep(state.sizes);
      sizesClone.loading = false;
      sizesClone.obj = [GeneralFormHelper.buildAllItem(ScopeLabel.Size)];
      if (action.payload && action.payload.length) {
        sizesClone.obj = sizesClone.obj.concat(action.payload);
      }
      return {
        ...state,
        sizes: sizesClone
      };
    }
    case fromMdScopeActions.GET_SIZES_ERROR: {
      const sizesClone: AsyncStateObj<GroupedListItem[]> = cloneDeep(state.sizes);
      sizesClone.loading = false;
      sizesClone.loadingError = true;
      return {
        ...state,
        sizes: sizesClone
      };
    }
    case fromMdScopeActions.GET_ALL_INDUSTRIES: {
      const industriesClone = cloneDeep(state.industries);
      industriesClone.loading = true;
      industriesClone.loadingError = false;
      return {
        ...state,
        industries: industriesClone
      };
    }
    case fromMdScopeActions.GET_ALL_INDUSTRIES_SUCCESS: {
      const industriesClone = cloneDeep(state.industries);
      industriesClone.obj = [GeneralFormHelper.buildAllItem(ScopeLabel.Industry)];
      if (action.payload && action.payload.length) {
        industriesClone.obj = industriesClone.obj.concat(orderBy(action.payload, ['Name'], 'asc'));
      }
      industriesClone.loading = false;
      return {
        ...state,
        industries: industriesClone
      };
    }
    case fromMdScopeActions.GET_ALL_INDUSTRIES_ERROR: {
      const industriesClone = cloneDeep(state.industries);
      industriesClone.loading = false;
      industriesClone.loadingError = true;
      return {
        ...state,
        industries: industriesClone
      };
    }
    case fromMdScopeActions.GET_LOCATIONS: {
      const locationsClone: AsyncStateObj<GroupedListItem[]> = cloneDeep(state.locations);
      locationsClone.loading = true;
      locationsClone.loadingError = false;
      return {
        ...state,
        locations: locationsClone
      };
    }
    case fromMdScopeActions.GET_LOCATIONS_SUCCESS: {
      const locationsClone: AsyncStateObj<GroupedListItem[]> = cloneDeep(state.locations);
      locationsClone.loading = false;
      if (action.payload.reset) {
        locationsClone.obj = [GeneralFormHelper.buildAllItem(ScopeLabel.Location)];
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
    case fromMdScopeActions.GET_LOCATIONS_ERROR: {
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

export const getSizes = (state: State) => state.sizes;
export const getAllIndustries = (state: State) => state.industries;
export const getLocations = (state: State) => state.locations;
