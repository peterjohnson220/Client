import { createSelector, createFeatureSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

// Import feature reducers
import * as fromStructuresReducer from './structures.reducer';
import * as fromJobRangeModelingReducer from './job-range-modeling-page.reducer';
import * as fromJobBasedRangeAllStructuresReducer from './job-based-range-all-structures.reducer';
import * as fromJobRangeModelingGridReducer from './job-range-modeling-grid.reducer';
import * as fromJobBasedRangesAddJobsModalReducer from './job-based-ranges-add-jobs-modal.reducer';
import * as fromJobBasedRangesSearchResultsReducer from './job-based-ranges-search-results.reducer';

// Feature area state
export interface StructuresMainState {
  structuresPage: fromStructuresReducer.State;
  jobRangeModelingPage: fromJobRangeModelingReducer.State;
  jobBasedRangeAllStructuresComponent: fromJobBasedRangeAllStructuresReducer.State;
  jobRangeModelingGrid: fromJobRangeModelingGridReducer.State;
  jobsBasedRangesAddJobsModal: fromJobBasedRangesAddJobsModalReducer.State;
  jobBasedRangesSearchResults: fromJobBasedRangesSearchResultsReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  structures_main: StructuresMainState;
}

// Feature area reducers
export const reducers = {
  structuresPage: fromStructuresReducer.reducer,
  jobRangeModelingPage: fromJobRangeModelingReducer.reducer,
  jobBasedRangeAllStructuresComponent: fromJobBasedRangeAllStructuresReducer.reducer,
  jobRangeModelingGrid: fromJobRangeModelingGridReducer.reducer,
  jobsBasedRangesAddJobsModal: fromJobBasedRangesAddJobsModalReducer.reducer,
  jobBasedRangesSearchResults: fromJobBasedRangesSearchResultsReducer.reducer
};

// Select Feature Area
export const selectFeatureAreaState = createFeatureSelector<StructuresMainState>('structures_main');

// Feature Selectors
export const selectStructuresPageState = createSelector(
  selectFeatureAreaState,
  (state: StructuresMainState) => state.structuresPage
);

export const selectJobRangeModelingPageState = createSelector(
  selectFeatureAreaState,
  (state: StructuresMainState) => state.jobRangeModelingPage
);

export const selectJobBasedRangeAllStructuresComponentState = createSelector(
  selectFeatureAreaState,
  (state: StructuresMainState) => state.jobBasedRangeAllStructuresComponent
);

export const selectJobsBasedRangesAddJobsModalState = createSelector(
  selectFeatureAreaState,
  (state: StructuresMainState) => state.jobsBasedRangesAddJobsModal
);

export const selectJobBasedRangesSearchResultsState = createSelector(
  selectFeatureAreaState,
  (state: StructuresMainState) => state.jobBasedRangesSearchResults
);

// Structures Page
export const getCompanyStructuresAsync = createSelector(
  selectStructuresPageState,
  fromStructuresReducer.getCompanyStructuresAsync
);

export const selectJobRangeModelingGridState = createSelector(
  selectFeatureAreaState,
  (state: StructuresMainState) => state.jobRangeModelingGrid
);

// Job Range Modeling Page
export const getCurrentModel = createSelector(
  selectJobRangeModelingPageState,
  fromJobRangeModelingReducer.getCurrentModel
);

export const getCurrentStructure = createSelector(
  selectJobRangeModelingPageState,
  fromJobRangeModelingReducer.getCurrentStructure
);

export const getIsEditModelNameLoading = createSelector(
  selectJobRangeModelingPageState,
  fromJobRangeModelingReducer.getIsEditModelNameLoading
);

export const getEditModelNameError = createSelector(
  selectJobRangeModelingPageState,
  fromJobRangeModelingReducer.getEditModelNameError
);

// Job Based Range All Structures Component
export const getCompanyStructureViewsAsync = createSelector(
  selectJobBasedRangeAllStructuresComponentState,
  fromJobBasedRangeAllStructuresReducer.getCompanyStructureViewsAsync
);

export const getFilteredCompanyStructureViews = createSelector(
  selectJobBasedRangeAllStructuresComponentState,
  fromJobBasedRangeAllStructuresReducer.getFilteredCompanyStructureViews
);

export const getFilteredCompanyStructureFavorites = createSelector(
  selectJobBasedRangeAllStructuresComponentState,
  fromJobBasedRangeAllStructuresReducer.getFilteredCompanyStructureFavorites
);

export const getCompanyStructureAddFavoriteError = createSelector(
  selectJobBasedRangeAllStructuresComponentState,
  fromJobBasedRangeAllStructuresReducer.getCompanyStructureAddFavoriteError
);

export const getCompanyStructureRemoveFavoriteError = createSelector(
  selectJobBasedRangeAllStructuresComponentState,
  fromJobBasedRangeAllStructuresReducer.getCompanyStructureRemoveFavoriteError
);

// Job Range Modeling Grid
export const getGridDataResultAsync = createSelector(
  selectJobRangeModelingGridState,
  fromJobRangeModelingGridReducer.getGridDataResultAsync
);

export const getListAreaColumnsAsync = createSelector(
  selectJobRangeModelingGridState,
  fromJobRangeModelingGridReducer.getListAreaColumnsAsync
);

export const getListAreaColumnsLoading = createSelector(
  selectJobRangeModelingGridState,
  fromJobRangeModelingGridReducer.getListAreaColumnsLoading
);

export const getListAreaColumnsReordering = createSelector(
  selectJobRangeModelingGridState,
  fromJobRangeModelingGridReducer.getListAreaColumnsReordering
);

export const getListAreaColumnsSavingAsync = createSelector(
  selectJobRangeModelingGridState,
  fromJobRangeModelingGridReducer.getListAreaColumnsSavingAsync
);

export const getListAreaColumnsVisible = createSelector(
  selectJobRangeModelingGridState,
  fromJobRangeModelingGridReducer.getListAreaColumnsVisible
);

// Add Jobs Structures Modeling Modal
export const getAddJobsModalOpen = createSelector(
  selectJobsBasedRangesAddJobsModalState,
  fromJobBasedRangesAddJobsModalReducer.getAddJobsModalOpen
);

export const getContext = createSelector(
  selectJobsBasedRangesAddJobsModalState,
  fromJobBasedRangesAddJobsModalReducer.getContext
);

export const getAddingData = createSelector(
  selectJobsBasedRangesAddJobsModalState,
  fromJobBasedRangesAddJobsModalReducer.getAddingData
);

export const getAddingDataError = createSelector(
  selectJobsBasedRangesAddJobsModalState,
  fromJobBasedRangesAddJobsModalReducer.getAddingDataError
);

export const getAddingDataErrorMessage = createSelector(
  selectJobsBasedRangesAddJobsModalState,
  fromJobBasedRangesAddJobsModalReducer.getAddingDataErrorMessage
);

// Search Results Selectors
export const getJobs = createSelector(
  selectJobBasedRangesSearchResultsState,
  fromJobBasedRangesSearchResultsReducer.getJobs
);

export const getSelectedJobIds = createSelector(
  selectJobBasedRangesSearchResultsState,
  fromJobBasedRangesSearchResultsReducer.getSelectedJobIds
);

export const getSelectedPayfactorsJobCodes = createSelector(
  selectJobBasedRangesSearchResultsState,
  fromJobBasedRangesSearchResultsReducer.getSelectedPayfactorsJobCodes
);
