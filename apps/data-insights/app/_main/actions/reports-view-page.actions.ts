import { Action } from '@ngrx/store';

export const GET_STANDARD_REPORT_VIEW_URL = '[Data Insights/Reports View Page] Get Standard Report View Url';
export const GET_STANDARD_REPORT_SHEET_VIEW_URL = '[Data Insights/Reports View Page] Get Standard Report Sheet View Url';
export const GET_COMPANY_REPORT_VIEW_URL = '[Data Insights/Reports View Page] Get Company Report View Url';
export const GET_COMPANY_REPORT_SHEET_VIEW_URL = '[Data Insights/Reports View Page] Get Company Report Sheet View Url';
export const GET_VIEW_URL_SUCCESS = '[Data Insights/Reports View Page] Get View Url Report Success';
export const GET_VIEW_URL_ERROR = '[Data Insights/Reports View Page] Get View Url Report Error';

export class GetStandardReportViewUrl implements Action {
  readonly type = GET_STANDARD_REPORT_VIEW_URL;

  constructor(public payload: { workbookId: string }) {}
}

export class GetStandardReportSheetViewUrl implements Action {
  readonly type = GET_STANDARD_REPORT_SHEET_VIEW_URL;

  constructor(public payload: {workbookName: string, viewName: string}) {}
}

export class GetCompanyReportViewUrl implements Action {
  readonly type = GET_COMPANY_REPORT_VIEW_URL;

  constructor(public payload: { workbookId: string }) {}
}

export class GetCompanyReportSheetViewUrl implements Action {
  readonly type = GET_COMPANY_REPORT_SHEET_VIEW_URL;

  constructor(public payload: {workbookName: string, viewName: string}) {}
}

export class GetViewUrlSuccess implements Action {
  readonly type = GET_VIEW_URL_SUCCESS;

  constructor(public payload: string) {}
}

export class GetViewUrlError implements Action {
  readonly type = GET_VIEW_URL_ERROR;
}

export type Actions
  = GetStandardReportViewUrl
  | GetStandardReportSheetViewUrl
  | GetCompanyReportViewUrl
  | GetCompanyReportSheetViewUrl
  | GetViewUrlSuccess
  | GetViewUrlError;
