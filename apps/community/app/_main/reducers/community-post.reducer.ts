import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

import { CommunityPost } from 'libs/models/community';

import * as communityPostActions from '../actions/community-post.actions';
import { CommunityConstants, PagingOptions } from '../models';

export interface State extends EntityState<CommunityPost> {
  submitting: boolean;
  submittingError: boolean;
  loading: boolean;
  loadingError: boolean;
  loadingNextBatchPosts: boolean;
  loadingPreviousBatchPosts: boolean;
  submittedPost: CommunityPost;
  addingCommunityDiscussionPoll: boolean;
  addingCommunityDiscussionPollError: boolean;
  addingCommunityDiscussionPollSuccess: boolean;
  startIndexDisplayed: number;
  endIndexDisplayed: number;
  pagingOptions: PagingOptions;
  totalResultsOnServer: number;
  maximumReplies: number;
  postId: string;
  deletedPostId: string;
  editedPostId: string;
  discardingPost: boolean;
  discardingPostProceed: boolean;
}

function sortByTime(a: CommunityPost, b: CommunityPost) {
  return b.TimeTicks - a.TimeTicks;
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
  loadingNextBatchPosts: false,
  loadingPreviousBatchPosts: false,
  submittedPost: null,
  addingCommunityDiscussionPoll: false,
  addingCommunityDiscussionPollError: false,
  addingCommunityDiscussionPollSuccess: false,
  startIndexDisplayed: 1,
  endIndexDisplayed: 1,
  pagingOptions: {
    PageIndex: 1,
    NumberOfPosts: CommunityConstants.POSTS_PER_BATCH
  },
  totalResultsOnServer: 0,
  maximumReplies: null,
  postId: null,
  deletedPostId: null,
  editedPostId: null,
  discardingPost: false,
  discardingPostProceed: false
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
        startIndexDisplayed: 1,
        endIndexDisplayed: 1,
        pagingOptions: { ...state.pagingOptions, PageIndex: 1 }
      };
    }
    case communityPostActions.GETTING_COMMUNITY_POSTS_SUCCESS: {
      return {
        ...adapter.setAll(action.payload.Posts, state),
        loading: false,
        totalResultsOnServer: action.payload.Paging.TotalRecordCount,
        maximumReplies: action.payload.Paging.MaximumReplies
      };
    }
    case communityPostActions.GETTING_COMMUNITY_POSTS_ERROR: {
      return {
        ...state,
        loading: false,
        loadingError: true
      };
    }
    case communityPostActions.GETTING_NEXT_BATCH_COMMUNITY_POSTS: {
      let newStartIndexDisplayed = state.startIndexDisplayed;
      let newEndIndexDisplayed = state.endIndexDisplayed;
      const hasNextBatchOnServer = state.totalResultsOnServer > CommunityConstants.POSTS_PER_BATCH * (state.endIndexDisplayed + 1);

      if (hasNextBatchOnServer) {
        newStartIndexDisplayed = newEndIndexDisplayed;
      }

      newEndIndexDisplayed += 1;

      return {
        ...state,
        loadingNextBatchPosts: true,
        startIndexDisplayed: newStartIndexDisplayed,
        endIndexDisplayed: newEndIndexDisplayed,
        pagingOptions: { ...state.pagingOptions, PageIndex: newEndIndexDisplayed, NumberOfPosts: CommunityConstants.POSTS_PER_BATCH }
      };
    }
    case communityPostActions.GETTING_NEXT_BATCH_COMMUNITY_POSTS_SUCCESS: {
      const existingPostsInStore = Object.keys(state.entities).map(function (key) {
        return state.entities[ key ];
      });

      existingPostsInStore.sort(sortByTime);

      const payloadPostCount = action.payload.Posts.length;
      let addModifiedState = adapter.addMany(action.payload.Posts, state);

      const hasNextBatchOnServer = state.totalResultsOnServer > CommunityConstants.POSTS_PER_BATCH * state.pagingOptions.PageIndex;

      if (existingPostsInStore.length >= (CommunityConstants.POST_PAGING_FACTOR * CommunityConstants.POSTS_PER_BATCH)
        && hasNextBatchOnServer) {
        const postIds = existingPostsInStore.map(o => {
          return o.Id;
        });
        addModifiedState = adapter.removeMany(postIds.slice(0, payloadPostCount), addModifiedState);
      }

      return {
        ...addModifiedState,
        loadingNextBatchPosts: false
      };
    }
    case communityPostActions.GETTING_NEXT_BATCH_COMMUNITY_POSTS_ERROR: {
      return {
        ...state,
        loadingNextBatchPosts: false,
        loadingError: true
      };
    }

    case communityPostActions.GETTING_PREVIOUS_BATCH_COMMUNITY_POSTS: {
      let newStartIndexDisplayed = state.startIndexDisplayed;
      let newEndIndexDisplayed = state.endIndexDisplayed;

      if (state.startIndexDisplayed > 1) {
        newEndIndexDisplayed = state.startIndexDisplayed;
        newStartIndexDisplayed = state.startIndexDisplayed - 1;
      }

      return {
        ...state,
        loadingPreviousBatchPosts: true,
        startIndexDisplayed: newStartIndexDisplayed,
        endIndexDisplayed: newEndIndexDisplayed,
        pagingOptions: { ...state.pagingOptions, PageIndex: newStartIndexDisplayed, NumberOfPosts: CommunityConstants.POSTS_PER_BATCH }
      };
    }
    case communityPostActions.GETTING_PREVIOUS_BATCH_COMMUNITY_POSTS_SUCCESS: {
      const existingPostsInStore = Object.keys(state.entities).map(function (key) {
        return state.entities[ key ];
      });

      existingPostsInStore.sort(sortByTime);

      const postIds = existingPostsInStore.map(o => {
        return o.Id;
      });

      let addModifiedState = adapter.addMany(action.payload.Posts, state);

      if (postIds.length >= CommunityConstants.POST_PAGING_FACTOR * CommunityConstants.POSTS_PER_BATCH) {
        addModifiedState = adapter.removeMany(postIds.slice(CommunityConstants.POSTS_PER_BATCH, postIds.length), addModifiedState);
      }

      return {
        ...addModifiedState,
        loadingPreviousBatchPosts: false
      };
    }
    case communityPostActions.GETTING_PREVIOUS_BATCH_COMMUNITY_POSTS_ERROR: {
      return {
        ...state,
        loadingPreviousBatchPosts: false,
        loadingError: true
      };
    }

    case communityPostActions.GETTING_BACK_TO_TOP_COMMUNITY_POSTS: {
      return {
        ...state,
        loading: true,
        startIndexDisplayed: 1,
        endIndexDisplayed: 1,
        pagingOptions: { ...state.pagingOptions, PageIndex: 1 }
      };
    }

    case communityPostActions.GETTING_BACK_TO_TOP_COMMUNITY_POSTS_SUCCESS: {
      return {
        ...adapter.setAll(action.payload.Posts,
          state),
        loading: false
      };
    }

    case communityPostActions.GETTING_BACK_TO_TOP_COMMUNITY_POSTS_ERROR: {
      return {
        ...state,
        loading: false,
        loadingError: true
      };
    }

    case communityPostActions.UPDATING_COMMUNITY_POST_LIKE_SUCCESS: {
      const postId = action.payload[ 'postId' ];
      const like = action.payload[ 'like' ];
      const entity = state.entities[ postId ];
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
    case communityPostActions.UPDATING_COMMUNITY_POST_FAVORITE_SUCCESS: {
      const postId = action.payload[ 'postId' ];
      const favorite = action.payload[ 'favorite' ];

      return {
        ...adapter.updateOne(
          { id: postId, changes: { FavoritedByCurrentUser: favorite } },
          state)
      };
    }
    case communityPostActions.UPDATING_COMMUNITY_POST_FAVORITE_ERROR: {
      return {
        ...state,
        submittingError: true
      };
    }

    case communityPostActions.UPDATING_COMMUNITY_POST_REPLY_IDS: {
      const postId = action.payload[ 'postId' ];
      const replyIds = action.payload[ 'replyIds' ];

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
          state),
        deletedPostId: postId
      };
    }
    case communityPostActions.DELETING_COMMUNITY_POST_ERROR: {
      return {
        ...state,
        submittingError: true,
        deletedPostId: null
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
    case communityPostActions.GETTING_COMMUNITY_POST: {
      return {
        ...state,
        loading: true,
        loadingError: false,
        postId: null
      };
    }
    case communityPostActions.GETTING_COMMUNITY_POST_SUCCESS: {
      const post = action.payload;
      return {
        ...adapter.upsertOne(post, state),
        loading: false,
        postId: post.Id,
        maximumReplies: 150,
        deletedPostId: null
      };
    }
    case communityPostActions.GETTING_COMMUNITY_POST_ERROR: {
      return {
        ...state,
        loading: false,
        loadingError: true,
        postId: null
      };
    }
    case communityPostActions.EDITING_COMMUNITY_POST: {
      const postId = action.payload;

      return {
        ...state,
        editedPostId: postId
      };
    }
    case communityPostActions.CANCEL_EDITING_COMMUNITY_POST: {
      return {
        ...state,
        editedPostId: null
      };
    }
    case communityPostActions.SAVING_COMMUNITY_POST_EDIT: {
      return {
        ...state
      };
    }
    case communityPostActions.SAVING_COMMUNITY_POST_EDIT_SUCCESS: {
      return {...adapter.updateOne(
        {
          id: action.payload.PostId, changes: {
            Attachments: action.payload.Attachments,
            Content: action.payload.PostText,
            Topic: action.payload.Topic
          }
        },
          state),
        editedPostId: null
      };
    }
    case communityPostActions.SAVING_COMMUNITY_POST_EDIT_ERROR: {
      return {
        ...state,
        editedPostId: null
      };
    }
    case communityPostActions.DISCARDING_COMMUNITY_POST: {
      return {
        ...state,
        discardingPost: true,
        discardingPostProceed: false
      };
    }
    case communityPostActions.DISCARDING_COMMUNITY_POST_PROCEED: {
      return {
        ...state,
        discardingPost: false,
        discardingPostProceed: true
      };
    }
    case communityPostActions.DISCARDING_COMMUNITY_POST_CANCEL: {
      return {
        ...state,
        discardingPost: false,
        discardingPostProceed: false
      };
    }
    default: {
      return state;
    }
  }
}

