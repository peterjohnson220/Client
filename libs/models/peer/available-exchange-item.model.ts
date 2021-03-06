export interface AvailableExchangeItem {
  ExchangeId: number;
  ExchangeName: string;
  TopIndustries: string[];
  CompanyNames: string[];
  JobCount: number;
  PendingAccess: boolean;
  InExchange: boolean;
}

export function generateMockAvailableExchangeItem(): AvailableExchangeItem {
  return {
    ExchangeId: 1,
    ExchangeName: 'MockExchange',
    TopIndustries: ['MockIndustry'],
    CompanyNames: ['MockCompany'],
    JobCount: 1,
    PendingAccess: false,
    InExchange: false
  };
}
