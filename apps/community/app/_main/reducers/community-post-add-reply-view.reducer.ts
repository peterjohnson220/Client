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
      if (!currentEntities){
        currentEntities = [];
      }
      currentEntities.push(replyId);
      return {
        ...state,
        entities: currentEntities
      };
    }
    case fromCommunityPostAddReplyViewActions.CLEARING_COMMUNITY_POST_REPLIES: {
      const postId = action.payload['PostId'];

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
