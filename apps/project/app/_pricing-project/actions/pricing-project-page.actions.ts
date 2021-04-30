import { Action } from '@ngrx/store';

import { ProjectExportModalData } from 'libs/models/projects/project-export-manager/project-export-modal-data.model';

export const GET_PRICING_PROJECT = '[Pricing Project Page] Get Pricing Project';
export const GET_PRICING_PROJECT_SUCCESS = '[Pricing Project Page] Get Pricing Project Success';
export const QUEUE_PRICING_PROJECT_EXPORT = '[Pricing Project Page] Queue Pricing Project Export';
export const QUEUE_PRICING_PROJECT_EXPORT_SUCCESS = '[Pricing Project Page] Queue Pricing Project Export Success';
export const QUEUE_PRICING_PROJECT_EXPORT_ERROR = '[Pricing Project Page] Queue Pricing Project Export Error';


export class GetPricingProject implements Action {
  readonly type = GET_PRICING_PROJECT;
  constructor(public payload: number) {}
}

export class GetPricingProjectSuccess implements Action {
  readonly type = GET_PRICING_PROJECT_SUCCESS;
  constructor(public payload: any) {}
}

export class QueuePricingProjectExport implements Action {
  readonly type = QUEUE_PRICING_PROJECT_EXPORT;
  constructor(public payload: ProjectExportModalData) {
  }
}

export class QueuePricingProjectExportSuccess implements Action {
  readonly type = QUEUE_PRICING_PROJECT_EXPORT_SUCCESS;
  constructor() {
  }
}

export class QueuePricingProjectExportError implements Action {
  readonly type = QUEUE_PRICING_PROJECT_EXPORT_ERROR;
  constructor(public payload: any) {
  }
}

export type PricingProjectPageActions
  = GetPricingProject
  | GetPricingProjectSuccess
  | QueuePricingProjectExport
  | QueuePricingProjectExportSuccess
  | QueuePricingProjectExportError;
