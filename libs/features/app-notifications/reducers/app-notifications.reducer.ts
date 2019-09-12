import * as cloneDeep from 'lodash.clonedeep';

import * as fromAppNotificationsActions from '../actions/app-notifications.actions';
import { AppNotification } from '../models';

export interface State {
  notifications: AppNotification[];
}

const initialState: State = {
  notifications: []
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
      notificationsClone = notificationsClone.filter((x: AppNotification) => x.NotificationId !== action.payload.notificationId);
      return {
        ...state,
        notifications: notificationsClone
      };
    }
    default: {
      return state;
    }
  }
}

export const getNotifications = (state: State) => state.notifications;
