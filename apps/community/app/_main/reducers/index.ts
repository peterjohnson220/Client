import { createSelector, createFeatureSelector } from '@ngrx/store';

import * as fromRoot from 'libs/state/state';
import cloneDeep from 'lodash/cloneDeep';

import * as fromCommunityPollRequestReducer from './community-poll-request.reducer';
import * as fromCommunityPollResponseReducer from './community-poll-response.reducer';
import * as fromCommunityPostReducer from './community-post.reducer';
import * as fromCommunityPostReplyReducer from './community-post-reply.reducer';
import * as fromCommunityPostAddReplyViewReducer from './community-post-add-reply-view.reducer';
import * as fromCommunityPostFilterReplyViewReducer from './community-post-filter-reply-view.reducer';
import * as fromCommunityTagReducer from './community-tag.reducer';
import * as fromCommunityJobReducer from './community-job.reducer';
import * as fromCommunityCategoriesReducer from './community-categories.reducer';
import * as fromCommunityPostFilterOptionsReducer from './community-post-filter-options.reducer';
import * as fromCommunityLikeReducer from './community-like.reducer';
import * as fromCommunitySearchReducer from './community-search.reducer';
import * as fromCommunityIndustryReducer from './community-industry.reducer';
import * as fromCommunityCompanySizeReducer from './community-company-size.reducer';
import * as fromCommunityTopicReducer from './community-topic.reducer';
import * as fromCommunityAttachmentReducer from './community-attachment.reducer';
import * as fromCommunityAttachmentWarningReducer from './community-attachment-warning.reducer';
import { CommunityConstants } from '../models';
import { populatePostReplies } from '../helpers/model-mapping.helper';

// Feature area state
export interface CommunityState {
  communityPollRequest: fromCommunityPollRequestReducer.State;
  communityPollResponse: fromCommunityPollResponseReducer.State;
  communityPost: fromCommunityPostReducer.State;
  communityPostReply: fromCommunityPostReplyReducer.State;
  communityPostFilteredReplyView: fromCommunityPostFilterReplyViewReducer.State;
  communityPostAddReplyView: fromCommunityPostAddReplyViewReducer.State;
  communityTags: fromCommunityTagReducer.State;
  communityJob: fromCommunityJobReducer.State;
  communityCategories: fromCommunityCategoriesReducer.State;
  communityPostFilterOptions: fromCommunityPostFilterOptionsReducer.State;
  communityLikes: fromCommunityLikeReducer.State;
  communitySearch: fromCommunitySearchReducer.State;
  communityIndustries: fromCommunityIndustryReducer.State;
  communityCompanySizes: fromCommunityCompanySizeReducer.State;
  communityTopic: fromCommunityTopicReducer.State;
  communityAttachments: fromCommunityAttachmentReducer.State;
  communityAttachmentsWarning: fromCommunityAttachmentWarningReducer.State;
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
  communityPostReply: fromCommunityPostReplyReducer.reducer,
  communityPostFilteredReplyView: fromCommunityPostFilterReplyViewReducer.reducer,
  communityPostAddReplyView: fromCommunityPostAddReplyViewReducer.reducer,
  communityTags: fromCommunityTagReducer.reducer,
  communityJob: fromCommunityJobReducer.reducer,
  communityCategories: fromCommunityCategoriesReducer.reducer,
  communityPostFilterOptions: fromCommunityPostFilterOptionsReducer.reducer,
  communityLikes: fromCommunityLikeReducer.reducer,
  communitySearch: fromCommunitySearchReducer.reducer,
  communityIndustries: fromCommunityIndustryReducer.reducer,
  communityCompanySizes: fromCommunityCompanySizeReducer.reducer,
  communityTopic: fromCommunityTopicReducer.reducer,
  communityAttachments: fromCommunityAttachmentReducer.reducer,
  communityAttachmentsWarning: fromCommunityAttachmentWarningReducer.reducer
};

// select feature area
export const selectCommunityState = createFeatureSelector<CommunityState>('community');

// Feature selectors
export const selectFromCommunityPollRequestState = createSelector(
  selectCommunityState,
  (state: CommunityState) => state.communityPollRequest
);

export const selectFromCommunityPollResponseState = createSelector(
  selectCommunityState,
  (state: CommunityState) => state.communityPollResponse
);

