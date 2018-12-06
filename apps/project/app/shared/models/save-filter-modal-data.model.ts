import { SavedFilter } from './saved-filter.model';

export interface SaveFilterModalData {
  Name: string;
  SetAsPayMarketDefault: boolean;
  SavedFilter?: SavedFilter;
}
