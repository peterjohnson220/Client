export interface FilterAggregateSelection {
  Exchanges: string[];
  States: string[];
  Cities: string[];
  Companies: string[];
  CompanyIndustries: string[];
  ExchangeJobFamilies: string[];
  ExchangeJobLevels: string[];
  ExchangeJobFLSAStatuses: string[];
}

export function generateMockFilterAggregateSelection(): FilterAggregateSelection {
  return {
    Exchanges: ['1st Exchange'],
    States: ['MA', 'NH'],
    Cities: [],
    Companies: [],
    CompanyIndustries: ['Engineering'],
    ExchangeJobFamilies: [],
    ExchangeJobLevels: [],
    ExchangeJobFLSAStatuses: []
  };
}
