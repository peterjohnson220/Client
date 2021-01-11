import { Action } from '@ngrx/store';

import { NotificationPreference } from '../models/communication-preferences';

export const GET_NOTIFICATION_PREFERENCES = '[User Settings / User Settings Page] Get Notification Preferences';
export const GET_NOTIFICATION_PREFERENCES_SUCCESS = '[User Settings / User Settings Page] Get Notification Preferences Success';
export const GET_NOTIFICATION_PREFERENCES_ERROR = '[User Settings / User Settings Page] Get Notification Preferences Error';
export const UPDATE_NOTIFICATION_PREFERENCES = '[User Settings / User Settings Page] Update Notification Preferences';
export const UPDATE_NOTIFICATION_PREFERENCES_SUCCESS = '[User Settings / User Settings Page] Update Notification Preferences Success';
export const UPDATE_NOTIFICATION_PREFERENCES_ERROR = '[User Settings / User Settings Page] Update Notification Preferences Error';
export const TOGGLE_NOTIFICATION_PREFERENCE = '[User Settings / User Settings Page] Toggle Notification Preference';

export class GetNotificationPreferences implements Action {
  readonly type = GET_NOTIFICATION_PREFERENCES;
  constructor() {}
}

export class GetNotificationPreferencesSuccess implements Action {
  readonly type = GET_NOTIFICATION_PREFERENCES_SUCCESS;
  constructor(public payload: NotificationPreference[]) {}
}

export class GetNotificationPreferencesError implements Action {
  readonly type = GET_NOTIFICATION_PREFERENCES_ERROR;
  constructor() {}
}

export class UpdateNotificationPreferences implements Action {
  readonly type = UPDATE_NOTIFICATION_PREFERENCES;
  constructor(public payload: NotificationPreference[]) {}
}

export class UpdateNotificationPreferencesSuccess implements Action {
  readonly type = UPDATE_NOTIFICATION_PREFERENCES_SUCCESS;
  constructor() {}
}

export class UpdateNotificationPreferencesError implements Action {
  readonly type = UPDATE_NOTIFICATION_PREFERENCES_ERROR;
  constructor() {}
}

export class ToggleNotificationPreference implements Action {
  readonly type = TOGGLE_NOTIFICATION_PREFERENCE;
  constructor(public payload: {preference: NotificationPreference, isEmail: boolean}) {}
}

export type Actions =
  GetNotificationPreferences
| GetNotificationPreferencesSuccess
| GetNotificationPreferencesError
| UpdateNotificationPreferences
| UpdateNotificationPreferencesSuccess
| UpdateNotificationPreferencesError
| ToggleNotificationPreference;
