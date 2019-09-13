export interface UserDataViewResponse {
  UserDataViewId: number;
  BaseEntityId: number;
  Entity: string;
  Name: string;
  Summary: string;
  SortField: string;
  SortDir: 'desc' | 'asc';
}
