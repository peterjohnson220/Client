import { BaseDataView } from './base-data-view.model';
import { generateMockEntity } from './entity.model';
import { DataViewScope } from '../../../models/payfactors-api';

export enum DataViewAccessLevel {
  ReadOnly = 'ReadOnly',
  Edit = 'Edit',
  Owner = 'Owner'
}

export interface UserDataView extends BaseDataView {
  UserDataViewId: number;
  AccessLevel: DataViewAccessLevel;
  CreateUser?: number;
}

export function generateMockUserDataView(): UserDataView {
  return {
    Entity: generateMockEntity(),
    Summary: 'Test summary',
    Name: 'New Name',
    UserDataViewId: 1,
    AccessLevel: DataViewAccessLevel.Owner,
    Scope: DataViewScope.Personal
  };
}
