import { Action } from '@ngrx/store';

import { JobDescriptionHistoryListItem } from 'libs/features/job-description-management/models';

export const LOAD_JOB_DESCRIPTION_HISTORY_LIST_ITEMS =
  '[job-description-management / Job Description History List] Load Job Description History List';
export const LOAD_JOB_DESCRIPTION_HISTORY_LIST_ITEMS_ERROR =
  '[job-description-management / Job Description History List] Load Job Description History List Error';
export const LOAD_JOB_DESCRIPTION_HISTORY_LIST_ITEMS_SUCCESS =
  '[job-description-management / Job Description History List] Load Job Description History List Success';

export class LoadJobDescriptionHistoryListItems implements Action {
  readonly type = LOAD_JOB_DESCRIPTION_HISTORY_LIST_ITEMS;

  constructor(public payload: { JobDescriptionId: number }) {}
}

export class LoadJobDescriptionHistoryListItemsError implements Action {
  readonly type = LOAD_JOB_DESCRIPTION_HISTORY_LIST_ITEMS_ERROR;
}

export class LoadJobDescriptionHistoryListItemsSuccess implements Action {
  readonly type = LOAD_JOB_DESCRIPTION_HISTORY_LIST_ITEMS_SUCCESS;

  constructor(public payload: JobDescriptionHistoryListItem[]) {}
}

export type Actions
  = LoadJobDescriptionHistoryListItems
  | LoadJobDescriptionHistoryListItemsError
  | LoadJobDescriptionHistoryListItemsSuccess;
