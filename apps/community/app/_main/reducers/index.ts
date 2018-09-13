import { createSelector, createFeatureSelector } from '@ngrx/store';

import * as fromRoot from 'libs/state/state';

import * as fromCommunityPollRequestReducer from './community-poll-request.reducer';
import * as fromCommunityPollResponseReducer from './community-poll-response.reducer';
import * as fromCommunityPostReducer from './community-post.reducer';
import * as fromCommunityTagReducer from './community-tag.reducer';

// Feature area state
export interface CommunityState {
  communityPollRequest: fromCommunityPollRequestReducer.State;
  communityPollResponse: fromCommunityPollResponseReducer.State;
  communityPost: fromCommunityPostReducer.State;
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

export const getCommunityPosts = createSelector(
  selectFromCommunityPostState,
  fromCommunityPostReducer.getCommunityPosts
);

export const getGettingCommunityPostsError = createSelector(
  selectFromCommunityPostState,
  fromCommunityPostReducer.getGettingCommunityPostsError
);

export const getAddingCommunityPostReply = createSelector(
  selectFromCommunityPostState,
  fromCommunityPostReducer.getAddingCommunityPostReply
);
export const getAddingCommunityPostReplyError = createSelector(
  selectFromCommunityPostState,
  fromCommunityPostReducer.getAddingCommunityPostReplyError
);

export const getAddingCommunityPostReplySuccess = createSelector(
  selectFromCommunityPostState,
  fromCommunityPostReducer.getAddingCommunityPostReplySuccess
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

export const getSuggestingCommunityTagsError = createSelector(
  selectFromCommunityTagState,
  fromCommunityTagReducer.getSuggestingCommunityTagsError
);
