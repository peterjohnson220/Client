import { AvailableExchangeItem, ExchangeRequestTypeEnum } from 'libs/models/peer';

import { createExchangeRequestReducer, IExchangeRequestEntityState } from '../exchange-request.reducer';

export interface State extends IExchangeRequestEntityState<AvailableExchangeItem> { }
// Reducer
export function reducer(state, action) {
  return createExchangeRequestReducer<AvailableExchangeItem> (
    ExchangeRequestTypeEnum.Access,
    (availableExchange: AvailableExchangeItem) => availableExchange.ExchangeId
  )(state, action);
}
