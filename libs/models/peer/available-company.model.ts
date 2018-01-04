export interface AvailableCompany {
  CompanyId: number;
  CompanyName: string;
  Industry: string;
  Revenue: number;
  FTEs: string;
  City: string;
  State: string;
  ZipCode: string;
  InExchange: boolean;
}

export function generateMockAvailableCompany(): AvailableCompany {
  return {
    CompanyId: 1,
    CompanyName: 'Mock Company',
    Industry: 'Mock Industry',
    Revenue: 100000000,
    FTEs: 'Mock FTEs',
    City: 'Mock City',
    State: 'Mock State',
    ZipCode: 'Mock Zip Code',
    InExchange: false
  };
}
