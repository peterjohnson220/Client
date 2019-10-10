import { Action } from '@ngrx/store';

import { AppNotification } from '../models';

export const ADD_NOTIFICATION = '[App Notifications / App Notifications] Add Notification';
export const DELETE_NOTIFICATION = '[App Notifications / App Notifications] Delete Notification';

export class AddNotification implements Action {
  readonly type = ADD_NOTIFICATION;

  constructor(public payload: AppNotification<any>) {}
}

export class DeleteNotification implements Action {
  readonly type = DELETE_NOTIFICATION;

  constructor(public payload: { notificationId: string }) {}
}

export type Actions
  = AddNotification
  | DeleteNotification;
