import { Action } from '@ngrx/store';

import { ProjectExportModalData } from 'libs/models/projects/project-export-manager/project-export-modal-data.model';

export const GET_PRICING_PROJECT_CONTEXT = '[Pricing Project Page] Get Pricing Project Context';
export const GET_PRICING_PROJECT_CONTEXT_SUCCESS = '[Pricing Project Page] Get Pricing Project Context Success';
export const QUEUE_PRICING_PROJECT_EXPORT = '[Pricing Project Page] Queue Pricing Project Export';
export const QUEUE_PRICING_PROJECT_EXPORT_SUCCESS = '[Pricing Project Page] Queue Pricing Project Export Success';
export const QUEUE_PRICING_PROJECT_EXPORT_ERROR = '[Pricing Project Page] Queue Pricing Project Export Error';
export const GET_PROJECT_FIELDS_FOR_COLUMN_CHOOSER = '[Pricing Project Page] Get Project Fields for Column Chooser';
export const UPDATE_PROJECT = '[Pricing Project Page] Update Project';


export class GetPricingProjectContext implements Action {
  readonly type = GET_PRICING_PROJECT_CONTEXT;
  constructor(public payload: number) {}
}

export class GetPricingProjectContextSuccess implements Action {
  readonly type = GET_PRICING_PROJECT_CONTEXT_SUCCESS;
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

export class GetProjectFieldsForColumnChooser implements Action {
  readonly type = GET_PROJECT_FIELDS_FOR_COLUMN_CHOOSER;
  constructor(public payload: {
    ProjectId: number,
    PageViewId: string
  }) {}
}

export class UpdateProject implements Action {
  readonly type = UPDATE_PROJECT;
  constructor(public payload: any) {}
}

export type PricingProjectPageActions
  = GetPricingProjectContext
  | GetPricingProjectContextSuccess
  | QueuePricingProjectExport
  | QueuePricingProjectExportSuccess
  | QueuePricingProjectExportError
  | GetProjectFieldsForColumnChooser
  | UpdateProject;
