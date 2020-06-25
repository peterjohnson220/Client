import { Action } from '@ngrx/store';
import { FieldMappingsDTO, LoaderFieldSet } from 'libs/models/data-loads';

export const QUEUE_ON_DEMAND_SYNC = '[Data Management/HRIS On-Demand Sync] Queue On-Demand Sync';
export const QUEUE_ON_DEMAND_SYNC_ERROR = '[Data Management/HRIS On-Demand Sync] Queue On-Demand Sync Error';
export const QUEUE_ON_DEMAND_SYNC_SUCCESS = '[Data Management/HRIS On-Demand Sync] Queue On-Demand Sync Success';

export class QueueOnDemandSync implements Action {
  readonly type = QUEUE_ON_DEMAND_SYNC;

  constructor() {}
}

export class QueueOnDemandSyncError implements Action {
  readonly type = QUEUE_ON_DEMAND_SYNC_ERROR;

  constructor() {}
}

export class QueueOnDemandSyncSuccess implements Action {
  readonly type = QUEUE_ON_DEMAND_SYNC_SUCCESS;

  constructor() {}
}

export type Actions
  = QueueOnDemandSync
  | QueueOnDemandSyncError
  | QueueOnDemandSyncSuccess;
