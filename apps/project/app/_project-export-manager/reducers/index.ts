import { createFeatureSelector, createSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

// Import feature reducers
import * as fromProjectExportManagerReducer from './project-export-manager.reducer';

// Feature area state
export interface ProjectExportManagerState {
  projectExportManager: fromProjectExportManagerReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  feature_project_export_manager: ProjectExportManagerState;
}

// Feature area reducers
export const reducers = {
  projectExportManager: fromProjectExportManagerReducer.reducer
};

// Select Feature Area
export const selectProjectExportManagerFeature =
  createFeatureSelector<ProjectExportManagerState>('feature_project_export_manager');

// View Selectors
export const selectProjectExportManagerState =
  createSelector(selectProjectExportManagerFeature, (state: ProjectExportManagerState) => state.projectExportManager);

// Project Export
export const getProjectTemplatesAsync = createSelector(selectProjectExportManagerState, fromProjectExportManagerReducer.getProjectTemplatesAsync);
