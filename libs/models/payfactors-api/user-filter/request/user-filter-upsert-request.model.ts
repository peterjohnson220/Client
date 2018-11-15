import { SearchFilter } from '../../../survey-search';
import { SurveySavedFilterMetaInfo } from '../survey-saved-filter-meta-info';
import { SavedFilterType } from '../saved-filter-type';

export interface UserFilterUpsertRequest {
  SavedFilter: SavedFilter;
  Type: SavedFilterType;
}

interface SavedFilter {
  Id?: string;
  Name?: string;
  MetaInfo?: SurveySavedFilterMetaInfo;
  Filters?: SearchFilter[];
}
