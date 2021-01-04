export interface GetPricingHistoryRequest {
  JobId: number;
  PayMarketIds: number[];
  StartDate: Date;
  EndDate: Date;
}
