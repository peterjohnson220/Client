import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

import { NewCompanyExchangeInvitation } from 'libs/models/peer/new-company-exchange-invitation.model';
import { GridTypeEnum } from 'libs/models/common';
import { createGridReducer } from 'libs/core/reducers/grid.reducer';

import * as fromNewCompanyExchangeInvitationsActions from '../actions/new-company-exchange-invitations.actions';

// Extend entity state
export interface State extends EntityState<NewCompanyExchangeInvitation> {
  loading: boolean;
  loadingError: boolean;
  total: number;
}

// Create entity adapter
export const adapter: EntityAdapter<NewCompanyExchangeInvitation> = createEntityAdapter<NewCompanyExchangeInvitation> ({
  selectId: (newCompanyExchangeInvitation: NewCompanyExchangeInvitation) => newCompanyExchangeInvitation.DocumentId
});

// Initial State
export const initialState: State = adapter.getInitialState({
  loading: false,
  loadingError: false,
  total: 0
});

// Reducer
export function reducer(state, action) {
  return createGridReducer(
    GridTypeEnum.NewCompanyExchangeInvitation,
    (featureState = initialState, featureAction: fromNewCompanyExchangeInvitationsActions.Actions): State => {
      switch (featureAction.type) {
        case fromNewCompanyExchangeInvitationsActions.LOAD_NEW_COMPANY_EXCHANGE_INVITATIONS: {
          return {
            ...adapter.removeAll(featureState),
            loading: true,
            loadingError: false
          };
        }
        case fromNewCompanyExchangeInvitationsActions.LOAD_NEW_COMPANY_EXCHANGE_INVITATIONS_SUCCESS: {
          const requests: NewCompanyExchangeInvitation[] = featureAction.payload.data;
          return {
            ...adapter.setAll(requests, featureState),
            loading: false,
            total: action.payload.total
          };
        }
        case fromNewCompanyExchangeInvitationsActions.LOAD_NEW_COMPANY_EXCHANGE_INVITATIONS_ERROR: {
          return {
            ...featureState,
            loading: false,
            loadingError: true
          };
        }
        default: {
          return featureState;
        }
      }
    })(state, action);
}

// Selector Functions
export const getLoading = (state: State) => state.loading;
export const getLoadingError = (state: State) => state.loadingError;
export const getTotal = (state: State) => state.total;
