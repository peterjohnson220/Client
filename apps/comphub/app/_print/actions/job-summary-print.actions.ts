import { Action } from '@ngrx/store';

import { JobSummaryPrintData } from 'libs/models/comphub';


export const GET_JOB_SUMMARY_PRINT_DATA = '[Comphub/Job Summary Print] Get Job Summary Print Data';
export const GET_JOB_SUMMARY_PRINT_DATA_SUCCESS = '[Comphub/Job Summary Print] Get Job Summary Print Data Success';
export const GET_JOB_SUMMARY_PRINT_DATA_ERROR = '[Comphub/Job Summary Print] Get Job Summary Print Data Error';

export class GetJobSummaryPrintData implements Action {
  readonly type = GET_JOB_SUMMARY_PRINT_DATA;

  constructor(public payload: string) {}
}

export class GetJobSummaryPrintDataSuccess implements Action {
  readonly type = GET_JOB_SUMMARY_PRINT_DATA_SUCCESS;

  constructor(public payload: JobSummaryPrintData) {}
}

export class GetJobSummaryPrintDataError implements Action {
  readonly type = GET_JOB_SUMMARY_PRINT_DATA_ERROR;

  constructor() {}
}

export type Actions
  = GetJobSummaryPrintData
  | GetJobSummaryPrintDataSuccess
  | GetJobSummaryPrintDataError;
