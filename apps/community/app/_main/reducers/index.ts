import { createSelector, createFeatureSelector } from '@ngrx/store';

import * as fromRoot from 'libs/state/state';
import * as cloneDeep from 'lodash.clonedeep';

import * as fromCommunityPollRequestReducer from './community-poll-request.reducer';
import * as fromCommunityPollResponseReducer from './community-poll-response.reducer';
import * as fromCommunityPostReducer from './community-post.reducer';
import * as fromCommunityPostReplyReducer from './community-post-reply.reducer';
import * as fromCommunityPostAddReplyViewReducer from './community-post-add-reply-view.reducer';
import * as fromCommunityTagReducer from './community-tag.reducer';

import * as CommunityPost from 'libs/models/community';
// Feature area state
export interface CommunityState {
  communityPollRequest: fromCommunityPollRequestReducer.State;
  communityPollResponse: fromCommunityPollResponseReducer.State;
  communityPost: fromCommunityPostReducer.State;
  communityPostReply: fromCommunityPostReplyReducer.State;
  communityPostAddReplyView: fromCommunityPostAddReplyViewReducer.State;
  communityTags: fromCommunityTagReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  communityPoll: CommunityState;
}

// Feature area reducers
export const reducers = {
  communityPollRequest: fromCommunityPollRequestReducer.reducer,
  communityPollResponse: fromCommunityPollResponseReducer.reducer,
  communityPost: fromCommunityPostReducer.reducer,
  communityPostReply:  fromCommunityPostReplyReducer.reducer,
  communityPostAddReplyView: fromCommunityPostAddReplyViewReducer.reducer,
  communityTags: fromCommunityTagReducer.reducer,
};

// select feature area
export const selectCommunityState = createFeatureSelector<CommunityState>('community');

// Feature selectors
export const selectFromCommunityPollRequestState = createSelector(
  selectCommunityState,
  (state: CommunityState) => state.communityPollRequest
);

export const selectFromCommunityPollResponseState  = createSelector(
  selectCommunityState,
  (state: CommunityState) => state.communityPollResponse
);

export const selectFromCommunityPostState =  createSelector(
  selectCommunityState,
  (state: CommunityState) => state.communityPost
);

export const selectFromCommunityPostReplyState =  createSelector(
  selectCommunityState,
  (state: CommunityState) => state.communityPostReply
);

export const selectFromCommunityPostAddReplyViewState =  createSelector(
  selectCommunityState,
  (state: CommunityState) => state.communityPostAddReplyView
);

export const selectFromCommunityTagState =  createSelector(
  selectCommunityState,
  (state: CommunityState) => state.communityTags
);

// Community Poll Selectors
export const getGettingCommunityPollRequests = createSelector(
  selectFromCommunityPollRequestState,
  fromCommunityPollRequestReducer.getGettingCommunityPollRequests
);

export const getCommunityPollRequests = createSelector(
  selectFromCommunityPollRequestState,
  fromCommunityPollRequestReducer.getCommunityPollRequests
);

export const getGettingCommunityPollRequestsError = createSelector(
  selectFromCommunityPollRequestState,
  fromCommunityPollRequestReducer.getGettingCommunityPollRequestsError
);

export const getSubmittingCommunityPollRequestResponses = createSelector(
  selectFromCommunityPollRequestState,
  fromCommunityPollRequestReducer.getSubmittingCommunityPollRequestResponses
);

export const getSubmittingCommunityPollRequestResponse = createSelector(
  selectFromCommunityPollRequestState,
  fromCommunityPollRequestReducer.getSubmittingCommunityPollRequestResponse
);


export const getGettingCommunityPollResponses = createSelector(
  selectFromCommunityPollResponseState,
  fromCommunityPollResponseReducer.getGettingCommunityPollResponses
);

export const getGettingCommunityPollResponsesSuccess = createSelector(
  selectFromCommunityPollResponseState,
  fromCommunityPollResponseReducer.getGettingCommunityPollResponsesSuccess
);

export const getGettingCommunityPollResponsesError = createSelector(
  selectFromCommunityPollResponseState,
  fromCommunityPollResponseReducer.getGettingCommunityPollResponsesError
);

export const getDismissingCommunityPollResponse = createSelector(
  selectFromCommunityPollResponseState,
  fromCommunityPollResponseReducer.getDismissingCommunityPollResponse
);

export const getDismissingCommunityPollResponseSuccess = createSelector(
  selectFromCommunityPollResponseState,
  fromCommunityPollResponseReducer.getDismissingCommunityPollResponseSuccess
);

export const getDismissingCommunityPollResponseError = createSelector(
  selectFromCommunityPollResponseState,
  fromCommunityPollResponseReducer.getDismissingCommunityPollResponseError
);

