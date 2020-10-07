import { RateType, WeightType } from 'libs/data/data-sets';

import { BaseExchangeDataSearchRequest } from '../../payfactors-api/peer/exchange-data-search/request';

export interface ExchangeDataCutsExportRequest {
  ExchangeId: number;
  ExchangeName: string;
  ExchangeJobToCompanyJobIds: number[];
  FilterModel: BaseExchangeDataSearchRequest;
  SelectedRate: string;
  SelectedExchangeScopeIds: number[];
  SelectedWeightingType: string;
  SelectedCurrency: string;
}

export function generateMockExchangeDataCutsExportRequest(): ExchangeDataCutsExportRequest {
  return {
    ExchangeId: 44,
    ExchangeName: 'MockExchange',
    ExchangeJobToCompanyJobIds: [1, 2],
    FilterModel: {} as BaseExchangeDataSearchRequest,
    SelectedRate: RateType.Annual,
    SelectedExchangeScopeIds: [1,2,3],
    SelectedWeightingType: WeightType.Inc,
    SelectedCurrency: 'USD'
  };
}
