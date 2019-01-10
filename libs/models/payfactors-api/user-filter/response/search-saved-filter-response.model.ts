import { SearchFilter } from '../../search';

export interface SearchSavedFilterResponse {
  Id: string;
  Name: string;
  MetaInfo: any;
  Filters: SearchFilter[];
}
