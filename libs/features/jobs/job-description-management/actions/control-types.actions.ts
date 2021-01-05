import { Action } from '@ngrx/store';

export const LOAD_CONTROL_TYPES = '[LOAD_CONTROL_TYPES / load ControlTypes Success] Load Control Types';
export const LOAD_CONTROL_TYPES_SUCCESS = '[LOAD_CONTROL_TYPES_SUCCESS / load Control Types Success] Load Control Types Success';
export const LOAD_HISTORICAL_CONTROL_TYPES = '[LOAD_HISTORICAL_CONTROL_TYPES / load historical ControlTypes Success] Load Historical Control Types';
export const LOAD_HISTORICAL_CONTROL_TYPES_SUCCESS = '[LOAD_HISTORICAL_CONTROL_TYPES_SUCCESS / load historical Control Types Success] Load Historical Control Types Success';

export class LoadControlTypes implements Action {
  readonly type = LOAD_CONTROL_TYPES;
}

export class LoadControlTypesSuccess implements Action {
  readonly type = LOAD_CONTROL_TYPES_SUCCESS;
  constructor(public payload: string) {}
}

export class LoadHistoricalControlTypes implements Action {
  readonly type = LOAD_HISTORICAL_CONTROL_TYPES;
}

export class LoadHistoricalControlTypesSuccess implements Action {
  readonly type = LOAD_HISTORICAL_CONTROL_TYPES_SUCCESS;
  constructor(public payload: string) {}
}

export type ControlTypeActions =
  LoadControlTypesSuccess
  | LoadControlTypes
  | LoadHistoricalControlTypes
  | LoadHistoricalControlTypesSuccess;
