import { MultiSelectFilter } from 'libs/features/search/models';

import { SavedFilter } from './saved-filter.model';

export interface SaveFilterModalData {
  Name: string;
  SetAsDefault: boolean;
  SearchFiltersToSave: MultiSelectFilter[];
  SavedFilter?: SavedFilter;
}
