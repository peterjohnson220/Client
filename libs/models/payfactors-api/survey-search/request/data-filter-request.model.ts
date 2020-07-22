import { SearchField, SearchFilter } from '../../search';

export interface DataFilterRequest {
  SearchFields: SearchField[];
  Filters: SearchFilter[];
  CurrencyCode: string;
  Rate: string;
}
