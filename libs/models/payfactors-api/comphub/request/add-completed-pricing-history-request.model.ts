export interface AddCompletedPricingHistoryRequest {
  JobTitleShort: string;
  JobTitle: string;
  JobCode: string;
  CountryCode: string;
  CompanyPayMarketId?: number;
  Base25?: number;
  Base50?: number;
  Base75?: number;
  Tcc25?: number;
  Tcc50?: number;
  Tcc75?: number;
  Incs?: number;
  Orgs?: number;
}
