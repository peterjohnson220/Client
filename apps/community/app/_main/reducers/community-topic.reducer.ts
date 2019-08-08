import { CommunityPost, CommunityTopic } from 'libs/models/community';
import * as communityTopicActions from '../actions/community-topic.actions';
import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';

export interface State {
  loading: boolean;
  loadingError: boolean;
  topics: CommunityTopic[];
}

export const initialState: State = {
  loading: false,
  loadingError: false,
  topics: []
};

export function reducer(state = initialState, action: communityTopicActions.Actions): State {
  switch (action.type) {
    case communityTopicActions.LOADING_COMMUNITY_TOPICS: {
      return {
        ...state,
        loading: true,
        loadingError: false,
        topics: []
      };
    }
    case communityTopicActions.LOADING_COMMUNITY_TOPICS_SUCCESS: {
      return {
        ...state,
        loading: false,
        topics: action.payload
      };
    }
    case communityTopicActions.LOADING_COMMUNITY_TOPICS_ERROR: {
      return {
        ...state,
        loading: false,
        loadingError: true
      };
    }
    default: {
      return state;
    }
  }
}

export const getLoadingCommunityTopics = (state: State) => state.loading;
export const getLoadingCommunityTopicsError = (state: State) => state.loadingError;
export const getCommunityTopics = (state: State) => state.topics;
