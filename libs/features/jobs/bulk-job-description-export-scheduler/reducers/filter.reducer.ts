import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

// Import all exports from our feature's actions
import { JdmListFilter } from 'libs/models/user-profile';

import * as fromJdmFilterActions from '../actions/filter.actions';
// Define our feature state
export interface State extends EntityState<JdmListFilter> {
  loading: boolean;
  loadingError: boolean;
}

export const adapter: EntityAdapter<JdmListFilter> = createEntityAdapter<JdmListFilter>({
  selectId: (userFilter: JdmListFilter) => userFilter.Id
});

// Define our initial state
const initialState: State = adapter.getInitialState({
  loading: false,
  loadingError: false
});


// Reducer function
export function reducer(
  state = initialState,
  action: fromJdmFilterActions.BulkExportJobsSchedulerFilterActions
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
        ...adapter.setAll(action.payload.userFilters, state),
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
