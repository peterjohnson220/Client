export interface AvailableExchangeItem {
  ExchangeId: number;
  ExchangeName: string;
  TopIndustries: string[];
  Companies: string[];
  JobCount: number;
  ValidRequest: boolean;
}

export function generateMockAvailableExchangeItem(): AvailableExchangeItem {
  return {
    ExchangeId: 1,
    ExchangeName: 'MockExchange',
    TopIndustries: ['MockIndustry'],
    Companies: ['MockCompany'],
    JobCount: 1,
    ValidRequest: false
  };
}
