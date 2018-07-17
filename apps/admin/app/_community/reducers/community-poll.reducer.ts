import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import * as communityPollActions from '../actions/community-poll.actions';
import { CommunityPoll } from 'libs/models/community/community-poll.model';

export interface State extends EntityState<CommunityPoll> {
  loading: boolean;
  loadingError: boolean;
  addingCommunityPoll: boolean;
  addingCommunityPollError: boolean;
  addingCommunityPollSuccess: boolean;
  addCommunityPollModalOpen: boolean;
}

// Create entity adapter
export const adapter: EntityAdapter<CommunityPoll> = createEntityAdapter<CommunityPoll>({
  selectId: (communityPollItem: CommunityPoll) => communityPollItem.CommunityPollId
});

export const initialState: State = adapter.getInitialState ({
  loading: false,
  loadingError: false,
  addingCommunityPoll: false,
  addingCommunityPollError: false,
  addingCommunityPollSuccess: false,
  addCommunityPollModalOpen: false,
});

// Reducer
export function reducer(state = initialState, action: communityPollActions.Actions): State {
  switch (action.type) {
    case communityPollActions.LOADING_COMMUNITY_POLLS: {
      return {
        ...state,
        loading: true,
        loadingError: false
      };
    }
    case communityPollActions.LOADING_COMMUNITY_POLLS_SUCCESS: {
      return {
        ...adapter.addAll(action.payload, state),
        loading: false
      };
    }
    case communityPollActions.LOADING_COMMUNITY_POLLS_ERROR: {
      return {
        ...state,
        loading: false,
        loadingError: true
      };
    }
    case communityPollActions.ADDING_COMMUNITY_POLL: {
      return {
        ...state,
        addingCommunityPoll: true,
        addingCommunityPollError: false
      };
    }
    case communityPollActions.ADDING_COMMUNITY_POLL_SUCCESS: {
      return {
        ...state,
        addingCommunityPoll: false,
        addingCommunityPollSuccess: true,
        addCommunityPollModalOpen: false
      };
    }
    case communityPollActions.ADDING_COMMUNITY_POLL_ERROR: {
      return {
        ...state,
        addingCommunityPoll: false,
        addingCommunityPollError: true
      };
    }
    case communityPollActions.OPEN_ADD_COMMUNITY_POLL_MODAL: {
        return {
          ...state,
          addCommunityPollModalOpen: true
        };
    }
    case communityPollActions.CLOSE_ADD_COMMUNITY_POLL_MODAL: {
        return {
          ...state,
          addCommunityPollModalOpen: false,
        };
    }
    default: {
      return state;
    }
  }
}

// Selector Functions
export const getLoading = (state: State) => state.loading;
export const getLoadingError = (state: State) => state.loadingError;
export const getAddingCommunityPoll = (state: State) => state.addingCommunityPoll;
export const getAddingCommunityPollError = (state: State) => state.addingCommunityPollError;
export const getAddingCommunityPollSuccess = (state: State) => state.addingCommunityPollSuccess;
export const getAddCommunityPollModalOpen = (state: State) => state.addCommunityPollModalOpen;
