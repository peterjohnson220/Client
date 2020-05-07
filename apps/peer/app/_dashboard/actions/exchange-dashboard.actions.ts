import { Action } from '@ngrx/store';

import { GetChartRequest, GetDetailChartRequest, ChartItem, ExchangeJobComparison } from 'libs/models';

export const LOAD_COMPANY_CHART  = '[Peer Dashboard/Page] Load Company Chart';
export const LOAD_COMPANY_CHART_SUCCESS  = '[Peer Dashboard/Page] Load Company Chart Success';
export const LOAD_COMPANY_CHART_ERROR  = '[Peer Dashboard/Page] Load Company Chart Error';
export const LOAD_JOB_CHART  = '[Peer Dashboard/Page] Load Job Chart';
export const LOAD_JOB_CHART_SUCCESS  = '[Peer Dashboard/Page] Load Job Chart Success';
export const LOAD_JOB_CHART_ERROR  = '[Peer Dashboard/Page] Load Job Chart Error';
export const LOAD_INDUSTRY_CHART  = '[Peer Dashboard/Page] Load Industry Chart';
export const LOAD_INDUSTRY_CHART_SUCCESS  = '[Peer Dashboard/Page] Load Industry Chart Success';
export const LOAD_INDUSTRY_CHART_ERROR  = '[Peer Dashboard/Page] Load Industry Chart Error';
export const LOAD_JOB_FAMILY_CHART  = '[Peer Dashboard/Page] Load Job Family Chart';
export const LOAD_JOB_FAMILY_CHART_SUCCESS  = '[Peer Dashboard/Page] Load Job Family Chart Success';
export const LOAD_JOB_FAMILY_CHART_ERROR  = '[Peer Dashboard/Page] Load Job Family Chart Error';
export const LOAD_REVENUE_CHART  = '[Peer Dashboard/Page] Load Revenue Chart';
export const LOAD_REVENUE_CHART_SUCCESS  = '[Peer Dashboard/Page] Load Revenue Chart Success';
export const LOAD_REVENUE_CHART_ERROR  = '[Peer Dashboard/Page] Load Revenue Chart Error';
export const LOAD_DETAIL_CHART  = '[Peer Dashboard/Page] Load Detail Chart';
export const LOAD_DETAIL_CHART_SUCCESS  = '[Peer Dashboard/Page] Load Detail Chart Success';
export const LOAD_DETAIL_CHART_ERROR  = '[Peer Dashboard/Page] Load Detail Chart Error';
export const CLOSE_SIDEBAR  = '[Peer Dashboard/Page] Close Sidebar';
export const LOAD_MAP_COUNT  = '[Peer Dashboard/Page] Load Map Count';
export const LOAD_MAP_COUNT_SUCCESS  = '[Peer Dashboard/Page] Load Map Count Success';
export const LOAD_MAP_COUNT_ERROR  = '[Peer Dashboard/Page] Load Map Count Error';
export const LOAD_EXCHANGE_JOB_ORGS = '[Peer Dashboard/Page] Load Exchange Job Orgs';
export const LOAD_EXCHANGE_JOB_ORGS_SUCCESS = '[Peer Dashboard/Page] Load Exchange Job Orgs Success';
export const LOAD_EXCHANGE_JOB_ORGS_ERROR = '[Peer Dashboard/Page] Load Exchange Job Orgs Error';
export const EXPORT_EXCHANGE_JOBS = '[Peer Dashboard/Page] Export Exchange Jobs';
export const EXPORT_EXCHANGE_JOBS_SUCCESS = '[Peer Dashboard/Page] Export Exchange Jobs Success';
export const EXPORT_EXCHANGE_JOBS_ERROR = '[Peer Dashboard/Page] Export Exchange Jobs Error';

export class LoadCompanyChart implements Action {
  readonly type = LOAD_COMPANY_CHART;

  constructor(public payload: GetChartRequest) {}
}

export class LoadCompanyChartSuccess implements Action {
  readonly type = LOAD_COMPANY_CHART_SUCCESS;

  constructor(public payload: ChartItem[]) {}
}

export class LoadCompanyChartError implements Action {
  readonly type = LOAD_COMPANY_CHART_ERROR;
}

export class LoadJobChart implements Action {
  readonly type = LOAD_JOB_CHART;

  constructor(public payload: GetChartRequest) {}
}

export class LoadJobChartSuccess implements Action {
  readonly type = LOAD_JOB_CHART_SUCCESS;

  constructor(public payload: ChartItem[]) {}
}

