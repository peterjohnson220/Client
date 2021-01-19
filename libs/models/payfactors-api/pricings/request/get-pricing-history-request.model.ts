export interface GetPricingHistoryRequest {
  JobId: number;
  PayMarketIds: number[];
  Rate: string;
  Currency: string;
  StartDate: Date;
  EndDate: Date;
}
