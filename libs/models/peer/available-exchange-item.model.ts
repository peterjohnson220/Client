export interface AvailableExchangeItem {
  ExchangeId: number;
  ExchangeName: string;
  Companies: string[];
  IsValidSelection: boolean;
}

export function generateMockAvailableExchangeItem(): AvailableExchangeItem {
  return {
    ExchangeId: 1,
    ExchangeName: 'MockExchange',
    Companies: ['MockCompany'],
    IsValidSelection: false
  };
}
