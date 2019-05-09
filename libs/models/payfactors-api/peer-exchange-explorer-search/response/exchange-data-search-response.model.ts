import { PagingResponse, SearchFilter, generateMockSearchFilter } from '../../search/response';
import { ExchangeMapResponse, generateMockExchangeMapResponse } from '../../../peer';
import {SearchFilterMappingDataObj} from '../../../../features/search/models';

export interface ExchangeDataSearchResponse extends ExchangeMapResponse {
  Paging: PagingResponse;
  SearchFilters: SearchFilter[];
  SearchFilterMappingDataObj: SearchFilterMappingDataObj;
}

export function generateMockExchangeDataSearchResponse(): ExchangeDataSearchResponse {
  return {
    ...generateMockExchangeMapResponse(),
    Paging: {
      TotalRecordCount: 20,
      RecordsReturned: 10
    },
    SearchFilters: [generateMockSearchFilter()],
    SearchFilterMappingDataObj: {}
  };
}
