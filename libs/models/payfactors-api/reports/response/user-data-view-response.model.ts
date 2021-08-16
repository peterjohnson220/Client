import { DataViewField, DataViewFilter } from '../request';

export interface UserDataViewResponse {
  DataView: DataViewResponse;
  Fields: DataViewField[];
  Filters: DataViewFilter[];
  AvailableFields: DataViewField[];
}

export interface DataViewResponse {
  UserDataViewId: number;
  BaseEntityId: number;
  Entity: string;
  Name: string;
  Summary: string;
  AccessLevel: DataViewAccessLevel;
  Type: string;
}

export enum DataViewAccessLevel {
  ReadOnly = 'ReadOnly',
  Edit = 'Edit',
  Owner = 'Owner'
}

export enum DataViewScope {
  Company = 'Company',
  Standard = 'Standard',
  Personal = 'Personal',
  Partner = 'Partner'
}
