import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import {UserTicketGridItem} from '../models';

import * as fromTicketListActions from '../actions/ticket-list.actions';

// Extended entity state
export interface State extends EntityState<UserTicketGridItem> {
  loading: boolean;
  loadingError: boolean;
  dirty: boolean;
}

// Create entity adapter
export const adapter: EntityAdapter<UserTicketGridItem> = createEntityAdapter<UserTicketGridItem>({
    selectId: (userTicketViewModel: UserTicketGridItem) => userTicketViewModel.Id
});

// Initial State
export const initialState: State = adapter.getInitialState({
  loading: false,
  loadingError: false,
  dirty: false,
});

export function reducer(state = initialState, action: fromTicketListActions.Actions): State {
  switch (action.type) {
    case fromTicketListActions.LOAD_TICKETS: {
      return {
        ...state,
        loading: true,
        loadingError: false
      };
    }
    case fromTicketListActions.LOAD_TICKETS_SUCCESS: {
      return {
        ...adapter.addAll(action.payload, state),
        loading: false,
        dirty: false
      };
    }
    case fromTicketListActions.LOAD_TICKETS_ERROR: {
      return {
        ...state,
        loading: false,
        loadingError: true
      };
    }
    case fromTicketListActions.SET_GRID_DIRTY_STATUS: {
      return {
        ...state,
        dirty: action.payload
      };
    }
    default: {
      return state;
    }
  }
}

export const getLoading = (state: State) => state.loading;
export const getLoadingError = (state: State) => state.loadingError;
export const getDirtyGridState = (state: State) => state.dirty;
