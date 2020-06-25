import {createEntityAdapter, EntityAdapter, EntityState} from '@ngrx/entity';
import * as fromOrgDataFieldMappingsActions from '../actions/organizational-data-field-mapping.actions';
import { LoaderFieldSet } from 'libs/models/data-loads';

export interface State extends EntityState<LoaderFieldSet> {
  loading: boolean;
  loadingError: boolean;
  savingFieldMappings: boolean;
  savingFieldMappingsError: boolean;
  savingFieldMappingsSuccess: boolean;
}

export const adapter: EntityAdapter<LoaderFieldSet> = createEntityAdapter<LoaderFieldSet>({
  selectId: (lfs: LoaderFieldSet) => lfs.CompanyId + '-' + lfs.LoaderType
});

const initialState: State = adapter.getInitialState({
  loading: false,
  loadingError: false,
  savingFieldMappings: false,
  savingFieldMappingsError: false,
  savingFieldMappingsSuccess: false
});

export function reducer( state = initialState, action: fromOrgDataFieldMappingsActions.Actions): State {
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
    case fromOrgDataFieldMappingsActions.SAVING_FIELD_MAPPINGS: {
      return {
        ...state,
        savingFieldMappings: true,
        savingFieldMappingsSuccess: false,
        savingFieldMappingsError: false
      };
    }
    case fromOrgDataFieldMappingsActions.SAVING_FIELD_MAPPINGS_ERROR: {
      return {
        ...state,
        savingFieldMappings: false,
        savingFieldMappingsError: true,
        savingFieldMappingsSuccess: false
      };
    }
    case fromOrgDataFieldMappingsActions.SAVING_FIELD_MAPPINGS_SUCCESS: {
      return {
        ...state,
        savingFieldMappings: false,
        savingFieldMappingsSuccess: true,
        savingFieldMappingsError: false
      };
    }
    default: {
      return state;
    }
  }
}

export const getLoadingFieldMappings = (state: State) => state.loading;
export const getLoadingFieldMappingsError = (state: State) => state.loadingError;
export const getSavingFieldMappings = (state: State) => state.savingFieldMappings;
export const getSavingFieldMappingsError = (state: State) => state.savingFieldMappingsError;
export const getSavingFieldMappingsSuccess = (state: State) => state.savingFieldMappingsSuccess;