export const selectFromCommunityPostState = createSelector(
  selectCommunityState,
  (state: CommunityState) => state.communityPost
);

export const selectFromCommunityPostReplyState = createSelector(
  selectCommunityState,
  (state: CommunityState) => state.communityPostReply
);

export const selectFromCommunityPostAddReplyViewState = createSelector(
  selectCommunityState,
  (state: CommunityState) => state.communityPostAddReplyView
);

export const selectFromCommunityPostFilterReplyViewState = createSelector(
  selectCommunityState,
  (state: CommunityState) => state.communityPostFilteredReplyView
);

export const selectFromCommunityTagState = createSelector(
  selectCommunityState,
  (state: CommunityState) => state.communityTags
);

export const selectFromCommunityJobState =  createSelector(
  selectCommunityState,
  (state: CommunityState) => state.communityJob
);

export const selectFromCommunityCategoriesState =  createSelector(
  selectCommunityState,
  (state: CommunityState) => state.communityCategories
);

export const selectFromCommunityPostFilterOptionsState =  createSelector(
  selectCommunityState,
  (state: CommunityState) => state.communityPostFilterOptions
  );

export const selectFromCommunityLikeState = createSelector(
    selectCommunityState,
    (state: CommunityState) => state.communityLikes
  );

export const selectFromCommunitySearchState = createSelector(
  selectCommunityState,
  (state: CommunityState) => state.communitySearch
);


export const selectFromCommunityIndustryState = createSelector(
  selectCommunityState,
  (state: CommunityState) => state.communityIndustries
  );

export const selectFromCommunityTopicState = createSelector(
  selectCommunityState,
  (state: CommunityState) => state.communityTopic
);

export const selectFromCommunityCompanySizeState = createSelector(
  selectCommunityState,
  (state: CommunityState) => state.communityCompanySizes
);

export const selectFromCommunityAttachmentsState = createSelector(
  selectCommunityState,
  (state: CommunityState) => state.communityAttachments
);

