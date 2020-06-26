// Import all exports from our feature's actions
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

import { Match } from 'libs/models/company';

import * as fromMatchesActions from '../actions/matches.actions';


// Define our feature state
export interface State extends EntityState<Match> {
  loading: boolean;
  loadingError: boolean;
}

export const adapter: EntityAdapter<Match> = createEntityAdapter<Match>({
  selectId: (match: Match) => match.JobId
});

// Define our initial state
const initialState: State = adapter.getInitialState({
  loading: false,
  loadingError: false
});

// Reducer function
export function reducer(
  state = initialState,
  action: fromMatchesActions.Actions
): State {
  switch (action.type) {
    case fromMatchesActions.LOADING: {
      return {
        ...state,
        loading: true,
        loadingError: false
      };
    }
    case fromMatchesActions.LOADING_SUCCESS: {
      return {
        ...adapter.setAll(action.payload, state),
        loading: false,
        loadingError: false
      };
    }
    case fromMatchesActions.LOADING_ERROR: {
      return {
        ...state,
        loading: false,
        loadingError: true
      };
    }
    case fromMatchesActions.UPDATE_EXCLUDE_FROM_PARTICIPATION: {
      return {
        ...state
      };
    }
    default: {
      return state;
    }
  }
}

// Selector functions
export const getLoading = (state: State) => state.loading;
export const getLoadingError = (state: State) => state.loadingError;
