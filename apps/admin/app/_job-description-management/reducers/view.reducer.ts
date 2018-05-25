import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

// Import all exports from our feature's actions
import * as fromJdmViewActions from '../actions/view.actions';

// Define our feature state
export interface State extends EntityState<string> {
  loading: boolean;
  loadingError: boolean;
}

export const adapter: EntityAdapter<string> = createEntityAdapter<string>({
  selectId: x => x
});

// Define our initial state
const initialState: State = adapter.getInitialState({
  loading: false,
  loadingError: false
});


// Reducer function
export function reducer(
  state = initialState,
  action: fromJdmViewActions.Actions
): State {
  switch (action.type) {
    case fromJdmViewActions.LOADING_VIEWS: {
      return {
        ...state,
        loading: true,
      };
    }
    case fromJdmViewActions.LOADING_VIEWS_ERROR: {
      return {
        ...state,
        loading: false,
        loadingError: true
      };
    }
    case  fromJdmViewActions.LOADING_VIEWS_SUCCESS: {
      return {
        ...adapter.addAll(action.payload.viewNames, state),
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
