import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import { UserTicketResponse } from 'libs/models/payfactors-api/service/response';

import * as fromTicketListActions from '../actions/ticket-list.actions';

// Extended entity state
export interface State extends EntityState<UserTicketResponse> {
  loading: boolean;
  loadingError: boolean;
}

// Create entity adapter
export const adapter: EntityAdapter<UserTicketResponse> = createEntityAdapter<UserTicketResponse>({
    selectId: (userTicketViewModel: UserTicketResponse) => userTicketViewModel.UserTicketId
});

// Initial State
export const initialState: State = adapter.getInitialState({
  loading: false,
  loadingError: false
});

export function reducer(state = null, action: fromTicketListActions.Actions): State {
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
        loading: false
      };
    }
    case fromTicketListActions.LOAD_TICKETS_ERROR: {
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

export const getLoading = (state: State) => state.loading;
export const getLoadingError = (state: State) => state.loadingError;
