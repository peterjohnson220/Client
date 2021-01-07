import { Action } from '@ngrx/store';
import { UserNotification } from '../models';

export const GET_USER_NOTIFICATIONS = '[Notifications / User Notification List] Get User Notifications';
export const SET_USER_NOTIFICATIONS = '[Notifications / User Notification List] Set User Notifications';
export const MARK_NOTIFICATION_READ = '[Notifications / User Notification List] Mark Notification Read';
export const MARK_NOTIFICATION_READ_SUCCESS = '[Notifications / User Notification List] Mark Notification Read Success';
export const MARK_NOTIFICATION_READ_ERROR = '[Notifications / User Notification List] Mark Notification Read Error';
export const MARK_ALL_NOTIFICATIONS_READ = '[Notifications / User Notification List] Mark All Notifications Read';
export const MARK_ALL_NOTIFICATIONS_READ_SUCCESS = '[Notifications / User Notification List] Mark All Notifications Read Success';
export const MARK_ALL_NOTIFICATIONS_READ_ERROR = '[Notifications / User Notification List] Mark All Notifications Read Error';
export const MARK_ALL_NOTIFICATIONS_SEEN = '[Notifications / User Notification List] Mark All Notifications Seen';
export const MARK_ALL_NOTIFICATIONS_SEEN_SUCCESS = '[Notifications / User Notifications List] Mark All Notifications Seen Success';
export const MARK_ALL_NOTIFICATIONS_SEEN_ERROR = '[Notifications / User Notifications List] Mark All Notifications Seen Error';

export class GetUserNotifications implements Action {
  readonly type = GET_USER_NOTIFICATIONS;
}

export class SetUserNotifications implements Action {
  readonly type = SET_USER_NOTIFICATIONS;

  constructor(public payload: {replaceAll: boolean, newUserNotifications: UserNotification[]}) {
  }
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

export class MarkAllNotificationsSeen implements Action {
  readonly type = MARK_ALL_NOTIFICATIONS_SEEN;
}

export class MarkAllNotificationsSeenSuccess implements Action {
  readonly type = MARK_ALL_NOTIFICATIONS_SEEN_SUCCESS;
}

export class MarkAllNotificationsSeenError implements Action {
  readonly type = MARK_ALL_NOTIFICATIONS_SEEN_ERROR;
}

export type Actions
  = GetUserNotifications
  | SetUserNotifications
  | MarkNotificationRead
  | MarkNotificationReadSuccess
  | MarkNotificationReadError
  | MarkAllNotificationsRead
  | MarkAllNotificationsReadSuccess
  | MarkAllNotificationsReadError
  | MarkAllNotificationsSeen
  | MarkAllNotificationsSeenSuccess
  | MarkAllNotificationsSeenError;
