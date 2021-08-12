import { PagingResponse, SearchFilter, generateMockSearchFilter } from '../../../search';
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
  ExchangeJobIds: number[];
  CompanyJobIds: number[];
  SmartCodeMaps: SmartCodeMap[];
}

export interface PayRateDate {
  EffectiveDate: Date;
  BasePay: number;
  Incs: number;
  Orgs: number;
  ExchangeJobCount: number;
  CompanyJobCount: number;
}

export interface SmartCodeMap {
  JobCode: string;
  JobTitle: string;
  RelationalJobCode: string;
  RelationalJobCodeName: string;
  FamilyGroupCode: string;
  FamilyGroupName: string;
  Category1Code: string;
  Category1Name: string;
  Category2Code: string;
  Category2Name: string;
  CategoryGroupName: string;
  CategoryGroupDescription: string;
  TypeLevel: string;
}

export interface HistoricalExchangeOrgIncCountResponse {
  OrgIncCountCollection: OrgIncCount[];
}

export interface OrgIncCount {
  EffectiveDate: Date;
  OrgCount: number;
  IncCount: number;
}
