import { UserRoleTabState } from '../constants/user-role.constants';
import * as fromUserRoleViewActions from '../actions/user-role-view.action';

export interface IUserRoleState {
  CurrentTab: UserRoleTabState;
}

export const initialState: IUserRoleState = {
  CurrentTab: UserRoleTabState.FUNCTION
};

export function reducer(state = initialState, action: fromUserRoleViewActions.Actions): IUserRoleState {
  switch (action.type) {
    case fromUserRoleViewActions.UPDATE_USER_ROLE_TAB_STATE: {
      return {
        ...state,
        CurrentTab: action.payload as UserRoleTabState
      };
    }
    default: {
      return state;
    }
  }
}

export const getUserRoleViewState = (state: IUserRoleState) => state;
export const getUserRoleCurrentTab = (state: IUserRoleState) => state.CurrentTab;