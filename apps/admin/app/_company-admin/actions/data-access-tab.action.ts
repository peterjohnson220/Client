import { Action } from '@ngrx/store';

import {DataType} from 'libs/models/security/roles/data-type.model';
import {RoleDataRestriction} from 'libs/models/security/roles/role-data-restriction.model';

export const LOAD_DATA_TYPES = '[LOAD_DATA_TYPES] Get Company Data Types';
export const LOADED_DATA_TYPES = '[LOAD_DATA_TYPES] Get Company Data Types Complete';
export const UPDATE_CURRENT_ROLE_DATA_RESTRICTIONS = '[UPDATE_CURRENT_ROLE_DATA_RESTRICTIONS] Update Current Role Data Restrictions';
export const SAVE_ORIGINAL_ROLE_DATA_RESTRICTIONS = '[SAVE_ORIGINAL_ROLE_DATA_RESTRICTIONS] Unchanged Role Data Restrictions';
export const CANCEL_ROLE_DATA_RESTRICTIONS_CHANGES = '[CANCEL_CHANGES] Cancel Role Data Restrictions Changes';

export class LoadDataTypes implements Action {
  readonly type = LOAD_DATA_TYPES;
  constructor() {}
}
export class LoadedDataTypes implements Action {
  readonly type = LOADED_DATA_TYPES;
  constructor(public payload: DataType[]) {}
}

export class UpdateCurrentRoleDataRestrictions implements Action {
  readonly type = UPDATE_CURRENT_ROLE_DATA_RESTRICTIONS;
  constructor(public payload: RoleDataRestriction[]) {
  }
}

export class CancelRoleDataRestrictionChanges implements Action {
  readonly type = CANCEL_ROLE_DATA_RESTRICTIONS_CHANGES;
  constructor() {  }
}

export class SaveOriginalRoleDataRestrictions implements Action  {
  readonly type = SAVE_ORIGINAL_ROLE_DATA_RESTRICTIONS;
  constructor(public payload: RoleDataRestriction[]) {
  }
}

export type DataAccessTabAction = LoadDataTypes
  | LoadedDataTypes
  | UpdateCurrentRoleDataRestrictions
  | SaveOriginalRoleDataRestrictions
  | CancelRoleDataRestrictionChanges;
