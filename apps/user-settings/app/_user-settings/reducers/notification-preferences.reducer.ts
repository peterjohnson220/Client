import cloneDeep from 'lodash/cloneDeep';

import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models/state';

import { NotificationPreference, SaveNotificationPreferencesApiResponseEnum } from '../models';
import * as fromNotificationPreferencePageActions from '../actions/notification-preferences.actions';
import { AsyncStateObjHelper } from 'libs/core/helpers';

export interface State {
  notificationPreferences: AsyncStateObj<NotificationPreference[]>;
  updatingNotificationPreferences: boolean;
  saveNotificationPreferencesResponse: string;
}

const initialState: State = {
  notificationPreferences: generateDefaultAsyncStateObj<NotificationPreference[]>([]),
  updatingNotificationPreferences: false,
  saveNotificationPreferencesResponse: ''
};

export function reducer(state = initialState, action: fromNotificationPreferencePageActions.Actions) {
  switch (action.type) {

    case fromNotificationPreferencePageActions.GET_NOTIFICATION_PREFERENCES: {
      return AsyncStateObjHelper.loading(state, 'notificationPreferences');
    }

    case fromNotificationPreferencePageActions.GET_NOTIFICATION_PREFERENCES_SUCCESS: {
     return AsyncStateObjHelper.loadingSuccess(state, 'notificationPreferences', action.payload );
    }

    case fromNotificationPreferencePageActions.GET_NOTIFICATION_PREFERENCES_ERROR: {
      return AsyncStateObjHelper.loadingError(state, 'notificationPreferences');
    }

    case fromNotificationPreferencePageActions.TOGGLE_NOTIFICATION_PREFERENCE : {
      const selectedPreference = action.payload;
      const notificationPreferencesClone = cloneDeep(state.notificationPreferences);
      const notificationPreference = notificationPreferencesClone.obj.find(x => x.CategoryLookupKey === selectedPreference.preference.CategoryLookupKey);

      if (!!notificationPreference) {

        if (action.payload.isEmail) {
          notificationPreference.SendEmail = !notificationPreference.SendEmail;
          notificationPreference.EmailDirty = !notificationPreference.EmailDirty;
        } else {
          notificationPreference.NotifyUser = !notificationPreference.NotifyUser;
          notificationPreference.NotifyDirty = !notificationPreference.NotifyDirty;
        }

      }

      return {
        ...state,
        notificationPreferences: notificationPreferencesClone,
        saveNotificationPreferencesResponse: ''
      };
    }

    case fromNotificationPreferencePageActions.UPDATE_NOTIFICATION_PREFERENCES : {
      return {
        ...state,
        updatingNotificationPreferences: true
      };
    }

    case fromNotificationPreferencePageActions.UPDATE_NOTIFICATION_PREFERENCES_SUCCESS: {

      const preferencesClone = cloneDeep(state.notificationPreferences);
      preferencesClone.obj.forEach(p => {
        p.EmailDirty = false;
        p.NotifyDirty = false;
      });

      return {
        ...state,
        updatingNotificationPreferences: false,
        saveNotificationPreferencesResponse: SaveNotificationPreferencesApiResponseEnum.Success,
        notificationPreferences: preferencesClone
      };
    }

    case fromNotificationPreferencePageActions.UPDATE_NOTIFICATION_PREFERENCES_ERROR: {
      return {
        ...state,
        updatingNotificationPreferences: false,
        saveNotificationPreferencesResponse: SaveNotificationPreferencesApiResponseEnum.Error
      };
    }

    default: {
      return state;
    }
  }
}

export const getNotificationPreferences = (state: State) => state.notificationPreferences;
export const getUpdatingNotificationPreferences = (state: State) => state.updatingNotificationPreferences;
export const getNotificationPreferencesHasPendingChanges = (state: State) => state.notificationPreferences.obj.some(p => p.EmailDirty || p.NotifyDirty);
export const getUpdateNotificationPreferencesApiResponse = (state: State) => state.saveNotificationPreferencesResponse;
