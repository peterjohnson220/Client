import { RateType } from 'libs/data/data-sets';

import { ExchangeDataSearchFilter, generateMockExchangeDataSearchFilter } from '../exchange-data-search-filter.model';

export interface ExchangeDataCutsExportRequest {
  ExchangeName: string;
  ExchangeJobToCompanyJobIds: number[];
  FilterModel: ExchangeDataSearchFilter;
  SelectedRate: string;
}

export function generateMockExchangeDataCutsExportRequest(): ExchangeDataCutsExportRequest {
  return {
    ExchangeName: 'MockExchange',
    ExchangeJobToCompanyJobIds: [1, 2],
    FilterModel: generateMockExchangeDataSearchFilter(),
    SelectedRate: RateType.Annual
  };
}
