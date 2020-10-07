import { SearchFilter } from '../../search/response';

export interface PricingMatchesRequest {
  Filters: SearchFilter[];
  CurrencyCode: string;
  CountryCode: string;
  Rate: string;
  SurveyJobIds: number[];
  PFJobCodes: string[];
  ExchangeJobIds: number[];
}
