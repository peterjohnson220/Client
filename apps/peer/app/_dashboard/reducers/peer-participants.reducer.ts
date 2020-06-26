import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

import { CompanyOption } from 'libs/models/common';

import * as fromPeerParticipantsActions from '../actions/peer-participants.actions';

export interface State extends EntityState<CompanyOption> {
  loading: boolean;
  loadingError: boolean;
}

export const adapter: EntityAdapter<CompanyOption> = createEntityAdapter<CompanyOption>({
  selectId: (companyOption: CompanyOption) => companyOption.CompanyId
});

const initialState: State = adapter.getInitialState({
  loading: false,
  loadingError: false
});

// Reducer function
export function reducer(state = initialState, action: fromPeerParticipantsActions.Actions): State {
  switch (action.type) {
    case fromPeerParticipantsActions.LOAD_PEER_PARTICIPANTS: {
      return {
        ...adapter.removeAll(state),
        loading: true,
        loadingError: false
      };
    }
    case fromPeerParticipantsActions.LOAD_PEER_PARTICIPANTS_SUCCESS: {
      const exchangeJobMappings: CompanyOption[] = action.payload;
      return {
        ...adapter.setAll(exchangeJobMappings, state),
        loading: false
      };
    }
    case fromPeerParticipantsActions.LOAD_PEER_PARTICIPANTS_ERROR: {
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
