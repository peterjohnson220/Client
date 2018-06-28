export interface ExchangeInvitation {
  ExchangeId: number;
  CompanyName: string;
  CompanyIndustry: string;
  RequestUser: string;
  RequestCompany: string;
  RequestDate: any;
}

export function generateMockExchangeInvitation(): ExchangeInvitation {
  return {
    ExchangeId: 1,
    CompanyName: 'Mock Company',
    CompanyIndustry: 'Retail',
    RequestUser: 'Bob Johnson',
    RequestCompany: 'Mock Request Company',
    RequestDate: '01-01-2018'
  };
}
