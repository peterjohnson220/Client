import { ExchangeDataSearchFilter, generateMockExchangeDataSearchFilter } from '../exchange-data-search-filter.model';

export interface ExchangeDataCutsExportRequest {
  ExchangeName: string;
  ExchangeJobToCompanyJobIds: number[];
  FilterModel: ExchangeDataSearchFilter;
}

export function generateMockExchangeDataCutsExportRequest(): ExchangeDataCutsExportRequest {
  return {
    ExchangeName: 'MockExchange',
    ExchangeJobToCompanyJobIds: [1, 2],
    FilterModel: generateMockExchangeDataSearchFilter()
  };
}
