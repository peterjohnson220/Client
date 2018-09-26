import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';


import { CommunityReply } from 'libs/models/community';
import * as communityPostReplyActions from '../actions/community-post-reply.actions';

export interface State extends EntityState<CommunityReply> {
  loadingReplies: boolean;
  loadingRepliesError: boolean;
  updatingLike: boolean;
  updatingLikeError: boolean;
  addingReply: boolean;
  addingReplyError: boolean;
  addingReplySuccess: boolean;
}

function sortByTime(a: CommunityReply, b: CommunityReply) {
  return b.TimeTicks -  a.TimeTicks;
}
// Create entity adapter
export const adapter: EntityAdapter<CommunityReply> = createEntityAdapter<CommunityReply>({
  selectId: (communityReply: CommunityReply) => communityReply.Id,
  sortComparer: sortByTime
});

export const initialState: State = adapter.getInitialState({
  loadingReplies: false,
  loadingRepliesError: false,
  updatingLike: false,
  updatingLikeError: false,
  addingReply: false,
  addingReplyError: false,
  addingReplySuccess: false
});

export function reducer(
  state = initialState,
  action: communityPostReplyActions.Actions
): State {
  switch (action.type) {
    case communityPostReplyActions.GETTING_COMMUNITY_POST_REPLIES: {
      return {
        ...state,
        loadingReplies: true,
        loadingRepliesError: false
      };
    }
    case communityPostReplyActions.GETTING_COMMUNITY_POST_REPLIES_SUCCESS: {
      return {
        ...adapter.upsertMany(action.payload, state),
        loadingReplies: false
      };
    }
    case communityPostReplyActions.GETTING_COMMUNITY_POST_REPLIES_ERROR: {
      return {
        ...state,
        loadingReplies: false,
        loadingRepliesError: true
      };
    }
    case communityPostReplyActions.UPDATING_COMMUNITY_POST_REPLY_LIKE_SUCCESS: {

      const postId = action.payload['postId'];
      const replyId = action.payload['replyId'];
      const like = action.payload['like'];
      const entity = state.entities[replyId];
      const updatedLikeCount = like ? entity.LikeCount + 1 : entity.LikeCount - 1;
​
      return adapter.updateOne(
        { id: postId, changes: { LikedByCurrentUser: like, LikeCount: updatedLikeCount} },
        state,
      );
    }
    case communityPostReplyActions.UPDATING_COMMUNITY_POST_REPLY_LIKE_ERROR: {
      return {
        ...state,
        updatingLike: false,
        updatingLikeError: true
      };
    }
    case communityPostReplyActions.ADDING_COMMUNITY_POST_REPLY: {
      return {
        ...state,
        addingReply: true,
        addingReplyError: false,
        addingReplySuccess: false
      };
    }
    case communityPostReplyActions.ADDING_COMMUNITY_POST_REPLY_SUCCESS: {
      return {
        ...adapter.addOne(action.payload, state),
        addingReply: false,
        addingReplySuccess: true
      };
    }
    case communityPostReplyActions.ADDING_COMMUNITY_POST_REPLY_ERROR: {
      return {
        ...state,
        addingReply: false,
        addingReplyError: true
      };
    }
    case communityPostReplyActions.CLEARING_COMMUNITY_POST_REPLIES: {
      return {
        ...state,
        addingReply: false,
        addingReplyError: false
      };
    }
    default: {
      return state;
    }
  }
}

export const getGettingCommunityPostReplies = (state: State) => state.loadingReplies;
export const getGettingCommunityPostRepliesError = (state: State) => state.loadingRepliesError;

export const getAddingCommunityPostReply = (state: State) => state.addingReply;
export const getAddingCommunityPostReplyError = (state: State) => state.addingReplyError;
export const getAddingCommunityPostReplySuccess = (state: State ) => state.addingReplySuccess;

