import cloneDeep from 'lodash/cloneDeep';

import { UserNotification } from '../models';
import * as fromUserNotificationListActions from '../actions/user-notification-list.actions';

export interface State {
  userNotifications: UserNotification[];
}

export const initialState: State = {
  userNotifications: []
};

export function reducer(state = initialState, action: fromUserNotificationListActions.Actions): State {
  switch (action.type) {
    case fromUserNotificationListActions.SET_USER_NOTIFICATIONS: {
      const userNotificationsCopy = cloneDeep(state.userNotifications);
      const serverNotifications = cloneDeep(action.payload.newUserNotifications);
      const clientNotifications = action.payload.replaceAll ? [] : userNotificationsCopy;
      const newNotifications = serverNotifications.filter(sn => clientNotifications.findIndex(cn => cn.Id === sn.Id) < 0);
      const finalNotifications = clientNotifications.concat(newNotifications);

      return {
        ...state,
        userNotifications: finalNotifications
      };
    }
    default:
      return state;
  }
}

export const getUserNotifications = (state: State) => state.userNotifications;
