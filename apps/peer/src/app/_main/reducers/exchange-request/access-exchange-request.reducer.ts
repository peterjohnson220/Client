import { AvailableExchangeItem, ExchangeRequestTypeEnum } from 'libs/models/peer';

import { createExchangeRequestReducer, IExchangeRequestEntityState } from '../exchange-request.reducer';
import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { ExchangeJobMapping } from '../../../../../../../libs/models/peer';

export interface State extends IExchangeRequestEntityState<AvailableExchangeItem> { }
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
