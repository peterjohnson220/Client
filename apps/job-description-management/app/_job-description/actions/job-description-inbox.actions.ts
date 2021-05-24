import { Action } from '@ngrx/store';
import { GridDataResult } from '@progress/kendo-angular-grid';


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

export const UPDATE_INBOX_READ_BULK = '[Job Description Manager/Inbox] Update Inbox Read Bulk';
export const UPDATE_INBOX_READ_BULK_ERROR = '[Job Description Manager/Inbox] Update Inbox Read Bulk Error';
export const UPDATE_INBOX_READ_BULK_SUCCESS = '[Job Description Manager/Inbox] Update Inbox Read Bulk Success';
export const UPDATE_INBOX_READ_SELECT_ALL = '[Job Description Manager/Inbox] Update Inbox Read Select All';
export const UPDATE_INBOX_READ_SELECT_ALL_ERROR = '[Job Description Manager/Inbox] Update Inbox Read Select All Error';
export const UPDATE_INBOX_READ_SELECT_ALL_SUCCESS = '[Job Description Manager/Inbox] Update Inbox Read Select All Success';

export const UPDATE_INBOX_UNREAD_BULK = '[Job Description Manager/Inbox] Update Inbox Unread Bulk';
export const UPDATE_INBOX_UNREAD_BULK_ERROR = '[Job Description Manager/Inbox] Update Inbox Unread Bulk Error';
export const UPDATE_INBOX_UNREAD_BULK_SUCCESS = '[Job Description Manager/Inbox] Update Inbox Unread Bulk Success';
export const UPDATE_INBOX_UNREAD_SELECT_ALL = '[Job Description Manager/Inbox] Update Inbox Unread Select All';
export const UPDATE_INBOX_UNREAD_SELECT_ALL_ERROR = '[Job Description Manager/Inbox] Update Inbox Unread Select All Error';
export const UPDATE_INBOX_UNREAD_SELECT_ALL_SUCCESS = '[Job Description Manager/Inbox] Update Inbox Unread Select All Success';

export const UPDATE_JOB_DESCRIPTION_READ = '[Job Description Manager/Inbox] Update Job Description Read';
export const UPDATE_JOB_DESCRIPTION_READ_ERROR = '[Job Description Manager/Inbox] Update Job Description Read Error';
export const UPDATE_JOB_DESCRIPTION_READ_SUCCESS = '[Job Description Manager/Inbox] Update Job Description Read Success';
export const UPDATE_JOB_DESCRIPTION_UNREAD = '[Job Description Manager/Inbox] Update Job Description Unread';
export const UPDATE_JOB_DESCRIPTION_UNREAD_ERROR = '[Job Description Manager/Inbox] Update Job Description Unread Error';
export const UPDATE_JOB_DESCRIPTION_UNREAD_SUCCESS = '[Job Description Manager/Inbox] Update Job Description Unread Success';


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

export class UpdateInboxReadBulk implements Action {
  readonly type = UPDATE_INBOX_READ_BULK;
}

export class UpdateInboxReadBulkError implements Action {
  readonly type = UPDATE_INBOX_READ_BULK_ERROR;
}

export class UpdateInboxReadBulkSuccess implements Action {
  readonly type = UPDATE_INBOX_READ_BULK_SUCCESS;
}

export class UpdateInboxReadSelectAll implements Action {
  readonly type = UPDATE_INBOX_READ_SELECT_ALL;
}

export class UpdateInboxReadSelectAllError implements Action {
  readonly type = UPDATE_INBOX_READ_SELECT_ALL_ERROR;
}

export class UpdateInboxReadSelectAllSuccess implements Action {
  readonly type = UPDATE_INBOX_READ_SELECT_ALL_SUCCESS;
}

export class UpdateInboxUnreadBulk implements Action {
  readonly type = UPDATE_INBOX_UNREAD_BULK;
}

export class UpdateInboxUnreadBulkError implements Action {
  readonly type = UPDATE_INBOX_UNREAD_BULK_ERROR;
}

export class UpdateInboxUnreadBulkSuccess implements Action {
  readonly type = UPDATE_INBOX_UNREAD_BULK_SUCCESS;
}

export class UpdateInboxUnreadSelectAll implements Action {
  readonly type = UPDATE_INBOX_UNREAD_SELECT_ALL;
}

export class UpdateInboxUnreadSelectAllError implements Action {
  readonly type = UPDATE_INBOX_UNREAD_SELECT_ALL_ERROR;
}

export class UpdateInboxUnreadSelectAllSuccess implements Action {
  readonly type = UPDATE_INBOX_UNREAD_SELECT_ALL_SUCCESS;
}

export class UpdateJobDescriptionRead implements Action {
  readonly type = UPDATE_JOB_DESCRIPTION_READ;
  constructor(public payload: number) { }
}

export class UpdateJobDescriptionReadError implements Action {
  readonly type = UPDATE_JOB_DESCRIPTION_READ_ERROR;
}

export class UpdateJobDescriptionReadSuccess implements Action {
  readonly type = UPDATE_JOB_DESCRIPTION_READ_SUCCESS;
  constructor(public payload: number) { }
}

export class UpdateJobDescriptionUnread implements Action {
  readonly type = UPDATE_JOB_DESCRIPTION_UNREAD;
  constructor(public payload: number) { }
}

export class UpdateJobDescriptionUnreadError implements Action {
  readonly type = UPDATE_JOB_DESCRIPTION_UNREAD_ERROR;
}

export class UpdateJobDescriptionUnreadSuccess implements Action {
  readonly type = UPDATE_JOB_DESCRIPTION_UNREAD_SUCCESS;
  constructor(public payload: number) { }
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
  UpdateInboxReadBulk |
  UpdateInboxReadBulkError |
  UpdateInboxReadBulkSuccess |
  UpdateInboxReadSelectAll |
  UpdateInboxReadSelectAllError |
  UpdateInboxReadSelectAllSuccess |
  UpdateInboxUnreadBulk |
  UpdateInboxUnreadBulkError |
  UpdateInboxUnreadBulkSuccess |
  UpdateInboxUnreadSelectAll |
  UpdateInboxUnreadSelectAllError |
  UpdateInboxUnreadSelectAllSuccess |
  UpdateJobDescriptionRead |
  UpdateJobDescriptionReadError |
  UpdateJobDescriptionReadSuccess |
  UpdateJobDescriptionUnread |
  UpdateJobDescriptionUnreadError |
  UpdateJobDescriptionUnreadSuccess;
