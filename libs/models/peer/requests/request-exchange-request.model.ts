import { ExchangeRequestTypeEnum } from './exchange-request-type.enum';

export interface RequestExchangeRequest {
  ExchangeId: number;
  Reason: string;
  Type: ExchangeRequestTypeEnum;
  TypeData: any;
}

export function generateMockRequestExchangeRequest(type: ExchangeRequestTypeEnum): RequestExchangeRequest {
  return {
    ExchangeId: 1,
    Reason: 'Mock Reason',
    Type: type,
    TypeData: null
  };
}
