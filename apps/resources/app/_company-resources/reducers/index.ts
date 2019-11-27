import { createSelector, createFeatureSelector } from '@ngrx/store';
// Import root app reducer
import * as fromRoot from 'libs/state/state';
// Import feature reducers
import * as fromCompanyResourcesReducer from './company-resources.reducer';
import * as fromCompanyResourcesFolderReducer from './company-resources-folder.reducer';
import * as fromCompanyResourcesOrphanReducer from './company-resources-orphan.reducer';
// Feature area state
export interface ResourcesMainState {
  companyResources: fromCompanyResourcesReducer.State;
  folderResources: fromCompanyResourcesFolderReducer.State;
  orphanResources: fromCompanyResourcesOrphanReducer.State;
}
// Extend root state with feature area state
export interface State extends fromRoot.State {
  resourcesMain: ResourcesMainState;
}
// Feature area reducers
export const reducers = {
  companyResources: fromCompanyResourcesReducer.reducer,
  folderResources: fromCompanyResourcesFolderReducer.reducer,
  orphanResources: fromCompanyResourcesOrphanReducer.reducer
};

// Select Feature Area
export const selectResourcesMainState = createFeatureSelector<ResourcesMainState>('resourcesMain');

// Feature Selectors
export const selectCompanyResourcesState = createSelector(selectResourcesMainState, (state: ResourcesMainState) => state.companyResources);
export const selectCompanyResourcesFolderState = createSelector(selectResourcesMainState, (state: ResourcesMainState) => state.folderResources);
export const selectCompanyResourcesOrphanState = createSelector(selectResourcesMainState, (state: ResourcesMainState) => state.orphanResources);

// company resources
export const getCompanyResourcesLoading = createSelector(selectCompanyResourcesState, fromCompanyResourcesReducer.getCompanyResourcesLoading);
export const getCompanyResourcesLoadingError = createSelector(selectCompanyResourcesState, fromCompanyResourcesReducer.getCompanyResourcesLoadingError);
export const getCompanyResourceToAdd = createSelector(selectCompanyResourcesState, fromCompanyResourcesReducer.getCompanyResourceToAdd);
export const getCompanyResourceId = createSelector(selectCompanyResourcesState, fromCompanyResourcesReducer.getCompanyResourceId);
export const getAddingCompanyResource = createSelector(selectCompanyResourcesState, fromCompanyResourcesReducer.getAddingCompanyResource);
export const getAddingCompanyResourceSuccess = createSelector(selectCompanyResourcesState, fromCompanyResourcesReducer.getAddingCompanyResourceSuccess);
export const getDeletingCompanyResourceSuccess = createSelector(selectCompanyResourcesState, fromCompanyResourcesReducer.getDeletingCompanyResourceSuccess);

// company folder resources
export const { selectAll: getCompanyFolderResources } = fromCompanyResourcesFolderReducer.adapter.getSelectors(selectCompanyResourcesFolderState);
export const getFolderResources = createSelector(selectCompanyResourcesFolderState, fromCompanyResourcesFolderReducer.getFolderResources);
export const getCompanyResourceFolder = createSelector(selectCompanyResourcesFolderState, fromCompanyResourcesFolderReducer.getCompanyResourceFolder);
export const getAddingFolderToCompanyResources = createSelector(selectCompanyResourcesFolderState,
  fromCompanyResourcesFolderReducer.getAddingFolderToCompanyResources);
export const getAddingFolderToCompanyResourcesSuccess = createSelector(selectCompanyResourcesFolderState,
  fromCompanyResourcesFolderReducer.getAddingFolderToCompanyResourcesSuccess);
export const getAddingFolderToCompanyResourcesError = createSelector(selectCompanyResourcesFolderState,
  fromCompanyResourcesFolderReducer.getAddingFolderToCompanyResourcesError);
export const getDeletingFolderFromCompanyResources = createSelector(selectCompanyResourcesFolderState,
  fromCompanyResourcesFolderReducer.getDeletingFolderFromCompanyResources);
export const getDeletingFolderFromCompanyResourcesSuccess = createSelector(selectCompanyResourcesFolderState,
fromCompanyResourcesFolderReducer.getDeletingFolderFromCompanyResourcesSuccess);

// company orphan resources
export const { selectAll: getCompanyOrphanResources } = fromCompanyResourcesOrphanReducer.adapter.getSelectors(selectCompanyResourcesOrphanState);
export const getOrphanedResources = createSelector(selectCompanyResourcesOrphanState, fromCompanyResourcesOrphanReducer.getOrphanedResources);
