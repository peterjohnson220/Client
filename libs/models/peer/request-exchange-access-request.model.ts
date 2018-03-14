import { ExchangeRequestTypeEnum } from '../../../apps/peer/src/app/_main/actions/exchange-request.actions';

export interface RequestExchangeAccessRequest {
  ExchangeId: number;
  Reason: string;
  Type: ExchangeRequestTypeEnum;
  TypeData: any;
}

export function generateMockRequestExchangeAccessRequest(): RequestExchangeAccessRequest {
  return {
    ExchangeId: 1,
    Reason: 'Mock Reason',
    Type: ExchangeRequestTypeEnum.NewExchange,
    TypeData: null
  };
}
