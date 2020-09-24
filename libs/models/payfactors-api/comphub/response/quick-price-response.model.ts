import { JobPricingLimitInfoResponse } from './job-pricing-limit-info-response.model';

export interface QuickPriceListResponse extends QuickPriceResponse {
  Count: number;
  Data: QuickPriceMarketData[];
}

export interface QuickPriceJobDataResponse extends QuickPriceResponse {
  Data: QuickPriceMarketData;
}

export interface QuickPriceResponse {
  PricingLimitInfo: JobPricingLimitInfoResponse;
  MinPaymarketMinimumWage: number;
  MaxPaymarketMinimumWage: number;
}

export interface QuickPriceMarketData {
  JobId: number;
  JobCode: string;
  JobTitle: string;
  JobDescription: string;
  Education: string;
  YearsOfExperience: string;
  ManagesEmployees: boolean;
  FLSAStatus: string;
  Skills: string[];
  Base25?: number;
  Base50?: number;
  Base75?: number;
  Tcc25?: number;
  Tcc50?: number;
  Tcc75?: number;
  Incs?: number;
  Orgs?: number;
}

