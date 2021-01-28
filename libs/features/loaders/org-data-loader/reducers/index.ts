import { createFeatureSelector, createSelector } from '@ngrx/store';

import * as fromFileUploadReducer from './file-upload.reducer';

import * as fromRoot from 'libs/state/state';


// Feature area state
export interface FileUploadFeatureState {
  fileUploadPage: fromFileUploadReducer.State;
}

export interface State extends fromRoot.State {
  feature_fileupload: FileUploadFeatureState;
}

export const reducers = {
  fileUploadPage: fromFileUploadReducer.reducer
};

// Select Feature Area
export const selectFeatureAreaState = createFeatureSelector<FileUploadFeatureState>('feature_fileupload');

// Feature Selectors
export const FileUploadState = createSelector(
  selectFeatureAreaState,
  (state: FileUploadFeatureState) => state.fileUploadPage);

// File Upload

export const getGettingColumnNames = createSelector(
  FileUploadState,
  fromFileUploadReducer.GetGettingColumnNames
);

export const getColumnNames = createSelector(
  FileUploadState,
  fromFileUploadReducer.GetColumnNames
);

export const getColumnNamesError = createSelector(
  FileUploadState,
  fromFileUploadReducer.GetColumnNamesError
);
