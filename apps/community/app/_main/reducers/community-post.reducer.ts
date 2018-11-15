import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

import { CommunityPost } from 'libs/models/community';
import * as communityPostActions from '../actions/community-post.actions';
import { PagingOptions } from '../models';

export interface State extends EntityState<CommunityPost> {
  submitting: boolean;
  submittingError: boolean;
  loading: boolean;
  loadingError: boolean;
  loadingMorePosts: boolean;
  submittedPost: CommunityPost;
  addingCommunityDiscussionPoll: boolean;
  addingCommunityDiscussionPollError: boolean;
  addingCommunityDiscussionPollSuccess: boolean;
  pagingOptions: PagingOptions;
  totalResultsOnServer: number;
}

function sortByTime(a: CommunityPost, b: CommunityPost) {
  return b.TimeTicks -  a.TimeTicks;
}
// Create entity adapter
export const adapter: EntityAdapter<CommunityPost> = createEntityAdapter<CommunityPost>({
  selectId: (communityPost: CommunityPost) => communityPost.Id,
  sortComparer: sortByTime
});

export const initialState: State = adapter.getInitialState({
  submitting: false,
  submittingError: false,
  loading: false,
  loadingError: false,
  loadingMorePosts: false,
  submittedPost: null,
  addingCommunityDiscussionPoll: false,
  addingCommunityDiscussionPollError: false,
  addingCommunityDiscussionPollSuccess: false,
  pagingOptions: {
    StartIndex: 1,
    NumberOfPosts: 20
  },
  totalResultsOnServer: 0
});

export function reducer(
  state = initialState,
  action: communityPostActions.Actions
): State {
  switch (action.type) {
    case communityPostActions.SUBMITTING_COMMUNITY_POST: {
      return {
        ...state,
        submitting: true,
        submittingError: false
      };
    }
    case communityPostActions.SUBMITTING_COMMUNITY_POST_SUCCESS: {
      return {
        ...adapter.addOne(action.payload, state),
        submitting: false,
        submittedPost: action.payload
      };
    }
    case communityPostActions.SUBMITTING_COMMUNITY_POST_ERROR: {
      return {
        ...state,
        submitting: false,
        submittingError: true
      };
    }
    case communityPostActions.GETTING_COMMUNITY_POSTS: {
      return {
        ...state,
        loading: true,
        loadingError: false,
        pagingOptions: {...state.pagingOptions, StartIndex: 1}
      };
    }
    case communityPostActions.GETTING_COMMUNITY_POSTS_SUCCESS: {
      return {
        ...adapter.addAll(action.payload.Posts, state),
        loading: false,
        totalResultsOnServer: action.payload.Paging.TotalRecordCount
      };
    }
    case communityPostActions.GETTING_COMMUNITY_POSTS_ERROR: {
      return {
        ...state,
        loading: false,
        loadingError: true
      };
    }
    case communityPostActions.GETTING_MORE_COMMUNITY_POSTS: {
      return {
        ...state,
        loadingMorePosts: true,
        pagingOptions: {...state.pagingOptions, StartIndex: state.pagingOptions.StartIndex + 1, NumberOfPosts: 15}
      };
    }
    case communityPostActions.GETTING_MORE_COMMUNITY_POSTS_SUCCESS: {
      return {
        ...adapter.addMany(action.payload.Posts, state),
        loadingMorePosts: false
      };
    }
    case communityPostActions.GETTING_MORE_COMMUNITY_POSTS_ERROR: {
      return {
        ...state,
        loadingMorePosts: false,
        loadingError: true
      };
    }

    case communityPostActions.UPDATING_COMMUNITY_POST_LIKE_SUCCESS: {
      const postId = action.payload['postId'];
      const like = action.payload['like'];
      const entity = state.entities[postId];
      const updatedLikeCount = like ? entity.LikeCount + 1 : entity.LikeCount - 1;

      return {
        ...adapter.updateOne(
        { id: postId, changes: { LikedByCurrentUser: like, LikeCount: updatedLikeCount } },
        state)
      };
    }
    case communityPostActions.UPDATING_COMMUNITY_POST_LIKE_ERROR: {
      return {
        ...state,
        submittingError: true
      };
    }
    case communityPostActions.UPDATING_COMMUNITY_POST_REPLY_IDS: {
      const postId = action.payload['postId'];
      const replyIds = action.payload['replyIds'];

      return {
        ...adapter.updateOne(
          { id: postId, changes: { ReplyIds: replyIds } },
          state)
      };
    }

    case communityPostActions.DELETING_COMMUNITY_POST_SUCCESS: {
      const postId = action.payload;
      return {
        ...adapter.removeOne(postId,
          state)
      };
    }
    case communityPostActions.DELETING_COMMUNITY_POST_ERROR: {
      return {
        ...state,
        submittingError: true
      };
    }
    case communityPostActions.ADDING_COMMUNITY_DISCUSSION_POLL: {
      return {
        ...state,
        addingCommunityDiscussionPoll: true,
        addingCommunityDiscussionPollSuccess: false,
        addingCommunityDiscussionPollError: false
      };
    }
    case communityPostActions.ADDING_COMMUNITY_DISCUSSION_POLL_SUCCESS: {
      return {
        ...adapter.addOne(action.payload, state),
        addingCommunityDiscussionPoll: false,
        addingCommunityDiscussionPollSuccess: true,
        submittedPost: action.payload
      };
    }
    case communityPostActions.ADDING_COMMUNITY_DISCUSSION_POLL_ERROR: {
      return {
        ...state,
        addingCommunityDiscussionPoll: false,
        addingCommunityDiscussionPollError: true,
        addingCommunityDiscussionPollSuccess: false
      };
    }
    default: {
      return state;
    }
  }
}
export const getSubmittingCommunityPosts = (state: State) => state.submitting;
export const getSubmittingCommunityPostsError = (state: State) => state.submittingError;
export const getSubmittingCommunityPostsSuccess = (state: State ) => state.submittedPost;

export const getGettingCommunityPosts = (state: State) => state.loading;
export const getGettingCommunityPostsError = (state: State) => state.loadingError;

export const getAddingCommunityDiscussionPoll = (state: State) => state.addingCommunityDiscussionPoll;
export const getAddingCommunityDiscussionPollError = (state: State) => state.addingCommunityDiscussionPollError;
export const getAddingCommunityDiscussionPollSuccess = (state: State) => state.addingCommunityDiscussionPollSuccess;
export const getTotalResultsOnServer = (state: State) => state.totalResultsOnServer;
export const getDiscussionPagingOptions = (state: State) => state.pagingOptions;
export const getLoadingMorePosts = (state: State) => state.loadingMorePosts;

