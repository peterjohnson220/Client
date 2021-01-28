import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createSelector, createFeatureSelector } from '@ngrx/store';

import { FileModel } from '../../../../models/file';
import * as fileDownloadActions from '../actions/file-download.actions';

export interface State extends EntityState<FileModel> {}

// Create entity adapter
export const adapter: EntityAdapter<FileModel> = createEntityAdapter<FileModel>({
  selectId: (file: FileModel) => file.fileId,
});

export const initialState: State = adapter.getInitialState();

export function reducer(
  state = initialState,
  action: fileDownloadActions.FileDownloadActions
): State {
  let newState: State;
  switch (action.type) {
    case fileDownloadActions.FILE_DOWNLOAD_ERROR:
    case fileDownloadActions.FILE_DOWNLOAD_PROGRESS:
    case fileDownloadActions.FILE_DOWNLOAD_START:
    case fileDownloadActions.FILE_DOWNLOAD_SUCCESS: {
      newState = {
        ...adapter.upsertOne(action.payload, state),
      };
      break;
    }
    case fileDownloadActions.FILE_DOWNLOAD_REMOVE: {
      newState = {
        ...adapter.removeOne(action.payload.fileId, state),
      };
      break;
    }
    default: {
      newState = state;
    }
  }
  return newState;
}

// Select Feature Area
export const selectFeatureAreaState = createFeatureSelector<State>('feature_fileDownload');

// get the selectors
const {
  selectAll,
  selectEntities,
  selectIds,
} = adapter.getSelectors(selectFeatureAreaState);

export const selectAllFiles = selectAll;
export const selectFileIds = selectIds;
export const selectFileEntities = selectEntities;
export const selectFileById = createSelector(
  selectFileEntities,
  (files, id: string) => files[id],
);
export const selectFilesByIds = createSelector(
  selectEntities,
  (files, ids: string[]) => ids.map(id => files[id]).filter(file => !!file),
);
