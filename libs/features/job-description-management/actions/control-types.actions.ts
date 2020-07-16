import { Action } from '@ngrx/store';

export const LOAD_CONTROL_TYPES = '[LOAD_CONTROL_TYPES / load ControlTypes Success] Load Job Families';
export const LOAD_CONTROL_TYPES_SUCCESS = '[LOAD_CONTROL_TYPES_SUCCESS / load Control Types Success] Load Job Families Error';

export class LoadControlTypes implements Action {
  readonly type = LOAD_CONTROL_TYPES;
}

export class LoadControlTypesSuccess implements Action {
  readonly type = LOAD_CONTROL_TYPES_SUCCESS;
  constructor(public payload: string) {}
}

export type ControlTypeActions =
  LoadControlTypesSuccess
  | LoadControlTypes;
