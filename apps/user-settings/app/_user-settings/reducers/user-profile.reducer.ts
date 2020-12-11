import cloneDeep from 'lodash/cloneDeep';

import { AsyncStateObjHelper } from 'libs/core/helpers';
import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models/state';
import { UserProfile } from 'libs/models/user-profile';

import * as fromUserProfileActions from '../actions/user-profile.actions';

export interface State {
  userProfile: AsyncStateObj<UserProfile>;
  cloudFilesPublicBaseUrl: string;
}

const initialState: State = {
  userProfile: generateDefaultAsyncStateObj<UserProfile>(null),
  cloudFilesPublicBaseUrl: ''
};

export function reducer(state = initialState, action: fromUserProfileActions.Actions): State {
  switch (action.type) {
    case fromUserProfileActions.SET_USER_PROFILE: {
      const userProfileClone: AsyncStateObj<UserProfile> = cloneDeep(state.userProfile);
      userProfileClone.obj = action.payload.userProfile;
      return {
        ...state,
        userProfile: userProfileClone,
        cloudFilesPublicBaseUrl: action.payload.cloudFilesPublicBaseUrl
      };
    }
    case fromUserProfileActions.SAVE_USER_PROFILE: {
      return AsyncStateObjHelper.saving(state, 'userProfile');
    }
    case fromUserProfileActions.SAVE_USER_PROFILE_SUCCESS: {
      return AsyncStateObjHelper.savingSuccess(state, 'userProfile', action.payload);
    }
    case fromUserProfileActions.SAVE_USER_PROFILE_ERROR: {
      return AsyncStateObjHelper.savingError(state, 'userProfile');
    }
    default: {
      return state;
    }
  }
}

export const getUserProfile = (state: State) => state.userProfile;
export const getCloudFilesPublicBaseUrl = (state: State) => state.cloudFilesPublicBaseUrl;
