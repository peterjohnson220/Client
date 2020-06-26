export interface MarketDataFeed {
  Id: number;
  EffectiveDate: Date;
  FileName: string;
  StartDate?: Date;
  EndDate?: Date;
  Completed: boolean;
  Failed: boolean;
}
