import { createSelector, createFeatureSelector } from '@ngrx/store';

import * as fromRoot from 'libs/state/state';

import * as fromCommunityPollRequestReducer from './community-poll-request.reducer';
import * as fromCommunityPollResponseReducer from './community-poll-response.reducer';

// Feature area state
export interface CommunityPollState {
  communityPollRequest: fromCommunityPollRequestReducer.State;
  communityPollResponse: fromCommunityPollResponseReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  communityPoll: CommunityPollState;
}

// Feature area reducers
export const reducers = {
  communityPollRequest: fromCommunityPollRequestReducer.reducer,
  communityPollResponse: fromCommunityPollResponseReducer.reducer
};

// Select Feature Area
export const selectCommunityPollState = createFeatureSelector<CommunityPollState>('communityPoll');

// Feature Selectors
export const selectFromCommunityPollRequestState = createSelector(
  selectCommunityPollState,
  (state: CommunityPollState) => state.communityPollRequest
);

export const selectFromCommunityPollResponseState = createSelector(
  selectCommunityPollState,
  (state: CommunityPollState) => state.communityPollResponse
);

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
