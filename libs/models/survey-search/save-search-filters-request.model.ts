import { SearchFilter } from './search-filter.model';

export interface SaveSearchFiltersRequest {
  PayMarketId: number;
  Filters: SearchFilter[];
}
