import { SavedFilterType } from '../saved-filter-type';

export interface UserFilterRemoveRequest {
  Type: SavedFilterType;
  SavedFilter: {
    Id: string;
  };
}