export class LoadJobChartError implements Action {
  readonly type = LOAD_JOB_CHART_ERROR;
}

export class LoadIndustryChart implements Action {
  readonly type = LOAD_INDUSTRY_CHART;

  constructor(public payload: GetChartRequest) {}
}

export class LoadIndustryChartSuccess implements Action {
  readonly type = LOAD_INDUSTRY_CHART_SUCCESS;

  constructor(public payload: ChartItem[]) {}
}

export class LoadIndustryChartError implements Action {
  readonly type = LOAD_INDUSTRY_CHART_ERROR;
}

export class LoadJobFamilyChart implements Action {
  readonly type = LOAD_JOB_FAMILY_CHART;

  constructor(public payload: GetChartRequest) {}
}

export class LoadJobFamilyChartSuccess implements Action {
  readonly type = LOAD_JOB_FAMILY_CHART_SUCCESS;

  constructor(public payload: ChartItem[]) {}
}

export class LoadJobFamilyChartError implements Action {
  readonly type = LOAD_JOB_FAMILY_CHART_ERROR;
}

export class LoadRevenueChart implements Action {
  readonly type = LOAD_REVENUE_CHART;

  constructor(public payload: GetChartRequest) {}
}

export class LoadRevenueChartSuccess implements Action {
  readonly type = LOAD_REVENUE_CHART_SUCCESS;

  constructor(public payload: ChartItem[]) {}
}

export class LoadRevenueChartError implements Action {
  readonly type = LOAD_REVENUE_CHART_ERROR;
}

export class LoadDetailChart implements Action {
  readonly type = LOAD_DETAIL_CHART;

  constructor(public payload: GetDetailChartRequest) {}
}

export class LoadDetailChartSuccess implements Action {
  readonly type = LOAD_DETAIL_CHART_SUCCESS;

  constructor(public payload: ChartItem[]) {}
}

export class LoadDetailChartError implements Action {
  readonly type = LOAD_DETAIL_CHART_ERROR;
}

export class CloseSidebar implements Action {
  readonly type = CLOSE_SIDEBAR;
}

export class LoadMapCount implements Action {
  readonly type = LOAD_MAP_COUNT;

  constructor(public exchangeId: number) {}
}

export class LoadMapCountSuccess implements Action {
  readonly type = LOAD_MAP_COUNT_SUCCESS;

  constructor(public payload: boolean) {}
}

export class LoadMapCountError implements Action {
  readonly type = LOAD_MAP_COUNT_ERROR;
}

export class LoadExchangeJobOrgs implements Action {
  readonly type = LOAD_EXCHANGE_JOB_ORGS;

  constructor(public payload: {selectedExchangeJobComparison: ExchangeJobComparison, selectedMarket: string}) {}
}

export class LoadExchangeJobOrgsSuccess implements Action {
  readonly type = LOAD_EXCHANGE_JOB_ORGS_SUCCESS;

  constructor(public payload: string[]) {}
}

export class LoadExchangeJobOrgsError implements Action {
  readonly type = LOAD_EXCHANGE_JOB_ORGS_ERROR;
}

export class ExportExchangeJobs implements Action {
  readonly type = EXPORT_EXCHANGE_JOBS;

  constructor(public payload: { exchangeId: number }) {}
}

export class ExportExchangeJobsSuccess implements Action {
  readonly type = EXPORT_EXCHANGE_JOBS_SUCCESS;
}

export class ExportExchangeJobsError implements Action {
  readonly type = EXPORT_EXCHANGE_JOBS_ERROR;
}

export type Actions
  = LoadCompanyChart
  | LoadCompanyChartSuccess
  | LoadCompanyChartError
  | LoadJobChart
  | LoadJobChartSuccess
  | LoadJobChartError
  | LoadIndustryChart
  | LoadIndustryChartSuccess
  | LoadIndustryChartError
  | LoadJobFamilyChart
  | LoadJobFamilyChartSuccess
  | LoadJobFamilyChartError
  | LoadRevenueChart
  | LoadRevenueChartSuccess
  | LoadRevenueChartError
  | LoadDetailChart
  | LoadDetailChartSuccess
  | LoadDetailChartError
  | CloseSidebar
  | LoadMapCount
  | LoadMapCountError
  | LoadMapCountSuccess
  | LoadExchangeJobOrgs
  | LoadExchangeJobOrgsSuccess
  | LoadExchangeJobOrgsError
  | ExportExchangeJobs
  | ExportExchangeJobsSuccess
  | ExportExchangeJobsError;
