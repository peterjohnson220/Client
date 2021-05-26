import { PagingResponse, SearchFilter } from '../../search';

export interface MDJobExchangeJobSearchResponse {
  ExchangeJobResults: any[]; // TODO: [JP] Not this
  SearchFilters: SearchFilter[];
  Paging: PagingResponse;
  NoResultsMessage: string; // TODO: [JP] Not sure we set this or need it
}
