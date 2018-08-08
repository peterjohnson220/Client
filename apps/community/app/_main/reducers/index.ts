import { createSelector, createFeatureSelector } from '@ngrx/store';

import * as fromRoot from 'libs/state/state';

import * as fromCommunityPollRequestReducer from './community-poll-request.reducer';

export interface CommunityPollRequestState {
  communityPollRequest: fromCommunityPollRequestReducer.State;
}

export interface State extends fromRoot.State {
  communityPollRequest: CommunityPollRequestState;
}

export const reducers = {
  communityPollRequest: fromCommunityPollRequestReducer.reducer
};

export const selectCommunityPollRequestState = createFeatureSelector<CommunityPollRequestState>('communityPollRequest');

export const selectFromCommunityPollRequestState = createSelector(
  selectCommunityPollRequestState,
  (state: CommunityPollRequestState) => state.communityPollRequest
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
  selectFromCommunityPollRequestState,
  fromCommunityPollRequestReducer.getGettingCommunityPollResponses
);

export const getGettingCommunityPollResponsesSuccess = createSelector(
  selectFromCommunityPollRequestState,
  fromCommunityPollRequestReducer.getGettingCommunityPollResponsesSuccess
);

export const getGettingCommunityPollResponsesError = createSelector(
  selectFromCommunityPollRequestState,
  fromCommunityPollRequestReducer.getGettingCommunityPollResponsesError
);
