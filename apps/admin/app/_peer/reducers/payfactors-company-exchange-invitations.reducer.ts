import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

import { PayfactorsCompanyExchangeInvitation } from 'libs/models/peer/payfactors-company-exchange-invitation.model';
import { GridTypeEnum } from 'libs/models/common';
import { createGridReducer } from 'libs/core/reducers/grid.reducer';

import * as fromPayfactorsCompanyExchangeInvitationsActions from '../actions/payfactors-company-exchange-invitations.actions';

// Extend entity state
export interface State extends EntityState<PayfactorsCompanyExchangeInvitation> {
  loading: boolean;
  loadingError: boolean;
  total: number;
}

// Create entity adapter
export const adapter: EntityAdapter<PayfactorsCompanyExchangeInvitation> = createEntityAdapter<PayfactorsCompanyExchangeInvitation> ({
  selectId: (payfactorsCompanyExchangeInvitation: PayfactorsCompanyExchangeInvitation) => payfactorsCompanyExchangeInvitation.DocumentId
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
    GridTypeEnum.PayfactorsCompanyExchangeInvitation,
    (featureState = initialState, featureAction: fromPayfactorsCompanyExchangeInvitationsActions.Actions): State => {
      switch (featureAction.type) {
        case fromPayfactorsCompanyExchangeInvitationsActions.LOAD_PAYFACTORS_COMPANY_EXCHANGE_INVITATIONS: {
          return {
            ...adapter.removeAll(featureState),
            loading: true,
            loadingError: false
          };
        }
        case fromPayfactorsCompanyExchangeInvitationsActions.LOAD_PAYFACTORS_COMPANY_EXCHANGE_INVITATIONS_SUCCESS: {
          const requests: PayfactorsCompanyExchangeInvitation[] = featureAction.payload.data;
          return {
            ...adapter.setAll(requests, featureState),
            loading: false,
            total: action.payload.total
          };
        }
        case fromPayfactorsCompanyExchangeInvitationsActions.LOAD_PAYFACTORS_COMPANY_EXCHANGE_INVITATIONS_ERROR: {
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
