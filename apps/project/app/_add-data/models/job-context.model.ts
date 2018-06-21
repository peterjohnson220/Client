export interface JobContext {
  JobTitle: string;
  PayMarketId: number;
}

export function generateMockJobContext(): JobContext {
  return {
    JobTitle: 'Accountant',
    PayMarketId: 1234
  };
}
