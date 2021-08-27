import { DataViewScope } from './../response/user-data-view-response.model';

export interface DuplicateUserViewRequest {
  UserDataViewId: number;
  Name: string;
  Summary: string;
  Scope: DataViewScope;
}
