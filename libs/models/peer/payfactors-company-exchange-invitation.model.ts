import { ExchangeInvitation, generateMockExchangeInvitation } from './exchange-invitation.model';

export interface PayfactorsCompanyExchangeInvitation extends ExchangeInvitation {
  CompanyId: number;
  CompanyRevenue: number;
  CompanyFullTimeEmployees: number;
}

export function generateMockPayfactorsCompanyExchangeInvitation(): PayfactorsCompanyExchangeInvitation {
  return {
    ...generateMockExchangeInvitation(),
    CompanyId: 1,
    CompanyRevenue: 1000000000,
    CompanyFullTimeEmployees: 50000
  };
}
