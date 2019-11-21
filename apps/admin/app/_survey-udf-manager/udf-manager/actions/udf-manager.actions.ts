import { HttpErrorResponse } from '@angular/common/http';

import { Action } from '@ngrx/store';
import { CompanyBaseInformation } from 'libs/models/company';
import { UdfDataResponse } from 'libs/models/payfactors-api/survey/response/udf-data-response.model';
import { UdfSettingsRequestModel } from 'libs/models/payfactors-api/survey/request/udf-settings-request.model';

export const LOAD_UDF_COMPANIES = '[Site Admin - Survey Custom Field Manager] Load Companies List';
export const LOAD_UDF_COMPANIES_SUCCESS = '[Site Admin - Survey Custom Field Manager] Load Companies List Success';
export const LOAD_UDF_COMPANIES_ERROR = '[Site Admin - Survey Custom Field Manager] Load Companies List Error';
export const SET_SELECTED_COMPANY = '[Site Admin - Survey Custom Field Manager] Set Selected Company';
export const UNSELECT_COMPANY = '[Site Admin - Survey Custom Field Manager] Unselected Company';

export const GET_SURVEY_UDFS = '[Site Admin - Survey Custom Field Manager] Get Survey UDFs';
export const GET_SURVEY_UDFS_SUCCESS = '[Site Admin - Survey Custom Field Manager] Get Survey UDFs Success';
export const GET_SURVEY_UDFS_ERROR = '[Site Admin - Survey Custom Field Manager] Get Survey UDFs Error';

export const CONFIRM_SAVE = '[Site Admin - Survey Custom Field Manager] Confirm Save';
export const DISMISS_SAVE = '[Site Admin - Survey Custom Field Manager] Dismiss Save';

export const SAVE_SURVEY_UDFS = '[Site Admin - Survey Custom Field Manager] Save Survey UDFs';
export const SAVE_SURVEY_UDFS_SUCCESS = '[Site Admin - Survey Custom Field Manager] Save Survey UDFs Success';
export const SAVE_SURVEY_UDFS_ERROR = '[Site Admin - Survey Custom Field Manager] Save Survey UDFs Error';

export class LoadUdfCompanies implements Action {
  readonly type = LOAD_UDF_COMPANIES;

  constructor (public payload?: any) {}
}

export class LoadUdfCompaniesSuccess implements Action {
  readonly type = LOAD_UDF_COMPANIES_SUCCESS;

  constructor (public payload: CompanyBaseInformation[]) {}
}

export class LoadUdfCompaniesError implements Action {
  readonly type = LOAD_UDF_COMPANIES_ERROR;
}

export class SetSelectedCompany implements Action {
  readonly type = SET_SELECTED_COMPANY;

  constructor (public payload: CompanyBaseInformation) {}
}

export class UnselectCompany implements Action {
  readonly type = UNSELECT_COMPANY;
}

export class GetSurveyUdfs implements Action {
  readonly type = GET_SURVEY_UDFS;

  constructor (public payload: number) {}
}

export class GetSurveyUdfsSuccess implements Action {
  readonly type = GET_SURVEY_UDFS_SUCCESS;

  constructor (public payload: UdfDataResponse) {}
}

export class GetSurveyUdfsError implements Action {
  readonly type = GET_SURVEY_UDFS_ERROR;
}

export class ConfirmSave implements Action {
  readonly type = CONFIRM_SAVE;
}

export class DismissSave implements Action {
  readonly type = DISMISS_SAVE;
}

export class SaveSurveyUdfs implements Action {
  readonly type = SAVE_SURVEY_UDFS;

  constructor (public companyId: number, public udfSettings: UdfSettingsRequestModel[]) {}
}

export class SaveSurveyUdfsSuccess implements Action {
  readonly type = SAVE_SURVEY_UDFS_SUCCESS;
}

export class SaveSurveyUdfsError implements Action {
  readonly type = SAVE_SURVEY_UDFS_ERROR;

  constructor(public payload: HttpErrorResponse) {}
}

export type UdfManagerActions
  = LoadUdfCompanies
  | LoadUdfCompaniesSuccess
  | LoadUdfCompaniesError
  | SetSelectedCompany
  | UnselectCompany
  | GetSurveyUdfs
  | GetSurveyUdfsSuccess
  | GetSurveyUdfsError
  | ConfirmSave
  | DismissSave
  | SaveSurveyUdfs
  | SaveSurveyUdfsSuccess
  | SaveSurveyUdfsError;
