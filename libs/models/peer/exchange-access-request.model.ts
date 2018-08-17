export interface ExchangeAccessRequest {
  CompanyId: number;
  ExchangeId: number;
  CompanyName: string;
  CompanyIndustry: string;
  CompanyLocation: string;
  Reason: string;
  RequestUser: string;
  RequestDate: any;
}

export function generateMockExchangeAccessRequest(): ExchangeAccessRequest {
  return {
    CompanyId: 1,
    ExchangeId: 1,
    CompanyName: 'Mock Company',
    CompanyIndustry: 'Retail',
    CompanyLocation: 'Boston, MA',
    Reason: 'Because',
    RequestUser: 'Bob Jones',
    RequestDate: '01-01-2018'
  };
}
