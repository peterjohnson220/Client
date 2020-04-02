export interface ExchangeDataSet {
  ExchangeName: string;
  ExchangeId: number;
  Active: boolean;
}

export function generateMockExchangeDataSet(): ExchangeDataSet {
  return {
    ExchangeName: 'All Companies',
    ExchangeId: 14,
    Active: true
  };
}
