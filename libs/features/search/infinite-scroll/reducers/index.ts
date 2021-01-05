import { createFeatureSelector, createSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

// Import feature reducers
import * as infiniteScrollReducer from './infinite-scroll.reducer';

// Feature area state
export interface LibsInfiniteScrollState {
  scrolls: infiniteScrollReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  feature_infiniteScrolls: LibsInfiniteScrollState;
}

// Feature area reducers
export const reducers = {
  scrolls: infiniteScrollReducer.reducer
};

// Select Feature Area
export const selectFeatureState = createFeatureSelector<LibsInfiniteScrollState>('feature_infiniteScrolls');

// View Selectors
export const selectInfiniteScrollsState = createSelector(selectFeatureState, (state: LibsInfiniteScrollState) => state.scrolls);

// Constants
export const DEFAULT_PAGING_OPTIONS = infiniteScrollReducer.DEFAULT_PAGING_OPTIONS;

// Scroll state selectors
export const getState = createSelector(selectInfiniteScrollsState, infiniteScrollReducer.getState);
export const getScroll = createSelector(selectInfiniteScrollsState, infiniteScrollReducer.getScroll);
export const getLoading = createSelector(selectInfiniteScrollsState, infiniteScrollReducer.getLoading);
export const getLoadingMore = createSelector(selectInfiniteScrollsState, infiniteScrollReducer.getLoadingMore);
export const getPagingOptions = createSelector(selectInfiniteScrollsState, infiniteScrollReducer.getPagingOptions);
export const getHasAllResults = createSelector(selectInfiniteScrollsState, infiniteScrollReducer.getHasAllResults);
export const getError = createSelector(selectInfiniteScrollsState, infiniteScrollReducer.getError);
