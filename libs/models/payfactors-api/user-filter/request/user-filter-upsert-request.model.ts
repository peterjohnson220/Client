import { SearchFilter } from '../../search';
import { SavedFilterType } from '../saved-filter-type';

export interface UserFilterUpsertRequest {
  SavedFilter: SavedFilter;
  Type: SavedFilterType;
}

interface SavedFilter {
  Id?: string;
  Name?: string;
  MetaInfo?: any;
  Filters?: SearchFilter[];
}
