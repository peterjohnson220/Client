import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

import * as fromJobFamilyActions from '../../_manage/actions/job-family.actions';

export interface State extends EntityState<string> {
  loading: boolean;
  loadingError: boolean;
}

export const adapter: EntityAdapter<string> = createEntityAdapter<string>({
  selectId: x => x
});

const initialState: State = adapter.getInitialState({
  loading: false,
  loadingError: false
});

// Reducer
export function reducer(
  state = initialState,
  action: fromJobFamilyActions.Actions
): State {
  switch (action.type) {
    case fromJobFamilyActions.LOAD_JOB_FAMILIES: {
      return {
        ...adapter.removeAll(state),
        loading: true,
        loadingError: false
      };
    }
    case fromJobFamilyActions.LOAD_JOB_FAMILIES_SUCCESS: {
      return {
        ...adapter.setAll(action.payload, state),
        loading: false
      };
    }
    case fromJobFamilyActions.LOAD_JOB_FAMILIES_ERROR: {
      return {
        ...state,
        loading: false,
        loadingError: true
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
