import { UserTicketStateResponse, UserTicketTypeResponse } from 'libs/models/payfactors-api/service/response';

import * as fromTicketLookupActions from '../actions/ticket-lookup.actions';
import { PfServicesRep } from '../models';

export interface State {
  loading: boolean;
  loadingError: boolean;
  pfServicesReps: PfServicesRep[];
  userTicketStates: UserTicketStateResponse[];
  userTicketTypes: UserTicketTypeResponse[];
}

export const initialState: State = {
  loading: false,
  loadingError: false,
  pfServicesReps: [],
  userTicketStates: [],
  userTicketTypes: []
};

export function reducer(state = initialState, action: fromTicketLookupActions.Actions): State {
  switch (action.type) {
    case fromTicketLookupActions.LOAD_PFSERVICESREPS:
    case fromTicketLookupActions.LOAD_TICKETSTATES:
    case fromTicketLookupActions.LOAD_TICKETTYPES: {
      return {
        ...state,
        loading: true,
        loadingError: false
      };
    }
    case fromTicketLookupActions.LOAD_PFSERVICESREPS_ERROR:
    case fromTicketLookupActions.LOAD_TICKETSTATES_ERROR:
    case fromTicketLookupActions.LOAD_TICKETTYPES_ERROR: {
      return {
        ...state,
        loading: false,
        loadingError: true
      };
    }
    case fromTicketLookupActions.LOAD_PFSERVICESREPS_SUCCESS: {
      return {
        ...state,
        loading: false,
        pfServicesReps: action.payload
      };
    }
    case fromTicketLookupActions.LOAD_TICKETSTATES_SUCCESS: {
      return {
        ...state,
        loading: false,
        userTicketStates: action.payload
      };
    }
    case fromTicketLookupActions.LOAD_TICKETTYPES_SUCCESS: {
      return {
        ...state,
        loading: false,
        userTicketTypes: action.payload
      };
    }
    default: {
      return state;
    }
  }
}

export const getLoading = (state: State) => state.loading;
export const getLoadingError = (state: State) => state.loadingError;
export const getPfServicesReps = (state: State) => state.pfServicesReps;
export const getUserTicketStates = (state: State) => state.userTicketStates;
export const getUserTicketTypes = (state: State) => state.userTicketTypes;
