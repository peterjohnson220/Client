import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models/state';
import { AsyncStateObjHelper } from 'libs/core/helpers';

import { UserNotification } from '../models';
import * as fromUserNotificationListActions from '../actions/user-notification-list.actions';

export interface State {
  userNotificationsAsyncObj: AsyncStateObj<UserNotification[]>;
}

export const initialState: State = {
  userNotificationsAsyncObj: generateDefaultAsyncStateObj<UserNotification[]>([]),
};

export function reducer(state = initialState, action: fromUserNotificationListActions.Actions): State {
  switch (action.type) {
    case fromUserNotificationListActions.GET_USER_NOTIFICATIONS:
      return AsyncStateObjHelper.loading(state, 'userNotificationsAsyncObj');
    case fromUserNotificationListActions.GET_USER_NOTIFICATIONS_SUCCESS:
      return AsyncStateObjHelper.loadingSuccess(state, 'userNotificationsAsyncObj', action.payload);
    case fromUserNotificationListActions.GET_USER_NOTIFICATIONS_ERROR:
      return AsyncStateObjHelper.loadingError(state, 'userNotificationsAsyncObj');
    default:
      return state;
  }
}

export const getUserNotificationsAsyncObj = (state: State) => state.userNotificationsAsyncObj;
