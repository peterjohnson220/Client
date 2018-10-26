import * as fromCommunityPostFilterReplyViewActions from '../actions/community-post-filter-reply-view.actions';

export interface State {
  entities: string[];
}

export const initialState: State = {
  entities: []
};

export function reducer(state = initialState, action: fromCommunityPostFilterReplyViewActions.Actions): State {
  switch (action.type) {
    case fromCommunityPostFilterReplyViewActions.ADDING_COMMUNITY_POST_FILTERED_REPLIES_TO_VIEW: {
      const replyIds = action.payload[ 'replyIds' ];

      return {
        ...state,
        entities: replyIds
      };
    }
    case fromCommunityPostFilterReplyViewActions.CLEARING_COMMUNITY_POST_FILTERED_REPLIES_TO_VIEW: {
      return {
        ...state,
        entities: []
      };
    }
    default: {
      return state;
    }
  }
}

export const getCommunityPostFilterReplyView = (state: State) => state.entities;
