import { createSelector, createFeatureSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

// Import feature reducers
import * as fromUserFilterReducer from './user-filter.reducer';
import * as fromSaveFilterModalReducer from './save-filter-modal.reducer';
import * as fromUserFilterPopoverReducer from './user-filter-popover.reducer';

// Feature area state
export interface UserFilterFeatureState {
  userFilter: fromUserFilterReducer.State;
  saveFilterModal: fromSaveFilterModalReducer.State;
  savedFiltersPopover: fromUserFilterPopoverReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  feature_userfilter: UserFilterFeatureState;
}

// Feature area reducers
export const reducers = {
  userFilter: fromUserFilterReducer.reducer,
  saveFilterModal: fromSaveFilterModalReducer.reducer,
  savedFiltersPopover: fromUserFilterPopoverReducer.reducer
};

// Select Feature Area
export const selectFeatureAreaState = createFeatureSelector<UserFilterFeatureState>('feature_userfilter');

// Feature Selectors
export const selectUserFilterState = createSelector(
  selectFeatureAreaState,
  (state: UserFilterFeatureState) => state.userFilter
);

export const selectSaveFilterModalState = createSelector(
  selectFeatureAreaState,
  (state: UserFilterFeatureState) => state.saveFilterModal
);

export const selectSavedFiltersPopoverState = createSelector(
  selectFeatureAreaState,
  (state: UserFilterFeatureState) => state.savedFiltersPopover
);

// User Filter Selectors
export const getLoading = createSelector(
  selectUserFilterState,
  fromUserFilterReducer.getLoading
);

export const getLoadingError = createSelector(
  selectUserFilterState,
  fromUserFilterReducer.getLoadingError
);

export const getSavedFilters = createSelector(
  selectUserFilterState,
  fromUserFilterReducer.getSavedFilters
);

export const getUpserting = createSelector(
  selectUserFilterState,
  fromUserFilterReducer.getUpserting
);

export const getDeleting = createSelector(
  selectUserFilterState,
  fromUserFilterReducer.getDeleting
);

export const getUpsertingConflict = createSelector(
  selectUserFilterState,
  fromUserFilterReducer.getUpsertingConflict
);

export const getUpsertingError = createSelector(
  selectUserFilterState,
  fromUserFilterReducer.getUpsertingError
);

export const getSelectedSavedFilter = createSelector(
  selectUserFilterState,
  fromUserFilterReducer.getSelectedSavedFilter
);

export const getFilterIdToSelect = createSelector(
  selectUserFilterState,
  fromUserFilterReducer.getFilterIdToSelect
);

export const getDefaultFilterId = createSelector(
  selectUserFilterState,
  fromUserFilterReducer.getDefaultFilterId
);

// Save Filter Modal Selectors
export const getModalOpen = createSelector(
  selectSaveFilterModalState,
  fromSaveFilterModalReducer.getModalOpen
);

export const getModalData = createSelector(
  selectSaveFilterModalState,
  fromSaveFilterModalReducer.getModalData
);

export const getUpsertRequest = createSelector(
  selectSaveFilterModalState,
  fromSaveFilterModalReducer.getUpsertRequest
);

// Saved Filters Popover Selectors
export const getPopoverOpen = createSelector(
  selectSavedFiltersPopoverState,
  fromUserFilterPopoverReducer.getPopoverOpen
);
