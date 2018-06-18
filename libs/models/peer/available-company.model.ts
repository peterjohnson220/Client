import {ExchangeStatusEnum} from './exchange-status.enum';

export interface AvailableCompany {
  CompanyId: number;
  CompanyName: string;
  Industry: string;
  Revenue: number;
  FTEs: string;
  City: string;
  State: string;
  ZipCode: string;
  Status: ExchangeStatusEnum;
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
    Status: null
  };
}
