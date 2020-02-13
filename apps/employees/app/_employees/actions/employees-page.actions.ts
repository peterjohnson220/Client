import { Action } from '@ngrx/store';

export const PRICE_JOBS = '[Employees / Employees Page] Price Jobs';
export const PRICE_JOBS_SUCCESS = '[Employees / Employees Page] Price Jobs Success';
export const PRICE_JOBS_ERROR = '[Employees / Employees Page] Price Jobs Error';
export const RESET_PRICING_JOBS_STATUS = '[Employees / Employees Page] Reset Pricing Jobs Status';

export class PriceJobs implements Action {
  readonly type = PRICE_JOBS;

  constructor(public payload: { companyEmployeeIds: number[] }) {}
}

export class PriceJobsSuccess implements Action {
  readonly type = PRICE_JOBS_SUCCESS;

  constructor(public payload: { projectId: number }) {}
}

export class PriceJobsError implements Action {
  readonly type = PRICE_JOBS_ERROR;

  constructor() {}
}

export class ResetPricingJobsStatus implements Action {
  readonly type = RESET_PRICING_JOBS_STATUS;

  constructor() {}
}

export type Actions
  = PriceJobs
  | PriceJobsSuccess
  | PriceJobsError
  | ResetPricingJobsStatus;
