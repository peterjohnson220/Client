import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

// Import all exports from our feature's actions
import * as fromJdmFilterActions from '../actions/filter.actions';
import { UserFilter } from 'libs/models/user-profile';

// Define our feature state
export interface State extends EntityState<UserFilter> {
  loading: boolean;
  loadingError: boolean;
}

export const adapter: EntityAdapter<UserFilter> = createEntityAdapter<UserFilter>({
  selectId: (userFilter: UserFilter) => userFilter.Id
});

// Define our initial state
const initialState: State = adapter.getInitialState({
  loading: false,
  loadingError: false
});


// Reducer function
export function reducer(
  state = initialState,
  action: fromJdmFilterActions.Actions
): State {
  switch (action.type) {
    case fromJdmFilterActions.LOADING_FILTERS: {
      return {
        ...state,
        loading: true,
      };
    }
    case fromJdmFilterActions.LOADING_FILTERS_ERROR: {
      return {
        ...state,
        loading: false,
        loadingError: true
      };
    }
    case  fromJdmFilterActions.LOADING_FILTERS_SUCCESS: {
      return {
        ...adapter.addAll(action.payload.userFilters, state),
        loading: false
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
