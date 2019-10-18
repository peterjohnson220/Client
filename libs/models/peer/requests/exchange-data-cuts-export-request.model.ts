import { RateType } from 'libs/data/data-sets';

import { ExchangeDataSearchFilter, generateMockExchangeDataSearchFilter } from '../exchange-data-search-filter.model';

export interface ExchangeDataCutsExportRequest {
  ExchangeId: number;
  ExchangeName: string;
  ExchangeJobToCompanyJobIds: number[];
  FilterModel: ExchangeDataSearchFilter;
  SelectedRate: string;
  SelectedExchangeScopeGuids: string[];
}

export function generateMockExchangeDataCutsExportRequest(): ExchangeDataCutsExportRequest {
  return {
    ExchangeId: 44,
    ExchangeName: 'MockExchange',
    ExchangeJobToCompanyJobIds: [1, 2],
    FilterModel: generateMockExchangeDataSearchFilter(),
    SelectedRate: RateType.Annual,
    SelectedExchangeScopeGuids: ['1234567890']
  };
}
