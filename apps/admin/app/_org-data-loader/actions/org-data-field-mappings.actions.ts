import { Action } from '@ngrx/store';

export const SAVING_FIELD_MAPPINGS = '[Org Data Autoloader/Field Mappings] Saving Field Mappings';
export const SAVING_FIELD_MAPPINGS_ERROR = '[Org Data Autoloader/Field Mappings] Saving Field Mappings Error';
export const SAVING_FIELD_MAPPINGS_SUCCESS = '[Org Data Autoloader/Field Mappings] Saving Field Mappings Success';

export class SavingFieldMappings implements Action {
  readonly type = SAVING_FIELD_MAPPINGS;

  constructor(public payload: any) {}
}
export class SavingFieldMappingsError implements Action {
  readonly type = SAVING_FIELD_MAPPINGS_ERROR;

  constructor(public payload: any = null) {}
}
export class SavingFieldMappingsSuccess implements Action {
  readonly type = SAVING_FIELD_MAPPINGS_SUCCESS;

  constructor(public payload: any = null) {}
}

export type Actions
= SavingFieldMappings
| SavingFieldMappingsError
| SavingFieldMappingsSuccess;
