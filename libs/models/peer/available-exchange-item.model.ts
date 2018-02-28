export interface AvailableExchangeItem {
  ExchangeId: number;
  ExchangeName: string;
  Companies: string[];
  ValidRequest: boolean;
}

export function generateMockAvailableExchangeItem(): AvailableExchangeItem {
  return {
    ExchangeId: 1,
    ExchangeName: 'MockExchange',
    Companies: ['MockCompany'],
    ValidRequest: false
  };
}
