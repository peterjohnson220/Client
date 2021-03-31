import { Action } from '@ngrx/store';
import { GridDataResult } from '@progress/kendo-angular-grid';

import { JobDescriptionInboxIsRead } from 'libs/models/payfactors-api';


export const GET_UNREAD_INBOX_COUNT = '[Job Description Manager/Inbox] Get Unread Inbox Count';
export const GET_UNREAD_INBOX_COUNT_ERROR = '[Job Description Manager/Inbox] Get Unread Inbox Count Error';
export const GET_UNREAD_INBOX_COUNT_SUCCESS = '[Job Description Manager/Inbox] Get Unread Inbox Count Success';
export const LOAD_INBOX = '[Job Description Manager/Inbox] Load Inbox';
export const LOAD_INBOX_ERROR = '[Job Description Manager/Inbox] Load Inbox Error';
export const LOAD_INBOX_SUCCESS = '[Job Description Manager/Inbox] Load Inbox Success';
export const SELECT_ALL = '[Job Description Manager/Inbox] Select All';
export const SELECT_ALL_PAGES = '[Job Description Manager/Inbox] Select All Pages';
export const SELECT_ID = '[Job Description Manager/Inbox] Select Id';
export const UNSELECT_ALL = '[Job Description Manager/Inbox] Unselect All';
export const UPDATE_INBOX_READ = '[Job Description Manager/Inbox] Update Inbox Read';
export const UPDATE_INBOX_READ_ERROR = '[Job Description Manager/Inbox] Update Inbox Read Error';
export const UPDATE_INBOX_READ_SUCCESS = '[Job Description Manager/Inbox] Update Inbox Read Bulk Success';
export const UPDATE_INBOX_READ_ALL = '[Job Description Manager/Inbox] Update Inbox Read All';
export const UPDATE_INBOX_READ_ALL_ERROR = '[Job Description Manager/Inbox] Update Inbox Read All Error';
export const UPDATE_INBOX_READ_ALL_SUCCESS = '[Job Description Manager/Inbox] Update Inbox Read Bulk All Success';
export const UPDATE_INBOX_READ_BULK = '[Job Description Manager/Inbox] Update Inbox Read Bulk';
export const UPDATE_INBOX_READ_BULK_ERROR = '[Job Description Manager/Inbox] Update Inbox Read Bulk Error';
export const UPDATE_INBOX_READ_BULK_SUCCESS = '[Job Description Manager/Inbox] Update Inbox Read Bulk Success';


export class GetUnreadInboxCount implements Action {
  readonly type = GET_UNREAD_INBOX_COUNT;
}

export class GetUnreadInboxCountSuccess implements Action {
  readonly type = GET_UNREAD_INBOX_COUNT_SUCCESS;
  constructor(public payload: number) { }
}

export class GetUnreadInboxCountError implements Action {
  readonly type = GET_UNREAD_INBOX_COUNT_ERROR;
}

export class LoadInbox implements Action {
  readonly type = LOAD_INBOX;
}

export class LoadInboxSuccess implements Action {
  readonly type = LOAD_INBOX_SUCCESS;
  constructor(public payload: GridDataResult) { }
}

export class LoadInboxError implements Action {
  readonly type = LOAD_INBOX_ERROR;
}

export class SelectAll implements Action {
  readonly type = SELECT_ALL;
}

export class SelectAllPages implements Action {
  readonly type = SELECT_ALL_PAGES;
}

export class SelectId implements Action {
  readonly type = SELECT_ID;
  constructor(public payload: number) { }
}

export class UnselectAll implements Action {
  readonly type = UNSELECT_ALL;
}

export class UpdateInboxRead implements Action {
  readonly type = UPDATE_INBOX_READ;
  constructor(public payload: JobDescriptionInboxIsRead) { }
}

export class UpdateInboxReadError implements Action {
  readonly type = UPDATE_INBOX_READ_ERROR;
}

export class UpdateInboxReadSuccess implements Action {
  readonly type = UPDATE_INBOX_READ_SUCCESS;
}

export class UpdateInboxReadAll implements Action {
  readonly type = UPDATE_INBOX_READ_ALL;
  constructor(public payload: boolean) { }
}

export class UpdateInboxReadAllError implements Action {
  readonly type = UPDATE_INBOX_READ_ALL_ERROR;
}

export class UpdateInboxReadAllSuccess implements Action {
  readonly type = UPDATE_INBOX_READ_ALL_SUCCESS;
  constructor(public payload: boolean) { }
}

export class UpdateInboxReadBulk implements Action {
  readonly type = UPDATE_INBOX_READ_BULK;
  constructor(public payload: boolean) { }
}

export class UpdateInboxReadBulkError implements Action {
  readonly type = UPDATE_INBOX_READ_BULK_ERROR;
}

export class UpdateInboxReadBulkSuccess implements Action {
  readonly type = UPDATE_INBOX_READ_BULK_SUCCESS;
  constructor(public payload: boolean) { }
}


export type JobDescriptionInboxActions =
  GetUnreadInboxCount |
  GetUnreadInboxCountError |
  GetUnreadInboxCountSuccess |
  LoadInbox |
  LoadInboxError |
  LoadInboxSuccess |
  SelectAll |
  SelectAllPages |
  SelectId |
  UnselectAll |
  UpdateInboxRead |
  UpdateInboxReadError |
  UpdateInboxReadSuccess |
  UpdateInboxReadAll |
  UpdateInboxReadAllError |
  UpdateInboxReadAllSuccess |
  UpdateInboxReadBulk |
  UpdateInboxReadBulkError |
  UpdateInboxReadBulkSuccess;
