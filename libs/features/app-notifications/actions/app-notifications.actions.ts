import { Action } from '@ngrx/store';

import { AppNotification } from '../models';

export const ADD_NOTIFICATION = '[App Notifications / App Notifications] Add Notification';
export const DELETE_NOTIFICATION = '[App Notifications / App Notifications] Delete Notification';

export const UPDATE_USER_NOTIFICATION_UNREAD_COUNT = '[App Notifications / App Notifications] Update User Notification Unread Count';
export const UPDATE_USER_NOTIFICATION_UNREAD_COUNT_SUCCESS = '[App Notifications / App Notifications] Update User Notification Unread Count Success';
export const UPDATE_USER_NOTIFICATION_UNREAD_COUNT_ERROR = '[App Notifications / App Notifications] Update User Notification Unread Count Error';

export const CLEAR_USER_NOTIFICATION_UNSEEN_COUNT = '[App Notifications/ App Notifications] Clear User Notifications Unread Count';
export const UPDATE_USER_NOTIFICATION_UNSEEN_COUNT = '[App Notifications / App Notifications] Update User Notification Unseen Count';
export const UPDATE_USER_NOTIFICATION_UNSEEN_COUNT_SUCCESS = '[App Notifications / App Notifications] Update User Notification Unseen Count Success';
export const UPDATE_USER_NOTIFICATION_UNSEEN_COUNT_ERROR = '[App Notifications / App Notifications] Update User Notification Unseen Count Error';

export class AddNotification implements Action {
  readonly type = ADD_NOTIFICATION;

  constructor(public payload: AppNotification<any>) {}
}

export class DeleteNotification implements Action {
  readonly type = DELETE_NOTIFICATION;

  constructor(public payload: { notificationId: string }) {}
}

export class UpdateUserNotificationUnreadCount implements Action {
  readonly type = UPDATE_USER_NOTIFICATION_UNREAD_COUNT;
}

export class UpdateUserNotificationUnreadCountSuccess implements Action {
  readonly type = UPDATE_USER_NOTIFICATION_UNREAD_COUNT_SUCCESS;

  constructor(public payload: { notificationCount: number }) {}
}

export class UpdateUserNotificationUnreadCountError implements Action {
  readonly type = UPDATE_USER_NOTIFICATION_UNREAD_COUNT_ERROR;
}

export class UpdateUserNotificationsUnseenCount implements Action {
  readonly type = UPDATE_USER_NOTIFICATION_UNSEEN_COUNT;
}

export class UpdateUserNotificationUnseenCountSuccess implements Action {
    readonly type = UPDATE_USER_NOTIFICATION_UNSEEN_COUNT_SUCCESS;
    constructor(public payload: {notificationCount: number}) {}
}

export class UpdateUserNotificationUnseenCountError implements Action {
  readonly type = UPDATE_USER_NOTIFICATION_UNSEEN_COUNT_ERROR;
}

export class ClearUserNotificationUnseenCount implements Action {
  readonly type = CLEAR_USER_NOTIFICATION_UNSEEN_COUNT;
}


export type Actions
  = AddNotification
  | DeleteNotification
  | UpdateUserNotificationUnreadCount
  | UpdateUserNotificationUnreadCountSuccess
  | UpdateUserNotificationUnreadCountError
  | UpdateUserNotificationsUnseenCount
  | UpdateUserNotificationUnseenCountSuccess
  | UpdateUserNotificationUnseenCountError
  | ClearUserNotificationUnseenCount;
