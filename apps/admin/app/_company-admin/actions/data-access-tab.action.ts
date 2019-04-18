import { Action } from '@ngrx/store';

import {DataType} from 'libs/models/security/roles/data-type';

export const LOAD_DATA_TYPES = '[LOAD_DATA_TYPES] Get Company Data Types';
export const LOADED_DATA_TYPES = '[LOAD_DATA_TYPES] Get Company Data Types Complete';

export class LoadDataTypes implements Action {
  readonly type = LOAD_DATA_TYPES;
  constructor() {}
}
export class LoadedDataTypes implements Action {
  readonly type = LOADED_DATA_TYPES;
  constructor(public payload: DataType[]) {}
}

export type DataAccessTabAction = LoadDataTypes
  | LoadedDataTypes;
