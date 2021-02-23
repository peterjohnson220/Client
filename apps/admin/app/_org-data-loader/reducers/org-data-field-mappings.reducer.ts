import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

import { LoaderFieldSet } from 'libs/models/data-loads';

import * as fromOrgDataFieldMappingsActions from '../actions/org-data-field-mappings.actions';

export interface State extends EntityState<LoaderFieldSet> {
  loading: boolean;
  loadingError: boolean;
  isDeleteModalOpen: boolean;
}

export const adapter: EntityAdapter<LoaderFieldSet> = createEntityAdapter<LoaderFieldSet>({
  selectId: (lfs: LoaderFieldSet) => lfs.CompanyId + '-' + lfs.LoaderType
});

const initialState: State = adapter.getInitialState({
  loading: false,
  loadingError: false,
  isDeleteModalOpen: false,
});

export function reducer(state = initialState, action: fromOrgDataFieldMappingsActions.Actions): State {
  switch (action.type) {
    case fromOrgDataFieldMappingsActions.LOADING_FIELD_MAPPINGS: {
      return {
        ...state,
        loading: true
      };
    }
    case fromOrgDataFieldMappingsActions.LOADING_FIELD_MAPPINGS_SUCCESS: {
      return {
        ...adapter.setAll(action.payload, state),
        loading: false,
        loadingError: false
      };
    }
    case fromOrgDataFieldMappingsActions.LOADING_FIELD_MAPPINGS_ERROR: {
      return {
        ...state,
        loading: false,
        loadingError: true
      };
    }
    case fromOrgDataFieldMappingsActions.DELETE_SFTP_CREDENTIALS_MODAL_OPEN: {
      return {
        ...state,
        isDeleteModalOpen: action.isOpen,
      };
    }
    default: {
      return state;
    }
  }
}

export const getLoadingFieldMappings = (state: State) => state.loading;
export const getLoadingFieldMappingsError = (state: State) => state.loadingError;
export const getIsDeleteModalOpen = (state: State) => state.isDeleteModalOpen;

