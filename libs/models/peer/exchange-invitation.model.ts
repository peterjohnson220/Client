export interface ExchangeInvitation {
  ExchangeId: number;
  DocumentId: string;
  CompanyName: string;
  CompanyIndustry: string;
  RequestUser: string;
  RequestCompany: string;
  RequestDate: any;
  Reason: string;
  PayfactorsCompany: boolean;
}

export function generateMockExchangeInvitation(): ExchangeInvitation {
  return {
    ExchangeId: 1,
    DocumentId: '1234',
    CompanyName: 'Mock Company',
    CompanyIndustry: 'Retail',
    RequestUser: 'Bob Johnson',
    RequestCompany: 'Mock Request Company',
    RequestDate: '01-01-2018',
    Reason: 'Because',
    PayfactorsCompany: true
  };
}
