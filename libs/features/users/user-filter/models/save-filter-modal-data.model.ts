import { Filter } from 'libs/features/search/search/models';

import { SavedFilter } from './saved-filter.model';

export interface SaveFilterModalData {
  Name: string;
  SetAsDefault: boolean;
  SearchFiltersToSave: Filter[];
  SavedFilter?: SavedFilter;
}
