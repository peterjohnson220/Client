import { DataViewFilter } from './data-view-data-request.model';

export interface SaveUserViewFiltersRequest {
  UserDataViewId: number;
  Filters: DataViewFilter[];
}
