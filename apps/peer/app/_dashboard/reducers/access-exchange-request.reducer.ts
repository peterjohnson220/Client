import { EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import { ExchangeRequestTypeEnum, AvailableExchangeItem } from 'libs/models/peer';

import { ExchangeRequestEntityState, createExchangeRequestReducer } from '../../shared/reducers/exchange-request.reducer';

export interface State extends ExchangeRequestEntityState<AvailableExchangeItem> { }

export const adapter: EntityAdapter<AvailableExchangeItem> = createEntityAdapter<AvailableExchangeItem>({
  selectId: (availableExchange: AvailableExchangeItem) => availableExchange.ExchangeId
});

// Reducer
export function reducer(state, action) {
  return createExchangeRequestReducer<AvailableExchangeItem> (
    ExchangeRequestTypeEnum.Access,
    adapter
  )(state, action);
}

// Selector functions
export const getLoadingRequestContext = (state: State) => {
  return {
    Query: state.searchTerm,
    CompanyFilterId: state.filterOptions ? state.filterOptions.companyFilterId : null
  };
};
