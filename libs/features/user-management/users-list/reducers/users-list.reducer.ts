// Import all exports from our feature's actions
import * as fromUsersListActions from '../actions/users-list.actions';

import { UserGridItem } from '../models';

// Define our feature state
export interface State {
  loading: boolean;
  loadingError: boolean;
  companyName: string;
  users: UserGridItem[];
  allUsers: UserGridItem[];
  userSearchTerm: string;
  usersLoading: boolean;
  companyLoading: boolean;
}

// Define our initial state
const initialState: State = {
  loading: false,
  loadingError: false,
  companyName: '',
  users: [],
  allUsers: [],
  userSearchTerm: null,
  usersLoading: false,
  companyLoading: false
};


// Reducer function
export function reducer(state = initialState, action: fromUsersListActions.Actions): State {
  switch (action.type) {
    case fromUsersListActions.LOAD_USERS: {
      return {
        ...state,
        loading: true,
        users: [],
        allUsers: [],
        usersLoading: true,
      };
    }
    case fromUsersListActions.LOAD_USERS_ERROR: {
      return {
        ...state,
        loading: false,
        loadingError: true
      };
    }
    case fromUsersListActions.LOAD_USERS_SUCCESS: {
      const userSearchTermLowerCase = state.userSearchTerm ? state.userSearchTerm.toLowerCase() : '';
      return {
        ...state,
        usersLoading: false,
        loading: state.companyLoading,
        loadingError: false,
        users: action.payload.filter(ue => ue.FirstName.toLowerCase().startsWith(userSearchTermLowerCase)
          || ue.LastName.toLowerCase().startsWith(userSearchTermLowerCase)),
        allUsers: action.payload
      };
    }
    case fromUsersListActions.LOAD_COMPANY: {
      return {
        ...state,
        loading: true,
        companyName: '',
        companyLoading: true,
      };
    }
    case fromUsersListActions.LOAD_COMPANY_ERROR: {
      return {
        ...state,
        loading: false,
        loadingError: true
      };
    }
    case fromUsersListActions.LOAD_COMPANY_SUCCESS: {
      return {
        ...state,
        companyLoading: false,
        loading: state.usersLoading,
        loadingError: false,
        companyName: action.payload.CompanyName
      };
    }
    case fromUsersListActions.UPDATE_SEARCH_TERM: {
      const filteredUsers = state.allUsers.filter(ue => ue.FirstName.toLowerCase().startsWith(action.payload.toLowerCase())
        || ue.LastName.toLowerCase().startsWith(action.payload.toLowerCase()));
      return {
        ...state,
        loading: false,
        loadingError: false,
        userSearchTerm: action.payload,
        users: filteredUsers
      };
    }
    default: {
      return state;
    }
  }
}

// Selector functions
export const getLoading = (state: State) => state.loading;
export const getLoadingError = (state: State) => state.loadingError;
export const getCompany = (state: State) => state.companyName;
export const getUsers = (state: State) => state.users;
export const getUserSearchTerm = (state: State) => state.userSearchTerm;
