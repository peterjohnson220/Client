import { ExchangeRequestTypeEnum } from './exchange-request-type.enum';

export interface ExchangeRequestCandidatesRequest {
  RequestType: ExchangeRequestTypeEnum;
  FilterCriteria: any;
}

export function generateMockExchangeRequestCandidatesRequest(): ExchangeRequestCandidatesRequest {
  return {
    RequestType: ExchangeRequestTypeEnum.NewExchange,
    FilterCriteria: {
      Query: ''
    }
  };
}
