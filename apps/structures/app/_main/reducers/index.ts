import { createSelector, createFeatureSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

// Import feature reducers
import * as fromStructuresReducer from './structures.reducer';
import * as fromJobRangeModelingReducer from './job-range-modeling-page.reducer';
import * as fromJobBasedRangeAllStructuresReducer from './job-based-range-all-structures.reducer';
import * as fromJobRangeModelingGridReducer from './job-range-modeling-grid.reducer';
import * as fromJobBasedRangesAddJobsModalPageReducer from './job-based-ranges-add-jobs-modal-page.reducer';
import * as fromJobBasedRangesSearchResultsReducer from './job-based-ranges-search-results.reducer';
import * as fromJobRangeModelingModalReducer from './job-range-modeling-modal.reducer';
import * as fromModelingSettingsPageReducer from './modeling-settings-page.reducer';

// Feature area state
export interface StructuresMainState {
  structuresPage: fromStructuresReducer.State;
  jobRangeModelingPage: fromJobRangeModelingReducer.State;
  jobBasedRangeAllStructuresComponent: fromJobBasedRangeAllStructuresReducer.State;
  jobRangeModelingGrid: fromJobRangeModelingGridReducer.State;
  jobsBasedRangesAddJobsModalPage: fromJobBasedRangesAddJobsModalPageReducer.State;
  jobBasedRangesSearchResults: fromJobBasedRangesSearchResultsReducer.State;
  jobRangeModelingModal: fromJobRangeModelingModalReducer.State;
  modelingSettingsPage: fromModelingSettingsPageReducer.State;
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
  jobsBasedRangesAddJobsModalPage: fromJobBasedRangesAddJobsModalPageReducer.reducer,
  jobBasedRangesSearchResults: fromJobBasedRangesSearchResultsReducer.reducer,
  jobRangeModelingModal: fromJobRangeModelingModalReducer.reducer,
  modelingSettingsPage: fromModelingSettingsPageReducer.reducer
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

export const selectJobsBasedRangesAddJobsModalPageState = createSelector(
  selectFeatureAreaState,
  (state: StructuresMainState) => state.jobsBasedRangesAddJobsModalPage
);

export const selectJobBasedRangesSearchResultsState = createSelector(
  selectFeatureAreaState,
  (state: StructuresMainState) => state.jobBasedRangesSearchResults
);

export const selectJobRangeModelingModalState = createSelector(
  selectFeatureAreaState,
  (state: StructuresMainState) => state.jobRangeModelingModal
);

export const selectModelingSettingsState = createSelector(
  selectFeatureAreaState,
  (state: StructuresMainState) => state.modelingSettingsPage
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

// Add Jobs Structures Modeling Modal Page
export const getAddJobsModalPageOpen = createSelector(
  selectJobsBasedRangesAddJobsModalPageState,
  fromJobBasedRangesAddJobsModalPageReducer.getAddJobsModalPageOpen
);

export const getContext = createSelector(
  selectJobsBasedRangesAddJobsModalPageState,
  fromJobBasedRangesAddJobsModalPageReducer.getContext
);

export const getAddingData = createSelector(
  selectJobsBasedRangesAddJobsModalPageState,
  fromJobBasedRangesAddJobsModalPageReducer.getAddingData
);

export const getAddingDataError = createSelector(
  selectJobsBasedRangesAddJobsModalPageState,
  fromJobBasedRangesAddJobsModalPageReducer.getAddingDataError
);

export const getAddingDataErrorMessage = createSelector(
  selectJobsBasedRangesAddJobsModalPageState,
  fromJobBasedRangesAddJobsModalPageReducer.getAddingDataErrorMessage
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

// Job Range Modeling Modal
export const getModalOpen = createSelector(
  selectJobRangeModelingModalState,
  fromJobRangeModelingModalReducer.getModalOpen
);

export const getModalTitle = createSelector(
  selectJobRangeModelingModalState,
  fromJobRangeModelingModalReducer.getModalTitle
);

export const getCurrentModalPage = createSelector(
  selectJobRangeModelingModalState,
  fromJobRangeModelingModalReducer.getCurrentModalPage
);


// Modeling Settings Page
export const getCurrenciesAsync = createSelector(
  selectModelingSettingsState,
  fromModelingSettingsPageReducer.getCurrenciesAsync
);

export const getStandardPayElementsAsync = createSelector(
  selectModelingSettingsState,
  fromModelingSettingsPageReducer.getStandardPayElementsAsync
);

export const getPercentilesAsync = createSelector(
  selectModelingSettingsState,
  fromModelingSettingsPageReducer.getPercentilesAsync
);

export const getCreateModelAsync = createSelector(
  selectModelingSettingsState,
  fromModelingSettingsPageReducer.getCreateModelAsync
);

