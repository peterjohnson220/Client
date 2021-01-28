import { Action } from '@ngrx/store';

export const LOAD_COMPANY_FLSA_STATUSES = '[job-description-management / Job FLSA Status] Load Company FLSA Statuses';
export const LOAD_COMPANY_FLSA_STATUSES_ERROR = '[job-description-management / Job FLSA Status] Load Company FLSA Statuses Error';
export const LOAD_COMPANY_FLSA_STATUSES_SUCCESS = '[job-description-management / Job FLSA Status] Load Company FLSA Statuses Success';

export class LoadCompanyFlsaStatuses implements Action {
  readonly type = LOAD_COMPANY_FLSA_STATUSES;
}

export class LoadCompanyFlsaStatusesError implements Action {
  readonly type = LOAD_COMPANY_FLSA_STATUSES_ERROR;
}

export class LoadCompanyFlsaStatusesSuccess implements Action {
  readonly type = LOAD_COMPANY_FLSA_STATUSES_SUCCESS;

  constructor(public payload: string[]) {}
}

export type Actions
  = LoadCompanyFlsaStatuses
  | LoadCompanyFlsaStatusesError
  | LoadCompanyFlsaStatusesSuccess;
