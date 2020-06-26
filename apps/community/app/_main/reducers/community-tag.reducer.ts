import * as communityTagActions from '../actions/community-tag.actions';
import { CommunityTag } from 'libs/models/community/community-tag.model';

export interface State {
  suggesting: boolean;
  suggestingError: boolean;
  entities: CommunityTag[];
}

export const initialState: State = {
  suggesting: false,
  suggestingError: false,
  entities: []
};

export function reducer(state = initialState, action: communityTagActions.Actions): State {
  switch (action.type) {

    case communityTagActions.SUGGESTING_COMMUNITY_TAGS: {
      return {
        ...state,
        suggesting: true,
        suggestingError: false
      };
    }
    case communityTagActions.SUGGESTING_COMMUNITY_TAGS_SUCCESS: {
      return {
        ...state,
        suggesting: false,
        entities: action.payload
      };
    }
    case communityTagActions.SUGGESTING_COMMUNITY_TAGS_ERROR: {
      return {
        ...state,
        suggesting: false,
        suggestingError: true
      };
    }
    default: {
      return state;
    }
  }
}

export const getSuggestingCommunityTags = (state: State) => state.suggesting;
export const getSuggestingCommunityTagsError = (state: State) => state.suggestingError;
export const getCommunityTags = (state: State) => state.entities;
