import { Action } from '@ngrx/store';
import { UserNotification } from '../models';

export const GET_USER_NOTIFICATIONS = '[Notifications / User Notification List] Get User Notifications';
export const GET_USER_NOTIFICATIONS_SUCCESS = '[Notifications / User Notification List] Get User Notifications Success';
export const GET_USER_NOTIFICATIONS_ERROR = '[Notifications / User Notification List] Get User Notifications Error';
export const MARK_NOTIFICATION_READ = '[Notifications / User Notification List] Mark Notification Read';
export const MARK_NOTIFICATION_READ_SUCCESS = '[Notifications / User Notification List] Mark Notification Read Success';
export const MARK_NOTIFICATION_READ_ERROR = '[Notifications / User Notification List] Mark Notification Read Error';
export const MARK_ALL_NOTIFICATIONS_READ = '[Notifications / User Notification List] Mark All Notifications Read';
export const MARK_ALL_NOTIFICATIONS_READ_SUCCESS = '[Notifications / User Notification List] Mark All Notifications Read Success';
export const MARK_ALL_NOTIFICATIONS_READ_ERROR = '[Notifications / User Notification List] Mark All Notifications Read Error';

export class GetUserNotifications implements Action {
  readonly type = GET_USER_NOTIFICATIONS;
}

export class GetUserNotificationsSuccess implements Action {
  readonly type = GET_USER_NOTIFICATIONS_SUCCESS;

  constructor(public payload: UserNotification[]) {}
}

export class GetUserNotificationsError implements Action {
  readonly type = GET_USER_NOTIFICATIONS_ERROR;
}

export class MarkNotificationRead implements Action {
  readonly type = MARK_NOTIFICATION_READ;

  constructor(public payload: { userNotificationId: number }) {}
}

export class MarkNotificationReadSuccess implements Action {
  readonly type = MARK_NOTIFICATION_READ_SUCCESS;
}

export class MarkNotificationReadError implements Action {
  readonly type = MARK_NOTIFICATION_READ_ERROR;
}

export class MarkAllNotificationsRead implements Action {
  readonly type = MARK_ALL_NOTIFICATIONS_READ;
}

export class MarkAllNotificationsReadSuccess implements Action {
  readonly type = MARK_ALL_NOTIFICATIONS_READ_SUCCESS;
}

export class MarkAllNotificationsReadError implements Action {
  readonly type = MARK_ALL_NOTIFICATIONS_READ_ERROR;
}

export type Actions
  = GetUserNotifications
  | GetUserNotificationsSuccess
  | GetUserNotificationsError
  | MarkNotificationRead
  | MarkNotificationReadSuccess
  | MarkNotificationReadError
  | MarkAllNotificationsRead
  | MarkAllNotificationsReadSuccess
  | MarkAllNotificationsReadError;
