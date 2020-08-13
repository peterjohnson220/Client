import cloneDeep from 'lodash/cloneDeep';

import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models';
import { AsyncStateObjHelper } from 'libs/core';

import * as fromAppNotificationsActions from '../actions/app-notifications.actions';
import { AppNotification } from '../models';

export interface State {
  notifications: AppNotification<any>[];
  unreadCountAsyncObj: AsyncStateObj<number>;
}

const initialState: State = {
  notifications: [],
  unreadCountAsyncObj: generateDefaultAsyncStateObj(0)
};

export function reducer(state = initialState, action: fromAppNotificationsActions.Actions): State {
  switch (action.type) {
    case fromAppNotificationsActions.ADD_NOTIFICATION: {
      const notificationsClone = cloneDeep(state.notifications);
      notificationsClone.push(action.payload);

      return {
        ...state,
        notifications: notificationsClone
      };
    }
    case fromAppNotificationsActions.DELETE_NOTIFICATION: {
      let notificationsClone = cloneDeep(state.notifications);
      notificationsClone = notificationsClone.filter((x: AppNotification<any>) => x.NotificationId !== action.payload.notificationId);
      return {
        ...state,
        notifications: notificationsClone
      };
    }
    case fromAppNotificationsActions.UPDATE_USER_NOTIFICATION_UNREAD_COUNT: {
      return AsyncStateObjHelper.loading(state, 'unreadCountAsyncObj');
    }
    case fromAppNotificationsActions.UPDATE_USER_NOTIFICATION_UNREAD_COUNT_SUCCESS: {
      return AsyncStateObjHelper.loadingSuccess(state, 'unreadCountAsyncObj', action.payload.notificationCount);
    }
    case fromAppNotificationsActions.UPDATE_USER_NOTIFICATION_UNREAD_COUNT_ERROR: {
      return AsyncStateObjHelper.loadingError(state, 'unreadCountAsyncObj');
    }
    default: {
      return state;
    }
  }
}

export const getNotifications = (state: State) => state.notifications;
export const getUnreadCountAsyncObj = (state: State) => state.unreadCountAsyncObj;
