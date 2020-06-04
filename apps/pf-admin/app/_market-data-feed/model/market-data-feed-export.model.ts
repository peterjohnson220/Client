export interface MarketDataFeedExport {
  FeedId: number;
  EffectiveDate: Date;
  Completed: boolean;
  Failed: boolean;
  FileName: string;
}

export function generateMockMarketDataFeedExport(): MarketDataFeedExport[] {
  return [
    {
      FeedId: 1,
      EffectiveDate: new Date('01/01/2000'),
      Completed: true,
      Failed: false,
      FileName: 'MyReportFeed1234.csv'
    },
    {
      FeedId: 2,
      EffectiveDate: new Date('01/02/2001'),
      Completed: true,
      Failed: false,
      FileName: 'MyReportFeed9876.csv'
    }
  ];
}
