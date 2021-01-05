import cloneDeep from 'lodash/cloneDeep';

import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models/state';

import * as fromAutoShareActions from '../actions/auto-share.actions';
import { AutoShareUser } from '../../../../models/user-settings';

export interface State {
  shareableUsersAsync: AsyncStateObj<AutoShareUser[]>;
  showAutoShareModal: boolean;
}

const initialState: State = {
  shareableUsersAsync: generateDefaultAsyncStateObj<AutoShareUser[]>([]),
  showAutoShareModal: false
};

export function reducer(state = initialState, action: fromAutoShareActions.Actions): State {
  switch (action.type) {
    case fromAutoShareActions.GET_SHAREABLE_USERS: {
      const asyncStateObjClone = cloneDeep(state.shareableUsersAsync);
      asyncStateObjClone.loading = true;
      asyncStateObjClone.loadingError = false;
      asyncStateObjClone.obj = [];

      return {
        ...state,
        shareableUsersAsync: asyncStateObjClone
      };
    }
    case fromAutoShareActions.GET_SHAREABLE_USERS_SUCCESS: {
      const autoSharedUsersAsyncClone = cloneDeep(state.shareableUsersAsync);
      autoSharedUsersAsyncClone.loading = false;
      autoSharedUsersAsyncClone.obj = action.payload;

      return {
        ...state,
        shareableUsersAsync: autoSharedUsersAsyncClone
      };
    }
    case fromAutoShareActions.GET_SHAREABLE_USERS_ERROR: {
      const asyncStateObjClone = cloneDeep(state.shareableUsersAsync);
      asyncStateObjClone.loading = false;
      asyncStateObjClone.loadingError = true;

      return {
        ...state,
        shareableUsersAsync: asyncStateObjClone
      };
    }
    case fromAutoShareActions.REMOVE_AUTO_SHARED_USER_SUCCESS: {
      const asyncStateObjClone = cloneDeep(state.shareableUsersAsync);
      const matchingUser = asyncStateObjClone.obj.find(u => u.UserId === action.payload);
      if (matchingUser) {
        matchingUser.IsSelected = false;
      }
      return {
        ...state,
        shareableUsersAsync: asyncStateObjClone
      };
    }
    case fromAutoShareActions.GET_AUTO_SHARED_USERS_SUCCESS: {
      const asyncStateObjClone = cloneDeep(state.shareableUsersAsync);
      const selectedUserIds = action.payload.map(su => su.UserId);
      if (action.payload.length) {
        const selectedUsers = asyncStateObjClone.obj.filter(u => selectedUserIds.includes(u.UserId));
        selectedUsers.forEach(su => su.IsSelected = true);
      }
      return {
        ...state,
        shareableUsersAsync: asyncStateObjClone
      };
    }
    case fromAutoShareActions.OPEN_AUTO_SHARE_MODAL: {
      return {
        ...state,
        showAutoShareModal: true
      };
    }
    case fromAutoShareActions.CLOSE_AUTO_SHARE_MODAL: {
      return {
        ...state,
        showAutoShareModal: false
      };
    }
    case fromAutoShareActions.SAVE_AUTO_SHARE_USERS: {
      const asyncStateObjClone = cloneDeep(state.shareableUsersAsync);
      const selectedUsers = action.payload;
      const sharedUsers = asyncStateObjClone.obj.filter(x => x.IsSelected === true);
      const usersToAdd = asyncStateObjClone.obj.filter(x => selectedUsers.includes(x.UserId) && x.IsSelected === false);
      // Remove users from the shared list
      const removedUsers = sharedUsers.filter(u => !selectedUsers.includes(u.UserId));
      if (removedUsers.length > 0) {
        removedUsers.forEach(ru => ru.IsSelected = false);
      }
      // Add users to the shared list
      if (usersToAdd.length > 0) {
        usersToAdd.forEach(ua => ua.IsSelected = true);
      }
      return {
        ...state,
        shareableUsersAsync: asyncStateObjClone
      };
    }
    case fromAutoShareActions.TOGGLE_SELECTED_USER: {
      const asyncStateObjClone = cloneDeep(state.shareableUsersAsync);
      const matchingUser = asyncStateObjClone.obj.find(u => u.UserId === action.payload.UserId);
      if (matchingUser) {
        matchingUser.IsSelected = action.payload.IsSelected;
      }
      return {
        ...state,
        shareableUsersAsync: asyncStateObjClone
      };
    }
    default: {
      return state;
    }
  }
}

export const getShareableUsersAsync = (state: State) => state.shareableUsersAsync;
export const getSelectedUsers = (state: State) => {
  return state.shareableUsersAsync.obj.filter(u => u.IsSelected);
};
export const getShowAutoShareModal = (state: State) => state.showAutoShareModal;
