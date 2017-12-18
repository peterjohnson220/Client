export interface ExchangeCompany {
  CompanyId: number;
  CompanyName: string;
  Industry: string;
  JobCount: number;
  City: string;
  State: string;
  Location: string;
}

export function generateMockExchangeCompany(): ExchangeCompany {
  return {
    CompanyId: 1,
    CompanyName: 'Mock Company',
    Industry: 'Hospitality',
    JobCount: 2832,
    City: 'Boston"',
    State: 'MA',
    Location: 'Boston, MA'
  };
}
