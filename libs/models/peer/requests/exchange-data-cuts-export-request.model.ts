import { RateType } from 'libs/data/data-sets';
import { WeightingType } from 'libs/constants/weighting-type';

import { ExchangeDataSearchFilter, generateMockExchangeDataSearchFilter } from '../exchange-data-search-filter.model';

export interface ExchangeDataCutsExportRequest<TFilterType> {
  ExchangeId: number;
  ExchangeName: string;
  ExchangeJobToCompanyJobIds: number[];
  FilterModel: TFilterType;
  SelectedRate: string;
  SelectedExchangeScopeGuids: string[];
  SelectedWeightingType: string;
}

export function generateMockExchangeDataCutsExportRequest(): ExchangeDataCutsExportRequest<ExchangeDataSearchFilter> {
  return {
    ExchangeId: 44,
    ExchangeName: 'MockExchange',
    ExchangeJobToCompanyJobIds: [1, 2],
    FilterModel: generateMockExchangeDataSearchFilter(),
    SelectedRate: RateType.Annual,
    SelectedExchangeScopeGuids: ['1234567890'],
    SelectedWeightingType: WeightingType.INC
  };
}
