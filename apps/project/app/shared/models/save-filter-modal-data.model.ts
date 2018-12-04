import { SavedFilter } from './saved-filter.model';
import { MultiSelectFilter } from './filter.model';

export interface SaveFilterModalData {
  Name: string;
  SetAsPayMarketDefault: boolean;
  SearchFiltersToSave: MultiSelectFilter[];
  SavedFilter?: SavedFilter;
}
