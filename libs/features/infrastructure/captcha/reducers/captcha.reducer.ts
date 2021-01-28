import * as fromCaptchaActions from '../actions/captcha.actions';

import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models';
import { AsyncStateObjHelper } from 'libs/core';

export interface State {
  isLoaded: boolean;
  siteKeyAsyncObj: AsyncStateObj<string>;
}

export const initialState: State = {
  isLoaded: false,
  siteKeyAsyncObj: generateDefaultAsyncStateObj(null)
};

export function reducer(state = initialState, action: fromCaptchaActions.Actions): State {
  switch (action.type) {
    case fromCaptchaActions.LOADED:
      return {
        ...state,
        isLoaded: true
      };
    case fromCaptchaActions.GET_SITE_KEY:
      return AsyncStateObjHelper.loading(state, 'siteKeyAsyncObj');
    case fromCaptchaActions.GET_SITE_KEY_SUCCESS:
      return AsyncStateObjHelper.loadingSuccess(state, 'siteKeyAsyncObj', action.payload.siteKey);
    case fromCaptchaActions.GET_SITE_KEY_ERROR:
      return AsyncStateObjHelper.loadingError(state, 'siteKeyAsyncObj');
    default: {
      return state;
    }
  }
}

// Selector Functions
export const getIsLoaded = (state: State) => state.isLoaded;
export const getSiteKeyAsyncObj = (state: State) => state.siteKeyAsyncObj;