export const getSubmittingCommunityPosts = (state: State) => state.submitting;
export const getSubmittingCommunityPostsError = (state: State) => state.submittingError;
export const getSubmittingCommunityPostsSuccess = (state: State) => state.submittedPost;

export const getGettingCommunityPosts = (state: State) => state.loading;
export const getGettingCommunityPostsError = (state: State) => state.loadingError;

export const getAddingCommunityDiscussionPoll = (state: State) => state.addingCommunityDiscussionPoll;
export const getAddingCommunityDiscussionPollError = (state: State) => state.addingCommunityDiscussionPollError;
export const getAddingCommunityDiscussionPollSuccess = (state: State) => state.addingCommunityDiscussionPollSuccess;
export const getTotalResultsOnServer = (state: State) => state.totalResultsOnServer;
export const getDiscussionPagingOptions = (state: State) => state.pagingOptions;
export const getLoadingNextBatchPosts = (state: State) => state.loadingNextBatchPosts;
export const getLoadingPreviousBatchPosts = (state: State) => state.loadingPreviousBatchPosts;
export const getMaximumReplies = (state: State) => state.maximumReplies;

export const getLoadingCommunityPost = (state: State) => state.loading;
export const getLoadingCommunityPostError = (state: State) => state.loadingError;
export const getLoadingCommunityPostSuccess = (state: State) => state.postId;

export const getCommunityPostDeleted = (state: State) => state.deletedPostId;
export const getCommunityPostEdited = (state: State) => state.editedPostId;

export const getDiscardingPost = (state: State) => state.discardingPost;
export const getDiscardingPostProceed = (state: State) => state.discardingPostProceed;

