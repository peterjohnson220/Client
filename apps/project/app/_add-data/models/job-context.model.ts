export interface JobContext {
  JobTitle: string;
  PayMarketId: number;
  CurrencyCode: string;
}

export function generateMockJobContext(): JobContext {
  return {
    JobTitle: 'Accountant',
    PayMarketId: 1234,
    CurrencyCode: 'USD'
  };
}
