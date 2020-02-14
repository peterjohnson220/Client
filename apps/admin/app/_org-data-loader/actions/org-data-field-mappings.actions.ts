import { Action } from '@ngrx/store';
import { FieldMappingsDTO, LoaderFieldSet } from 'libs/models/data-loads';

export const LOADING_FIELD_MAPPINGS = '[Org Data Autoloader/Field Mappings] Loading Field Mappings';
export const LOADING_FIELD_MAPPINGS_ERROR = '[Org Data Autoloader/Field Mappings] Loading Field Mappings Error';
export const LOADING_FIELD_MAPPINGS_SUCCESS = '[Org Data Autoloader/Field Mappings] Loading Field Mappings Success';
export const SAVING_FIELD_MAPPINGS = '[Org Data Autoloader/Field Mappings] Saving Field Mappings';
export const SAVING_FIELD_MAPPINGS_ERROR = '[Org Data Autoloader/Field Mappings] Saving Field Mappings Error';
export const SAVING_FIELD_MAPPINGS_SUCCESS = '[Org Data Autoloader/Field Mappings] Saving Field Mappings Success';

export class LoadingFieldMappings implements Action {
  readonly type = LOADING_FIELD_MAPPINGS;

  constructor(public companyId: number, public configGroupId: number) {}
}

export class LoadingFieldMappingsError implements Action {
  readonly type = LOADING_FIELD_MAPPINGS_ERROR;
}

export class LoadingFieldMappingsSuccess implements Action {
  readonly type = LOADING_FIELD_MAPPINGS_SUCCESS;

  constructor(public payload: LoaderFieldSet[]) {}
}

export class SavingFieldMappings implements Action {
  readonly type = SAVING_FIELD_MAPPINGS;

  constructor(public payload: FieldMappingsDTO) {}
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
= LoadingFieldMappings
| LoadingFieldMappingsError
| LoadingFieldMappingsSuccess
| SavingFieldMappings
| SavingFieldMappingsError
| SavingFieldMappingsSuccess;
