import cloneDeep from 'lodash/cloneDeep';

import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models/state';
import { AsyncStateObjHelper } from 'libs/core/helpers';

import * as fromEmailPreferencesPageActions from '../actions/email-preferences.actions';
import { SaveNotificationPreferencesApiResponseEnum, UserSubscription } from '../models/communication-preferences';

export interface State {
  subscriptions: AsyncStateObj<UserSubscription[]>;
  updatingSubscriptions: boolean;
  saveEmailPreferencesResponse: string;
}

const initialState: State = {
  subscriptions: generateDefaultAsyncStateObj<UserSubscription[]>([]),
  updatingSubscriptions: false,
  saveEmailPreferencesResponse: ''
};

export function reducer(state = initialState, action: fromEmailPreferencesPageActions.Actions) {

  switch (action.type) {
    case fromEmailPreferencesPageActions.GET_USER_SUBSCRIPTIONS: {
      return AsyncStateObjHelper.loading(state, 'subscriptions');
    }

    case fromEmailPreferencesPageActions.GET_USER_SUBSCRIPTIONS_SUCCESS: {
      const subscriptionsClone = cloneDeep(state.subscriptions);
      subscriptionsClone.loading = false;
      subscriptionsClone.loadingError = false;
      subscriptionsClone.obj = cloneDeep(action.payload);
      subscriptionsClone.obj.forEach( s => {
        s.Dirty = false;
      });

      return {
        ...state,
        subscriptions: subscriptionsClone
      };
    }

    case fromEmailPreferencesPageActions.GET_USER_SUBSCRIPTIONS_ERROR: {
      return AsyncStateObjHelper.loadingError(state, 'subscriptions');
    }

    case fromEmailPreferencesPageActions.UPDATE_USER_SUBSCRIPTIONS: {
      return {
        ...state,
        updatingSubscriptions: true
      };
    }

    case fromEmailPreferencesPageActions.UPDATE_USER_SUBSCRIPTIONS_SUCCESS: {
      const subscriptionsClone = cloneDeep(state.subscriptions);
      subscriptionsClone.obj.forEach(s => {
        s.Dirty = false;
      });

      return {
        ...state,
        updatingSubscriptions: false,
        subscriptions: subscriptionsClone,
        saveEmailPreferencesResponse: SaveNotificationPreferencesApiResponseEnum.Success
      };
    }

    case fromEmailPreferencesPageActions.UPDATE_USER_SUBSCRIPTIONS_ERROR: {
        return {
          ...state,
          updatingSubscriptions: false,
          saveEmailPreferencesResponse: SaveNotificationPreferencesApiResponseEnum.Error
        };
    }
    case fromEmailPreferencesPageActions.TOGGLE_USER_SUBSCRIPTION: {
      const subscriptionsClone = cloneDeep(state.subscriptions);
      const subscription = subscriptionsClone.obj.find(x => x.UserSubscriptionId === action.payload.UserSubscriptionId);

      subscription.Subscribed = action.payload.Checked;
      subscription.Dirty = !subscription.Dirty;

      return {
        ...state,
        subscriptions: subscriptionsClone,
        saveEmailPreferencesResponse: ''
      };
    }

    default: {
      return state;
    }
  }
}
export const getUserSubscriptions = (state: State) => state.subscriptions;
export const getUserSubscriptionsHasPendingChanges = (state: State) => state.subscriptions.obj.some(s => s.Dirty);
export const getUpdateEmailPreferencesApiResponse = (state: State) => state.saveEmailPreferencesResponse;
