import { Action } from '@ngrx/store';

import {RoleDataRestriction, UserAssignedRole, DataType} from 'libs/models/security/roles';

export const LOAD_DATA_TYPES = '[LOAD_DATA_TYPES] Get Company Data Types';
export const LOADED_DATA_TYPES = '[LOAD_DATA_TYPES] Get Company Data Types Complete';
export const CANCEL_ROLE_DATA_RESTRICTIONS_CHANGES = '[CANCEL_CHANGES] Cancel Role Data Restrictions Changes';
export const ADD_NEW_DATA_RESTRICTION = '[ADD_NEW_DATA_RESTRICTION] Add New Data Restrictions';
export const REMOVE_DATA_RESTRICTION = '[REMOVE_DATA_RESTRICTION] Remove New Data Restrictions';
export const UPDATE_CURRENT_ROLE = '[UPDATE_CURRENT_ROLE] Update Current Role';
export const UPDATE_SINGLE_DATA_RESTRICTION = '[UPDATE_SINGLE_DATA_RESTRICTION] Update single data restriction';

export class LoadDataTypes implements Action {
  readonly type = LOAD_DATA_TYPES;
  constructor() {}
}
export class LoadedDataTypes implements Action {
  readonly type = LOADED_DATA_TYPES;
  constructor(public payload: DataType[]) {}
}

export class UpdateCurrentRole implements Action {
  readonly type = UPDATE_CURRENT_ROLE;
  constructor(public payload: UserAssignedRole) {}
}

export class UpdateSingleDataRestriction implements Action {
  readonly type = UPDATE_SINGLE_DATA_RESTRICTION;
  constructor(public dataRestriction: RoleDataRestriction, public property: string, public value: any) {
  }
}
export class CancelRoleDataRestrictionChanges implements Action {
  readonly type = CANCEL_ROLE_DATA_RESTRICTIONS_CHANGES;
  constructor() {  }
}

export class AddNewDataRestriction implements Action {
  readonly type = ADD_NEW_DATA_RESTRICTION;
  constructor(public dataType: DataType) {  }
}
export class RemoveDataRestriction implements Action {
  readonly type = REMOVE_DATA_RESTRICTION;
  constructor( public dataRestriction: RoleDataRestriction) {  }
}

export type DataAccessTabAction = LoadDataTypes
  | LoadedDataTypes
  | CancelRoleDataRestrictionChanges
  | AddNewDataRestriction
  | RemoveDataRestriction
  | UpdateCurrentRole
  | UpdateSingleDataRestriction;
