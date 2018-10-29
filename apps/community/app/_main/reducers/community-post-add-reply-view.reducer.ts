import * as cloneDeep from 'lodash.clonedeep';

import * as fromCommunityPostAddReplyViewActions from '../actions/community-post-add-reply-view.actions';

export interface State {
  entities: string[];
}

export const initialState: State = {
  entities: []
};

export function reducer(state = initialState, action: fromCommunityPostAddReplyViewActions.Actions): State {
  switch (action.type) {
    case fromCommunityPostAddReplyViewActions.ADDING_COMMUNITY_POST_REPLY_TO_VIEW: {
      const replyId = action.payload['replyId'];
      let currentEntities = cloneDeep(state.entities);
      if (!currentEntities) {
        currentEntities = [];
      }
      currentEntities.unshift(replyId);
      return {
        ...state,
        entities: currentEntities
      };
    }
    case fromCommunityPostAddReplyViewActions.CLEARING_COMMUNITY_POST_REPLIES: {
    // TODO: this should only clear replies specific to the post
      const filteredEntities = [];
      return {
        ...state,
        entities: filteredEntities
      };
    }
    case fromCommunityPostAddReplyViewActions.CLEARING_ALL_COMMUNITY_POST_REPLIES: {

      const filteredEntities = [];
      return {
        ...state,
        entities: filteredEntities
      };
    }
    default: {
      return state;
    }
  }
}

export const getCommunityPostAddReplyView = (state: State ) => state.entities;
