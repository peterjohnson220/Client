import { Action } from '@ngrx/store';

export const GET_STANDARD_REPORT_VIEW_URL = '[Data Insights/Reports View Page] Get Standard Report View Url';
export const GET_STANDARD_REPORT_VIEW_URL_SUCCESS = '[Data Insights/Reports View Page] Get Standard View Url Report Success';
export const GET_STANDARD_REPORT_VIEW_URL_ERROR = '[Data Insights/Reports View Page] Get Standard View Url Report Error';

export class GetStandardReportViewUrl implements Action {
  readonly type = GET_STANDARD_REPORT_VIEW_URL;

  constructor(public payload: string) {}
}

export class GetStandardReportViewUrlSuccess implements Action {
  readonly type = GET_STANDARD_REPORT_VIEW_URL_SUCCESS;

  constructor(public payload: string) {}
}

export class GetStandardReportViewUrlError implements Action {
  readonly type = GET_STANDARD_REPORT_VIEW_URL_ERROR;
}

export type Actions
  = GetStandardReportViewUrl
  | GetStandardReportViewUrlSuccess
  | GetStandardReportViewUrlError;
