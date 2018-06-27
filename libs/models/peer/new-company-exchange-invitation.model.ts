import { ExchangeInvitation, generateMockExchangeInvitation } from './exchange-invitation.model';

export interface NewCompanyExchangeInvitation extends ExchangeInvitation {
  ContactName: string;
  ContactEmailAddress: string;
  ContactJobTitle: string;
  ContactPhoneNumber: string;
}

export function generateMockNewCompanyExchangeInvitation(): NewCompanyExchangeInvitation {
  return {
    ...generateMockExchangeInvitation(),
    ContactName: 'John Bobson',
    ContactEmailAddress: 'jb@nothing.com',
    ContactJobTitle: 'Manager',
    ContactPhoneNumber: '555-555-5555'
  };
}
