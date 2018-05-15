import { Action } from '@ngrx/store';

import { GetChartRequest, GetDetailChartRequest, ChartItem } from 'libs/models';

export const LOADING_COMPANY_CHART  = '[Peer Dashboard/Page] Loading Company Chart';
export const LOADING_COMPANY_CHART_SUCCESS  = '[Peer Dashboard/Page] Loading Company Chart Success';
export const LOADING_COMPANY_CHART_ERROR  = '[Peer Dashboard/Page] Loading Company Chart Error';
export const LOADING_JOB_CHART  = '[Peer Dashboard/Page] Loading Job Chart';
export const LOADING_JOB_CHART_SUCCESS  = '[Peer Dashboard/Page] Loading Job Chart Success';
export const LOADING_JOB_CHART_ERROR  = '[Peer Dashboard/Page] Loading Job Chart Error';
export const LOADING_INDUSTRY_CHART  = '[Peer Dashboard/Page] Loading Industry Chart';
export const LOADING_INDUSTRY_CHART_SUCCESS  = '[Peer Dashboard/Page] Loading Industry Chart Success';
export const LOADING_INDUSTRY_CHART_ERROR  = '[Peer Dashboard/Page] Loading Industry Chart Error';
export const LOADING_JOB_FAMILY_CHART  = '[Peer Dashboard/Page] Loading Job Family Chart';
export const LOADING_JOB_FAMILY_CHART_SUCCESS  = '[Peer Dashboard/Page] Loading Job Family Chart Success';
export const LOADING_JOB_FAMILY_CHART_ERROR  = '[Peer Dashboard/Page] Loading Job Family Chart Error';
export const LOADING_REVENUE_CHART  = '[Peer Dashboard/Page] Loading Revenue Chart';
export const LOADING_REVENUE_CHART_SUCCESS  = '[Peer Dashboard/Page] Loading Revenue Chart Success';
export const LOADING_REVENUE_CHART_ERROR  = '[Peer Dashboard/Page] Loading Revenue Chart Error';
export const LOADING_DETAIL_CHART  = '[Peer Dashboard/Page] Loading Detail Chart';
export const LOADING_DETAIL_CHART_SUCCESS  = '[Peer Dashboard/Page] Loading Detail Chart Success';
export const LOADING_DETAIL_CHART_ERROR  = '[Peer Dashboard/Page] Loading Detail Chart Error';
export const CLOSE_SIDEBAR  = '[Peer Dashboard/Page] Close Sidebar';

export class LoadingCompanyChart implements Action {
  readonly type = LOADING_COMPANY_CHART;

  constructor(public payload: GetChartRequest) {}
}

export class LoadingCompanyChartSuccess implements Action {
  readonly type = LOADING_COMPANY_CHART_SUCCESS;

  constructor(public payload: ChartItem[]) {}
}

export class LoadingCompanyChartError implements Action {
  readonly type = LOADING_COMPANY_CHART_ERROR;
}

export class LoadingJobChart implements Action {
  readonly type = LOADING_JOB_CHART;

  constructor(public payload: GetChartRequest) {}
}

export class LoadingJobChartSuccess implements Action {
  readonly type = LOADING_JOB_CHART_SUCCESS;

  constructor(public payload: ChartItem[]) {}
}

export class LoadingJobChartError implements Action {
  readonly type = LOADING_JOB_CHART_ERROR;
}

export class LoadingIndustryChart implements Action {
  readonly type = LOADING_INDUSTRY_CHART;

  constructor(public payload: GetChartRequest) {}
}

export class LoadingIndustryChartSuccess implements Action {
  readonly type = LOADING_INDUSTRY_CHART_SUCCESS;

  constructor(public payload: ChartItem[]) {}
}

export class LoadingIndustryChartError implements Action {
  readonly type = LOADING_INDUSTRY_CHART_ERROR;
}

export class LoadingJobFamilyChart implements Action {
  readonly type = LOADING_JOB_FAMILY_CHART;

  constructor(public payload: GetChartRequest) {}
}

export class LoadingJobFamilyChartSuccess implements Action {
  readonly type = LOADING_JOB_FAMILY_CHART_SUCCESS;

  constructor(public payload: ChartItem[]) {}
}

export class LoadingJobFamilyChartError implements Action {
  readonly type = LOADING_JOB_FAMILY_CHART_ERROR;
}

export class LoadingRevenueChart implements Action {
  readonly type = LOADING_REVENUE_CHART;

  constructor(public payload: GetChartRequest) {}
}

export class LoadingRevenueChartSuccess implements Action {
  readonly type = LOADING_REVENUE_CHART_SUCCESS;

  constructor(public payload: ChartItem[]) {}
}

export class LoadingRevenueChartError implements Action {
  readonly type = LOADING_REVENUE_CHART_ERROR;
}

export class LoadingDetailChart implements Action {
  readonly type = LOADING_DETAIL_CHART;

  constructor(public payload: GetDetailChartRequest) {}
}

export class LoadingDetailChartSuccess implements Action {
  readonly type = LOADING_DETAIL_CHART_SUCCESS;

  constructor(public payload: ChartItem[]) {}
}

export class LoadingDetailChartError implements Action {
  readonly type = LOADING_DETAIL_CHART_ERROR;
}

export class CloseSidebar implements Action {
  readonly type = CLOSE_SIDEBAR;
}

export type Actions
  = LoadingCompanyChart
  | LoadingCompanyChartSuccess
  | LoadingCompanyChartError
  | LoadingJobChart
  | LoadingJobChartSuccess
  | LoadingJobChartError
  | LoadingIndustryChart
  | LoadingIndustryChartSuccess
  | LoadingIndustryChartError
  | LoadingJobFamilyChart
  | LoadingJobFamilyChartSuccess
  | LoadingJobFamilyChartError
  | LoadingRevenueChart
  | LoadingRevenueChartSuccess
  | LoadingRevenueChartError
  | LoadingDetailChart
  | LoadingDetailChartSuccess
  | LoadingDetailChartError
  | CloseSidebar;
