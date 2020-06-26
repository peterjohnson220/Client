import { cloneDeep } from 'lodash';

import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models/state';
import { GroupedListItem } from 'libs/models';

import * as fromGridActionsBarActions from '../actions/grid-actions-bar.actions';

export interface State {
  sizes: AsyncStateObj<GroupedListItem[]>;
  selectedSizes: string[];
  industries: AsyncStateObj<GroupedListItem[]>;
  selectedIndustries: string[];
  locations: AsyncStateObj<GroupedListItem[]>;
  selectedLocations: string[];
}

const initialState: State = {
  sizes: generateDefaultAsyncStateObj([]),
  selectedSizes: [],
  industries: generateDefaultAsyncStateObj([]),
  selectedIndustries: [],
  locations: generateDefaultAsyncStateObj([]),
  selectedLocations: []
};

export function reducer(state = initialState, action: fromGridActionsBarActions.Actions): State {
  switch (action.type) {
    case fromGridActionsBarActions.GET_COMPANY_SCOPE_SIZES: {
      const sizesClone: AsyncStateObj<GroupedListItem[]> = cloneDeep(state.sizes);
      sizesClone.loading = true;
      sizesClone.loadingError = false;

      return {
        ...state,
        sizes: sizesClone
      };
    }
    case fromGridActionsBarActions.GET_COMPANY_SCOPE_SIZES_SUCCESS: {
      const sizesClone: AsyncStateObj<GroupedListItem[]> = cloneDeep(state.sizes);
      sizesClone.loading = false;
      sizesClone.obj = action.payload;

      return {
        ...state,
        sizes: sizesClone
      };
    }
    case fromGridActionsBarActions.GET_COMPANY_SCOPE_SIZES_ERROR: {
      const sizesClone: AsyncStateObj<GroupedListItem[]> = cloneDeep(state.sizes);
      sizesClone.loading = false;
      sizesClone.loadingError = true;

      return {
        ...state,
        sizes: sizesClone
      };
    }
    case fromGridActionsBarActions.UPDATE_SELECTED_SIZES: {

      return {
        ...state,
        selectedSizes: action.payload
      };
    }
    case fromGridActionsBarActions.GET_COMPANY_INDUSTRIES: {
      const industriesClone: AsyncStateObj<GroupedListItem[]> = cloneDeep(state.industries);
      industriesClone.loading = true;
      industriesClone.loadingError = false;

      return {
        ...state,
        industries: industriesClone
      };
    }
    case fromGridActionsBarActions.GET_COMPANY_INDUSTRIES_SUCCESS: {
      const industriesClone: AsyncStateObj<GroupedListItem[]> = cloneDeep(state.industries);
      industriesClone.loading = false;
      industriesClone.obj = action.payload;

      return {
        ...state,
        industries: industriesClone
      };
    }
    case fromGridActionsBarActions.GET_COMPANY_INDUSTRIES_ERROR: {
      const industriesClone: AsyncStateObj<GroupedListItem[]> = cloneDeep(state.industries);
      industriesClone.loading = false;
      industriesClone.loadingError = true;

      return {
        ...state,
        industries: industriesClone
      };
    }
    case fromGridActionsBarActions.SET_SELECTED_INDUSTRIES: {
      return {
        ...state,
        selectedIndustries: cloneDeep(action.payload)
      };
    }
    case fromGridActionsBarActions.GET_LOCATIONS: {
      const locationsClone: AsyncStateObj<GroupedListItem[]> = cloneDeep(state.locations);
      locationsClone.loading = true;
      locationsClone.loadingError = false;
      return {
        ...state,
        locations: locationsClone
      };
    }
    case fromGridActionsBarActions.GET_LOCATIONS_SUCCESS: {
      const locationsClone: AsyncStateObj<GroupedListItem[]> = cloneDeep(state.locations);
      locationsClone.loading = true;
      locationsClone.obj = action.payload;
      return {
        ...state,
        locations: locationsClone
      };
    }
    case fromGridActionsBarActions.GET_LOCATIONS_ERROR: {
      const locationsClone: AsyncStateObj<GroupedListItem[]> = cloneDeep(state.locations);
      locationsClone.loading = false;
      locationsClone.loadingError = true;
      return {
        ...state,
        locations: locationsClone
      };
    }
    case fromGridActionsBarActions.SET_SELECTED_LOCATIONS: {
      return {
        ...state,
        selectedLocations: action.payload
      };
    }
    default: {
      return state;
    }
  }
}

export const getCompanyScopeSizes = (state: State) => state.sizes;
export const getSelectedSizes = (state: State) => state.selectedSizes;
export const getCompanyIndustries = (state: State) => state.industries;
export const getSelectedIndustries = (state: State) => state.selectedIndustries;
export const getLocations = (state: State) => state.locations;
export const getSelectedLocations = (state: State) => state.selectedLocations;