export const selectFromCommunityAttachmentsWarningModalState = createSelector(
  selectCommunityState,
  (state: CommunityState) => state.communityAttachmentsWarning
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

export const getGettingCommunityPollRequestsLoaded = createSelector(
  selectFromCommunityPollRequestState,
  fromCommunityPollRequestReducer.getGettingCommunityPollRequestsLoaded
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

export const getDismissedResponses = createSelector(
  selectFromCommunityPollResponseState,
  fromCommunityPollResponseReducer.getDismissedResponses
);
export const hasNonDismissedResponses = createSelector(
  getDismissedResponses,
  getGettingCommunityPollResponsesSuccess,
  (dismissedResponses, allResponses) => {
    if (dismissedResponses.length > 0) {
      const filteredResponses = allResponses.filter((response) => dismissedResponses.indexOf(response.CommunityPollId) === -1);
      return filteredResponses.length > 0;
    } else {
      return allResponses.length > 0;
    }
  }
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

export const getAddingCommunityDiscussionPoll = createSelector(
  selectFromCommunityPostState,
  fromCommunityPostReducer.getAddingCommunityDiscussionPoll
);

export const getAddingCommunityDiscussionPollSuccess = createSelector(
  selectFromCommunityPostState,
  fromCommunityPostReducer.getAddingCommunityDiscussionPollSuccess
);

export const getAddingCommunityDiscussionPollError = createSelector(
  selectFromCommunityPostState,
  fromCommunityPostReducer.getAddingCommunityDiscussionPollError
);

export const getDiscussionPagingOptions = createSelector(
  selectFromCommunityPostState,
  fromCommunityPostReducer.getDiscussionPagingOptions
);

export const getTotalDiscussionResultsOnServer = createSelector(
  selectFromCommunityPostState,
  fromCommunityPostReducer.getTotalResultsOnServer
);

export const getLoadingNextBatchPosts = createSelector(
  selectFromCommunityPostState,
  fromCommunityPostReducer.getLoadingNextBatchPosts
);

export const getLoadingPreviousBatchPosts = createSelector(
  selectFromCommunityPostState,
  fromCommunityPostReducer.getLoadingPreviousBatchPosts
);

export const getMaximumReplies = createSelector(
  selectFromCommunityPostState,
  fromCommunityPostReducer.getMaximumReplies
);

export const getLoadingCommunityPost = createSelector(
  selectFromCommunityPostState,
  fromCommunityPostReducer.getLoadingCommunityPost
);

export const getLoadingCommunityPostSuccess = createSelector(
  selectFromCommunityPostState,
  fromCommunityPostReducer.getLoadingCommunityPostSuccess
);

export const getLoadingCommunityPostError = createSelector(
  selectFromCommunityPostState,
  fromCommunityPostReducer.getLoadingCommunityPostError
);

export const getHasNextBatchPostsOnServer = createSelector(
  getTotalDiscussionResultsOnServer,
  selectFromCommunityPostState,
  (totalOnServer, pagingOptions) => {
    return totalOnServer > CommunityConstants.POSTS_PER_BATCH * pagingOptions.endIndexDisplayed;
  }
);

export const getHasPreviousBatchPostsOnServer = createSelector(
  selectFromCommunityPostState,
  (pagingOptions) => {
    return pagingOptions.startIndexDisplayed > 1;
  }
);

export const getCommunityPostDeleted = createSelector(
  selectFromCommunityPostState,
  fromCommunityPostReducer.getCommunityPostDeleted
);

export const getCommunityPostEdited = createSelector(
  selectFromCommunityPostState,
  fromCommunityPostReducer.getCommunityPostEdited
);

export const getDiscardingPost = createSelector(
  selectFromCommunityPostState,
  fromCommunityPostReducer.getDiscardingPost
);

export const getDiscardingPostProceed = createSelector(
  selectFromCommunityPostState,
  fromCommunityPostReducer.getDiscardingPostProceed
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

export const getGettingCommunityPostRepliesError = createSelector(
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

export const getCommunityReplyEdited = createSelector(
  selectFromCommunityPostReplyState,
  fromCommunityPostReplyReducer.getCommunityReplyEdited
);

export const getDiscardingPostReplyId = createSelector(
  selectFromCommunityPostReplyState,
  fromCommunityPostReplyReducer.getDiscardingPostReplyId
);

export const getDiscardingPostReply = createSelector(
  selectFromCommunityPostReplyState,
  fromCommunityPostReplyReducer.getDiscardingPostReply
);

export const getDiscardingPostReplyProceed = createSelector(
  selectFromCommunityPostReplyState,
  fromCommunityPostReplyReducer.getDiscardingPostReplyProceed
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

// Community Post Filtered Reply View selector
export const getCommunityPostFilterReplyView = createSelector(
  selectFromCommunityPostFilterReplyViewState,
  fromCommunityPostFilterReplyViewReducer.getCommunityPostFilterReplyView
);

export const getFilteredCommunityPostReplyView = createSelector(
  getCommunityPostReplyEntities,
  getCommunityPostFilterReplyView,
  (replies, filterReplies) => filterReplies.reduce((acc, id) => {
    return replies[ id ] ? [ ...acc, replies[ id ] ] : acc;
  }, [])
);

// Community Posts With Replies
export const getCommunityPostsCombinedWithReplies = createSelector(
  getCommunityPosts,
  getCommunityPostReplyEntities,
  getCommunityPostAddReplyView,
  getCommunityPostFilterReplyView,
  (posts, replies, addReplies, filterReplies) => {
    if (posts && replies) {
      const postlist = cloneDeep(posts);
      postlist.forEach(post => {
        populatePostReplies(post, addReplies, filterReplies, replies);
      });
      return postlist;
    } else {
      return posts;
    }
  }
);


// Community Post With Replies
export const getCommunityPostCombinedWithReplies = createSelector(
  getCommunityPosts,
  getCommunityPostReplyEntities,
  getCommunityPostAddReplyView,
  getLoadingCommunityPostSuccess,
  (posts,  replies, addReplies, postId) => {
    const post =  postId ? posts.find(x => x.Id === postId) : null;
    if (!post) {
      return post;
    }

    const postWithReplies = cloneDeep(post);
    populatePostReplies(postWithReplies, addReplies, [], replies);
    return postWithReplies;
  }
);

// Community Tag Selectors

export const getSuggestingCommunityTags = createSelector(
  selectFromCommunityTagState,
  fromCommunityTagReducer.getSuggestingCommunityTags
);

export const getCommunityTags = createSelector(
  selectFromCommunityTagState,
  fromCommunityTagReducer.getCommunityTags
);

export const getSuggestingCommunityTagsError = createSelector(
  selectFromCommunityTagState,
  fromCommunityTagReducer.getSuggestingCommunityTagsError
);

// Community Job Selectors
export const {
  selectAll: getCommunityJobs,
} = fromCommunityJobReducer.adapter.getSelectors(selectFromCommunityJobState);

export const getSubmittingCommunityJobs = createSelector(
  selectFromCommunityJobState,
  fromCommunityJobReducer.getSubmittingCommunityJobs
);

export const getSubmittingCommunityJobsError = createSelector(
  selectFromCommunityJobState,
  fromCommunityJobReducer.getSubmittingCommunityJobsError
);

export const getSubmittingCommunityJobsSuccess = createSelector(
  selectFromCommunityJobState,
  fromCommunityJobReducer.getSubmittingCommunityJobsSuccess
);

export const getGettingCommunityJobs = createSelector(
  selectFromCommunityJobState,
  fromCommunityJobReducer.getGettingCommunityJobs
);

export const getGettingCommunityJobsError = createSelector(
  selectFromCommunityJobState,
  fromCommunityJobReducer.getGettingCommunityJobsError
);

export const getLoadingMoreResults = createSelector(
  selectFromCommunityJobState,
  fromCommunityJobReducer.getLoadingMoreResults
);

export const getPagingOptions = createSelector(
  selectFromCommunityJobState,
  fromCommunityJobReducer.getPagingOptions
);

export const getTotalResultsOnServer = createSelector(
  selectFromCommunityJobState,
  fromCommunityJobReducer.getTotalResultsOnServer
);

export const getHasMoreResultsOnServer = createSelector(
  getCommunityJobs,
  getTotalResultsOnServer,
  (jobs, totalOnServer) => {
    return totalOnServer > jobs.length;
  }
);

// Community Categories Selectors

export const {
  selectAll: getCommunityCategories,
} = fromCommunityCategoriesReducer.adapter.getSelectors(selectFromCommunityCategoriesState);

export const getGettingCommunityCategories = createSelector(
  selectFromCommunityCategoriesState,
  fromCommunityCategoriesReducer.getGettingCommunityCategories
);

export const getGettingCommunityCategoriesError = createSelector(
  selectFromCommunityCategoriesState,
  fromCommunityCategoriesReducer.getGettingCommunityCategoriesError
);

export const getCommunityPostFilterOptions = createSelector(
  selectFromCommunityPostFilterOptionsState,
  fromCommunityPostFilterOptionsReducer.getCommunityPostFilterOptions
);

export const getFilteredByPost = createSelector(
  selectFromCommunityPostFilterOptionsState,
  fromCommunityPostFilterOptionsReducer.getFilteredByPost
);

export const getDeletingCommunityTopicSuccess = createSelector(
  selectFromCommunityPostFilterOptionsState,
  fromCommunityPostFilterOptionsReducer.getDeletingCommunityTopicSuccess
);

export const getDeletingCommunityIndustrySuccess = createSelector(
  selectFromCommunityPostFilterOptionsState,
  fromCommunityPostFilterOptionsReducer.getDeletingCommunityIndustrySuccess
);

export const getDeletingCommunityCompanySizeSuccess = createSelector(
  selectFromCommunityPostFilterOptionsState,
  fromCommunityPostFilterOptionsReducer.getDeletingCommunityCompanySizeSuccess
);

// Community Like Selectors
export const getLoadingCommunityLikes = createSelector(
  selectFromCommunityLikeState,
  fromCommunityLikeReducer.getLoadingCommunityLikes
);

export const getLoadingCommunityLikesSuccess = createSelector(
  selectFromCommunityLikeState,
  fromCommunityLikeReducer.getLoadingCommunityLikesSuccess
);

export const getLoadingCommunityLikesError = createSelector(
  selectFromCommunityLikeState,
  fromCommunityLikeReducer.getLoadingCommunityLikesError
);

export const getFilterTitle = createSelector(
  getFilteredByPost,
  getCommunityPostsCombinedWithReplies,
  (filteredByPost, postsWithReplies) => {
    if (filteredByPost && postsWithReplies.length === 1) {
      const discussionType = postsWithReplies[0].UserPollRequest == null ? 'post' : 'poll';

      return `${postsWithReplies[0].UserInfo.UserFirstName} ${postsWithReplies[0].UserInfo.UserLastName}'s ${discussionType} `;
    }
  }
);

// Community Search Selectors
export const {
  selectAll: getCommunitySearchResults,
} = fromCommunitySearchReducer.adapter.getSelectors(selectFromCommunitySearchState);

export const getLoadingSearchResults = createSelector(
  selectFromCommunitySearchState,
  fromCommunitySearchReducer.getLoadingSearchResults
);

export const getLoadingSearchResultsError = createSelector(
  selectFromCommunitySearchState,
  fromCommunitySearchReducer.getLoadingSearchResultsError
);

export const getCommunityLoadingMoreSearchResults = createSelector(
  selectFromCommunitySearchState,
  fromCommunitySearchReducer.getLoadingMoreSearchResults
);

export const getSearchResultsPagingOptions = createSelector(
  selectFromCommunitySearchState,
  fromCommunitySearchReducer.getSearchResultsPagingOptions
);

export const getCommunitySearchResultModal = createSelector(
  selectFromCommunitySearchState,
  fromCommunitySearchReducer.getSearchResultModalPostId
);

export const getTotalSearchResultsOnServer = createSelector(
  selectFromCommunitySearchState,
  fromCommunitySearchReducer.getTotalSearchResultsOnServer
);

export const getHasMoreSearchResultsOnServer = createSelector(
  getCommunitySearchResults,
  getTotalSearchResultsOnServer,
  (results, totalResults) => {
    return totalResults > results.length;
  }
);

// Community Industry Selectors
export const getLoadingCommunityIndustries = createSelector(
  selectFromCommunityIndustryState,
  fromCommunityIndustryReducer.getLoadingCommunityIndustries
);

export const getCommunityIndustries = createSelector(
  selectFromCommunityIndustryState,
  fromCommunityIndustryReducer.getCommunityIndustries
);

export const getLoadingCommunityIndustriesError = createSelector(
  selectFromCommunityIndustryState,
  fromCommunityIndustryReducer.getLoadingCommunityIndustriesError
);

// Community Company Size Selectors
export const getLoadingCommunityCompanySizes = createSelector(
  selectFromCommunityCompanySizeState,
  fromCommunityCompanySizeReducer.getLoadingCommunityCompanySizes
);

export const getCommunityCompanySizes = createSelector(
  selectFromCommunityCompanySizeState,
  fromCommunityCompanySizeReducer.getCommunityCompanySizes
);

export const getLoadingCommunityCompanySizesError = createSelector(
  selectFromCommunityCompanySizeState,
  fromCommunityCompanySizeReducer.getLoadingCommunityCompanySizesError
);

// Community Topic Selectors
export const getLoadingTopics = createSelector(
  selectFromCommunityTopicState,
  fromCommunityTopicReducer.getLoadingCommunityTopics
);

export const getLoadingTopicsError = createSelector(
  selectFromCommunityTopicState,
  fromCommunityTopicReducer.getLoadingCommunityTopicsError
);

export const getTopics = createSelector(
  selectFromCommunityTopicState,
  fromCommunityTopicReducer.getCommunityTopics
);

// Community Attachment Selectors
export const getCurrentAttachmentModalState = createSelector(
  selectFromCommunityAttachmentsState,
  fromCommunityAttachmentReducer.getCurrentAttachmentModalState
);

export const getCurrentAttachmentModalOpen = createSelector(
  selectFromCommunityAttachmentsState,
  fromCommunityAttachmentReducer.getCurrentAttachmentModalOpen
);

// Community Attachment Warning Modal Selectors
export const getCurrentAttachmentWarningModalState = createSelector(
  selectFromCommunityAttachmentsWarningModalState,
  fromCommunityAttachmentWarningReducer.getCurrentAttachmentWarningModalOpen
);

export const getCurrentAttachmentDownloadUrl = createSelector(
  selectFromCommunityAttachmentsWarningModalState,
  fromCommunityAttachmentWarningReducer.getCurrentAttachmentDownloadUrl
);
