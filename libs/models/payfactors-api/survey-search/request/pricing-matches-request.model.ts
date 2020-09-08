import { Filter } from 'libs/features/search/models';

export interface PricingMatchesRequest {
  Filters: Filter[];
  CurrencyCode: string;
  CountryCode: string;
  Rate: string;
  SurveyJobIds: number[];
  PFJobCodes: string[];
  ExchangeJobIds: number[];
}