// Community Post Selectors
export const {
  selectAll: getCommunityPosts,
} = fromCommunityPostReducer.adapter.getSelectors(selectFromCommunityPostState);

export const getSubmittingCommunityPosts = createSelector(
  selectFromCommunityPostState,
  fromCommunityPostReducer.getSubmittingCommunityPosts
);

export const getSubmittingCommunityPostsError = createSelector(
  selectFromCommunityPostState,
  fromCommunityPostReducer.getSubmittingCommunityPostsError
);

export const getSubmittingCommunityPostsSuccess = createSelector(
  selectFromCommunityPostState,
  fromCommunityPostReducer.getSubmittingCommunityPostsSuccess
);

export const getGettingCommunityPosts = createSelector(
  selectFromCommunityPostState,
  fromCommunityPostReducer.getGettingCommunityPosts
);

export const getGettingCommunityPostsError = createSelector(
  selectFromCommunityPostState,
  fromCommunityPostReducer.getGettingCommunityPostsError
);

// Community Post Reply Selectors

export const {
  selectAll: getCommunityPostReply,
  selectEntities: getCommunityPostReplyEntities,
} = fromCommunityPostReplyReducer.adapter.getSelectors(selectFromCommunityPostReplyState);

export const getGettingCommunityPostReplies = createSelector(
  selectFromCommunityPostReplyState,
  fromCommunityPostReplyReducer.getGettingCommunityPostReplies
);

export const getGettingCommunityPostRepliesError  = createSelector(
  selectFromCommunityPostReplyState,
  fromCommunityPostReplyReducer.getGettingCommunityPostRepliesError
);

export const getAddingCommunityPostReply = createSelector(
  selectFromCommunityPostReplyState,
  fromCommunityPostReplyReducer.getAddingCommunityPostReply
);

export const getAddingCommunityPostReplyError = createSelector(
  selectFromCommunityPostReplyState,
  fromCommunityPostReplyReducer.getAddingCommunityPostReplyError
);

export const getAddingCommunityPostReplySuccess = createSelector(
  selectFromCommunityPostReplyState,
  fromCommunityPostReplyReducer.getAddingCommunityPostReplySuccess
);

// Community Post Add Reply View selector
export const getCommunityPostAddReplyView = createSelector(
  selectFromCommunityPostAddReplyViewState,
  fromCommunityPostAddReplyViewReducer.getCommunityPostAddReplyView
);

export const getFilteredCommunityPostAddReplyView = createSelector(
  getCommunityPostReplyEntities,
  getCommunityPostAddReplyView,
    (replies, addReplies) => addReplies.reduce((acc, id) => {
      return replies[ id ] ? [ ...acc, replies[ id ] ] : acc;
    }, [])
);
// Community Post With Replies
export const getCommunityPostsCombinedWithReplies = createSelector(
  getCommunityPosts,
  getCommunityPostReplyEntities,
  getCommunityPostAddReplyView,
  (posts, replies, addReplies) => {
    if (posts && replies) {
      const postlist = cloneDeep(posts);
      postlist.forEach(post => {
        if (post.ReplyIds && post.ReplyIds.length > 0) {
          const filteredReplyIds = post.ReplyIds.filter(replyId => !addReplies.includes(replyId));
          const filteredReplies = filteredReplyIds.reduce((acc, id) => {
            return replies[ id ] ? [ ...acc, replies[ id ] ] : acc;
          }, []);
          post.ReplyCount = filteredReplies.length;
          filteredReplies.forEach(filteredReply => {
              post.Replies.push(filteredReply);
          });
        }

      });
      return postlist;
    } else {
      return posts;
    }
  }
);
// Community Tag Selectors
export const getLoadingCommunityPopularTags = createSelector(
  selectFromCommunityTagState,
  fromCommunityTagReducer.getLoadingCommunityPopularTags
);

export const getLoadingCommunityPopularTagsSuccess = createSelector(
  selectFromCommunityTagState,
  fromCommunityTagReducer.getCommunityPopularTags
);

export const getLoadingCommunityPopularTagsError = createSelector(
  selectFromCommunityTagState,
  fromCommunityTagReducer.getLoadingCommunityPopularTagsError
);

export const getSuggestingCommunityTags = createSelector(
  selectFromCommunityTagState,
  fromCommunityTagReducer.getSuggestingCommunityTags
);

export const getCommunityTags = createSelector(
  selectFromCommunityTagState,
  fromCommunityTagReducer.getCommunityTags
);

export const getSuggestingCommunityTagsPostId = createSelector(
  selectFromCommunityTagState,
  fromCommunityTagReducer.getCommunityTagsPostId
);

export const getSuggestingCommunityTagsError = createSelector(
  selectFromCommunityTagState,
  fromCommunityTagReducer.getSuggestingCommunityTagsError
);
