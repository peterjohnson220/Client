import { PagingResponse, SearchFilter } from '../../search';
import { RelationalExchangeJobResult } from '../../../peer';

export interface RelationalExchangeJobSearchResponse {
  ExchangeJobResults: RelationalExchangeJobResult[];
  SearchFilters: SearchFilter[];
  Paging: PagingResponse;
  NoResultsMessage: string;
}
