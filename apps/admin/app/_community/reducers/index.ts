import { createSelector, createFeatureSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

// Import feature reducers
import * as fromCommunityPollReducer from './community-poll.reducer';

// Feature area state
export interface CommunityStateMain {
  communityPoll: fromCommunityPollReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  communityAdminMain: CommunityStateMain;
}

// Feature area reducers
export const reducers = {
  communityPoll: fromCommunityPollReducer.reducer
};

// Select Feature Area
export const selectCommunityAdminMainState =
  createFeatureSelector<CommunityStateMain>('communityAdminMain');

// Community Poll Selectors
export const selectCommunityPollState =
  createSelector(selectCommunityAdminMainState, (state: CommunityStateMain) => state.communityPoll);

export const {
    selectAll: getCommunityPollListItems,
} = fromCommunityPollReducer.adapter.getSelectors(selectCommunityPollState);

export const getCommunityPollListLoading = createSelector(
  selectCommunityPollState, fromCommunityPollReducer.getLoading
);

export const getCommunityPollListLoadingError = createSelector(
    selectCommunityPollState, fromCommunityPollReducer.getLoadingError
);

export const getAddingCommunityPoll = createSelector(
  selectCommunityPollState, fromCommunityPollReducer.getAddingCommunityPoll
);

export const getAddingCommunityPollSuccess = createSelector(
  selectCommunityPollState, fromCommunityPollReducer.getAddingCommunityPollSuccess
);

export const getAddingCommunityPollError = createSelector(
  selectCommunityPollState, fromCommunityPollReducer.getAddingCommunityPollError
);

export const getCommunityPollModalOpen = createSelector(
  selectCommunityPollState, fromCommunityPollReducer.getCommunityPollModalOpen
);

export const getCommunityPollListToEdit = createSelector(
  selectCommunityPollState, fromCommunityPollReducer.getCommunityPollListToEdit
);

export const getCommunityExportingCommunityPoll = createSelector(
  selectCommunityPollState, fromCommunityPollReducer.getExportingCommunityPoll
);

export const getExportingCommunityPollSuccess = createSelector(
  selectCommunityPollState, fromCommunityPollReducer.getExportingCommunityPollSuccess
);

export const getCommunityExportingPollError = createSelector(
  selectCommunityPollState, fromCommunityPollReducer.getExportingCommunityPollError
);

export const getEditingCommunityPoll = createSelector(
  selectCommunityPollState, fromCommunityPollReducer.getEditingCommunityPoll
);

export const getEditingCommunityPollSuccess = createSelector(
  selectCommunityPollState, fromCommunityPollReducer.getEditingCommunityPollSuccess
);

export const getEditingCommunityPollError = createSelector(
  selectCommunityPollState, fromCommunityPollReducer.getEditingCommunityPollError
);
