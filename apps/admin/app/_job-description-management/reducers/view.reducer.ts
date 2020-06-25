import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { JobDescriptionViewModel } from 'libs/models/jdm/job-description-view.model';

// Import all exports from our feature's actions
import * as fromJdmViewActions from '../actions/view.actions';

// Define our feature state
export interface State extends EntityState<JobDescriptionViewModel> {
  loading: boolean;
  loadingError: boolean;
}

export const adapter: EntityAdapter<JobDescriptionViewModel> = createEntityAdapter<JobDescriptionViewModel>({
  selectId: (jobDescriptionViewModel: JobDescriptionViewModel) => jobDescriptionViewModel.Id
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
        ...adapter.setAll(action.payload.views, state),
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
