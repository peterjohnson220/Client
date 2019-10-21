import { DataViewField, DataViewFilter } from '../request';

export interface UserDataViewResponse {
  DataView: DataViewResponse;
  Fields: DataViewField[];
  Filters: DataViewFilter[];
}

export interface DataViewResponse {
  UserDataViewId: number;
  BaseEntityId: number;
  Entity: string;
  Name: string;
  Summary: string;
  SortField: string;
  SortDir: 'desc' | 'asc';
  AccessLevel: DataViewAccessLevel;
}

export enum DataViewAccessLevel {
  ReadOnly = 'ReadOnly',
  Edit = 'Edit',
  Owner = 'Owner'
}
