import { Action } from '@ngrx/store';

export const INITIATE_ORG_DATA_EXPORT = '[Navigation Links/Org Data Export] Initiate Org Data Export';
export const INITIATE_ORG_DATA_EXPORT_SUCCESS = '[Navigation Links/Org Data Export] Initiate Org Data Export Success';
export const INITIATE_ORG_DATA_EXPORT_ERROR = '[Navigation Links/Org Data Export] Initiate Org Data Export Error';

export class InitiateOrgDataExport implements Action {
  readonly type = INITIATE_ORG_DATA_EXPORT;
}

export class InitiateOrgDataExportSuccess implements Action {
  readonly type = INITIATE_ORG_DATA_EXPORT_SUCCESS;
}

export class InitiateOrgDataExportError implements Action {
  readonly type = INITIATE_ORG_DATA_EXPORT_ERROR;
}

export type Actions
  = InitiateOrgDataExport
  | InitiateOrgDataExportSuccess
  | InitiateOrgDataExportError;
