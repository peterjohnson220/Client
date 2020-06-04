import {Action} from '@ngrx/store';

export const GET_COMPANY_DESCRIPTION = '[Feature / Company Details] Get Company Description';
export const GET_COMPANY_DESCRIPTION_SUCCESS = '[Feature / Company Details] Get Company Description Success';
export const GET_COMPANY_DESCRIPTION_ERROR = '[Feature / Company Details] Get Company Description Error';
export const GET_SUBSIDIARY_DESCRIPTION = '[Feature / Company Details] Get Subsidiary Description';
export const GET_SUBSIDIARY_DESCRIPTION_SUCCESS = '[Feature / Company Details] Get Subsidiary Description Success';
export const GET_SUBSIDIARY_DESCRIPTION_ERROR = '[Feature / Company Details] Get Subsidiary Description Error';

export class GetCompanyDescription implements Action {
  readonly type = GET_COMPANY_DESCRIPTION;
  constructor(public payload: number) {}
}

export class GetCompanyDescriptionSuccess implements Action {
  readonly type = GET_COMPANY_DESCRIPTION_SUCCESS;
  constructor(public payload: string) {}
}

export class GetCompanyDescriptionError implements Action {
  readonly type = GET_COMPANY_DESCRIPTION_ERROR;
}

export class GetSubsidiaryDescription implements Action {
  readonly type = GET_SUBSIDIARY_DESCRIPTION;
  constructor(public payload: number) {}
}

export class GetSubsidiaryDescriptionSuccess implements Action {
  readonly type = GET_SUBSIDIARY_DESCRIPTION_SUCCESS;
  constructor(public payload: string) {}
}

export class GetSubsidiaryDescriptionError implements Action {
  readonly type = GET_SUBSIDIARY_DESCRIPTION_ERROR;
}

export type Actions
  = GetCompanyDescription
| GetCompanyDescriptionSuccess
| GetCompanyDescriptionError
| GetSubsidiaryDescription
| GetSubsidiaryDescriptionSuccess
| GetSubsidiaryDescriptionError;
