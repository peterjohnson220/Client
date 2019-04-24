import { Exchange, generateMockExchange } from 'libs/models/peer';

export interface ExchangeManagementDetails {
  Exchange: Exchange;
  IsSystemExchange: boolean;
  CompanyCount: number;
}

export function generateMockExchangeManagementDetails(): ExchangeManagementDetails {
  return {
    Exchange: generateMockExchange(),
    IsSystemExchange: false,
    CompanyCount: 6
  };
}
