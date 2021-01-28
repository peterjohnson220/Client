import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models';
import { AsyncStateObjHelper } from 'libs/core';
import { ECommerceSettings } from 'libs/models/payfactors-api/ecommerce';

import * as fromECommerceActions from '../actions/ecommerce.actions';

export interface State {
  settingsAsyncObj: AsyncStateObj<ECommerceSettings>;
}

export const initialState: State = {
  settingsAsyncObj: generateDefaultAsyncStateObj(null)
};

export function reducer(state = initialState, action: fromECommerceActions.Actions): State {
  switch (action.type) {
    case fromECommerceActions.GET_SETTINGS:
      return AsyncStateObjHelper.loading(state, 'settingsAsyncObj');
    case fromECommerceActions.GET_SETTINGS_SUCCESS:
      return AsyncStateObjHelper.loadingSuccess(state, 'settingsAsyncObj', action.payload.settings);
    case fromECommerceActions.GET_SETTINGS_ERROR:
      return AsyncStateObjHelper.loadingError(state, 'settingsAsyncObj');
    default: {
      return state;
    }
  }
}

// Selector Functions
export const getSettingsAsyncObj = (state: State) => state.settingsAsyncObj;
