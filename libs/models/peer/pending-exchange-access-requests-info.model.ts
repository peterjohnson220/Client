export interface PendingExchangeAccessRequestsInfo {
  CompanyId: number;
  ExchangeId: number;
  CompanyName: string;
  CompanyIndustry: string;
  CompanyLocation: string;
  RequestUser: string;
  RequestDate: string;
}

export function generateMockPendingExchangeAccessRequestsInfo(): PendingExchangeAccessRequestsInfo {
  return {
    CompanyId: 1,
    ExchangeId: 1,
    CompanyName: 'Mock Company',
    CompanyIndustry: 'Retail',
    CompanyLocation: 'Boston, MA',
    RequestUser: 'Bob Jones',
    RequestDate: '01-01-2018'
  };
}
