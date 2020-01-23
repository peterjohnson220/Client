import { BaseDataView, generateMockEntity } from '../../_shared/models';

export enum DataViewAccessLevel {
  ReadOnly = 'ReadOnly',
  Edit = 'Edit',
  Owner = 'Owner'
}

export interface UserDataView extends BaseDataView {
  UserDataViewId: number;
  SortField: string;
  SortDir: 'desc' | 'asc';
  AccessLevel: DataViewAccessLevel;
}

export function generateMockUserDataView(): UserDataView {
  return {
    Entity: generateMockEntity(),
    Summary: 'Test summary',
    Name: 'New Name',
    UserDataViewId: 1,
    SortField: 'CompanyJobs_Job_Title',
    SortDir: 'asc',
    AccessLevel: DataViewAccessLevel.Owner
  };
}
