import { RateType, WeightType } from 'libs/data/data-sets';

import { ExchangeDataSearchFilter, generateMockExchangeDataSearchFilter } from '../exchange-data-search-filter.model';

export interface ExchangeDataCutsExportRequest<TFilterType> {
  ExchangeId: number;
  ExchangeName: string;
  ExchangeJobToCompanyJobIds: number[];
  FilterModel: TFilterType;
  SelectedRate: string;
  SelectedExchangeScopeGuids: string[];
  SelectedWeightingType: string;
  SelectedCurrency: string;
}

export function generateMockExchangeDataCutsExportRequest(): ExchangeDataCutsExportRequest<ExchangeDataSearchFilter> {
  return {
    ExchangeId: 44,
    ExchangeName: 'MockExchange',
    ExchangeJobToCompanyJobIds: [1, 2],
    FilterModel: generateMockExchangeDataSearchFilter(),
    SelectedRate: RateType.Annual,
    SelectedExchangeScopeGuids: ['1234567890'],
    SelectedWeightingType: WeightType.Inc,
    SelectedCurrency: 'USD'
  };
}
