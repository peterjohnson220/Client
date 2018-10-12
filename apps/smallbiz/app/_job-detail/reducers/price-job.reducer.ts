import * as fromPriceJobActions from '../actions/price-job.actions';
import { Location } from '../../shared/models/location';

export interface State {
  locationSearchTerm: string;
  selectedLocation: Location;
  locationResults: Location[];
  isSearchingLocation: boolean;
  locationSearchSuccess: boolean;
  locationSearchFailure: boolean;
}

const initialState: State = {
  locationSearchTerm: '',
  selectedLocation: null,
  locationResults: [],
  isSearchingLocation: false,
  locationSearchSuccess: false,
  locationSearchFailure: false
};

export function reducer(state: State = initialState, action: fromPriceJobActions.PriceJobAction): State {
  switch (action.type) {
    case fromPriceJobActions.LOCATION_SEARCH_TERM_CHANGED: {
      return {
        ...state,
        isSearchingLocation: true,
        locationSearchTerm: action.payload.searchTerm
      };
    }
    case fromPriceJobActions.LOCATION_SEARCH_SUCCESS: {
      return {
        ...state,
        isSearchingLocation: false,
        locationResults: action.payload.locations
      };
    }
    case fromPriceJobActions.LOCATION_SEARCH_FAILURE: {
      return {
        ...state,
        isSearchingLocation: false,
        locationSearchFailure: true
      };
    }
    case fromPriceJobActions.LOCATION_SELECTION_CHANGED: {
      return {
        ...state,
        selectedLocation: action.payload.location
      };
    }
    default: {
      return state;
    }
  }
}

export const getLocationSearchTerm = (state: State) => state.locationSearchTerm;
export const getSelectedLocation = (state: State) => state.selectedLocation;
export const getLocationResults = (state: State) => state.locationResults;
export const getIsSearchingLocation = (state: State) => state.isSearchingLocation;
export const getLocationSearchSuccess = (state: State) => state.locationSearchSuccess;
export const getLocationSearchFailure = (state: State) => state.locationSearchFailure;
