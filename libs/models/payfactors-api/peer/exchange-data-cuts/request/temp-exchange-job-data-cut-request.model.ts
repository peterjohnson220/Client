import { BaseExchangeDataSearchRequest } from 'libs/models/payfactors-api/peer/exchange-data-search';

export interface TempExchangeJobDataCutRequest {
  ExchangeDataSearchRequest: BaseExchangeDataSearchRequest;
  CountryCode: string;
  CurrencyCode: string;
  Rate: string;
}
