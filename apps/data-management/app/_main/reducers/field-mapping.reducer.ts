import * as fromFieldMappingActions from '../actions/field-mapping.actions';
import { EntityField } from '../models/entity-field.model';
import * as cloneDeep from 'lodash.clonedeep';

export interface State {
  loading: boolean;
  loadingError: boolean;
  selectedEntities: string[];
  providerFields: EntityField;
  payfactorsFields: EntityField;
}

const initialState: State = {
  loading: true,
  loadingError: false,
  selectedEntities: null,
  providerFields: new EntityField(),
  payfactorsFields: new EntityField(),
};

export function reducer(state: State = initialState, action: fromFieldMappingActions.Actions) {
  switch (action.type) {
    case fromFieldMappingActions.INIT_FIELD_MAPPING_CARD_ERROR:
      return {
        ...state,
        loading: false,
        loadingError: true
      };
    case fromFieldMappingActions.INIT_FIELD_MAPPING_CARD:
      return {
        ...state,
        loading: true,
        selectedEntities: action.payload.entities,
      };
    case fromFieldMappingActions.LOAD_PAYFACTORS_FIELDS_BY_ENTITY:
        return {
          ...state,
          loading: true,
          loadingError: false,
        };
    case fromFieldMappingActions.LOAD_PAYFACTORS_FIELDS_BY_ENTITY_SUCCESS:
      const pff = cloneDeep(state.providerFields);
      pff[action.payload.entity] = action.payload.payfactorsEntityFields;
      return {
        ...state,
        loading: false,
        loadingError: false,
        payfactorsFields: pff
      };
    case fromFieldMappingActions.LOAD_PAYFACTORS_FIELDS_BY_ENTITY_ERROR:
      return {
        ...state,
        loading: false,
        loadingError: true,
      };
    case fromFieldMappingActions.LOAD_PROVIDER_FIELDS_BY_ENTITY:
        return {
          ...state,
          loading: true,
          loadingError: false,
        };
    case fromFieldMappingActions.LOAD_PROVIDER_FIELDS_BY_ENTITY_SUCCESS:
      const pf = cloneDeep(state.providerFields);
      pf[action.payload.entity] = action.payload.providerEntityFields;
      return {
        ...state,
        loading: false,
        loadingError: false,
        providerFields: pf
      };
    case fromFieldMappingActions.LOAD_PROVIDER_FIELDS_BY_ENTITY_ERROR:
      return {
        ...state,
        loading: false,
        loadingError: true,
      };
    default:
      return state;
  }
}

export const getFieldMappingCardLoading = (state: State) => state.loading;
export const getFieldMappingCardLoadingError = (state: State) => state.loadingError;
export const getSelectedEntities = (state: State) => state.selectedEntities;
export const getProviderFields = (state: State) => state.providerFields;
export const getPayfactorsFields = (state: State) => state.payfactorsFields;
