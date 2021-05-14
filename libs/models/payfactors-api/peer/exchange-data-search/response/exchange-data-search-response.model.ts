import { PagingResponse, SearchFilter, generateMockSearchFilter } from '../../../search/response';
import { ExchangeMapResponse, generateMockExchangeMapResponse } from '../../../../peer';

export interface ExchangeDataSearchResponse extends ExchangeMapResponse {
  Paging: PagingResponse;
  SearchFilters: SearchFilter[];
  KeepFilteredOutOptions: boolean;
}

export function generateMockExchangeDataSearchResponse(): ExchangeDataSearchResponse {
  return {
    ...generateMockExchangeMapResponse(),
    Paging: {
      TotalRecordCount: 20,
      RecordsReturned: 10
    },
    SearchFilters: [generateMockSearchFilter()],
    KeepFilteredOutOptions: true
  };
}

export interface HistoricalExchangeDataSearchResponse {
  PricingHistoryCollection: PayRateDate[];
}

export interface PayRateDate {
  EffectiveDate: Date;
  BasePay: number;
}

export interface HistoricalExchangeOrgIncCountResponse {
  OrgIncCountCollection: OrgIncCount[];
}

export interface OrgIncCount {
  EffectiveDate: Date;
  OrgCount: number;
  IncCount: number;
}
