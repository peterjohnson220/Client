import * as cloneDeep from 'lodash.clonedeep';

import { EntityMappingHelper } from '../helpers';
import * as fromFieldMappingActions from '../actions/field-mapping.actions';
import { EntityField } from '../models/entity-field.model';

export interface State {
  loading: boolean;
  loadingError: boolean;
  selectedEntities: string[];
  providerFields: EntityField;
  payfactorsFields: EntityField;
  saving: boolean;
  savingError: false;
}

const initialState: State = {
  loading: true,
  loadingError: false,
  selectedEntities: null,
  providerFields: new EntityField(),
  payfactorsFields: new EntityField(),
  saving: false,
  savingError: false
};

export function reducer(state: State = initialState, action: fromFieldMappingActions.Actions) {
  switch (action.type) {
    case fromFieldMappingActions.INIT_FIELD_MAPPING_CARD_ERROR: {
      return {
        ...state,
        loading: false,
        loadingError: true
      };
    }
    case fromFieldMappingActions.INIT_FIELD_MAPPING_CARD: {
      return {
        ...state,
        loading: true,
        selectedEntities: action.payload.entities,
      };
    }
    case fromFieldMappingActions.LOAD_PAYFACTORS_FIELDS_BY_ENTITY: {
      return {
        ...state,
        loading: true,
        loadingError: false,
      };
    }
    case fromFieldMappingActions.LOAD_PAYFACTORS_FIELDS_BY_ENTITY_SUCCESS: {
      const pff = cloneDeep(state.payfactorsFields);
      pff[action.payload.entity] = action.payload.payfactorsEntityFields;
      return {
        ...state,
        loading: false,
        loadingError: false,
        payfactorsFields: pff
      };
    }
    case fromFieldMappingActions.LOAD_PAYFACTORS_FIELDS_BY_ENTITY_ERROR: {
      return {
        ...state,
        loading: false,
        loadingError: true,
      };
    }
    case fromFieldMappingActions.LOAD_PROVIDER_FIELDS_BY_ENTITY: {
      return {
        ...state,
        loading: true,
        loadingError: false,
      };
    }
    case fromFieldMappingActions.LOAD_PROVIDER_FIELDS_BY_ENTITY_SUCCESS: {
      const pf = cloneDeep(state.providerFields);
      pf[action.payload.entity] = action.payload.providerEntityFields;
      return {
        ...state,
        loading: false,
        loadingError: false,
        providerFields: pf
      };
    }
    case fromFieldMappingActions.LOAD_PROVIDER_FIELDS_BY_ENTITY_ERROR: {
      return {
        ...state,
        loading: false,
        loadingError: true,
      };
    }
    case fromFieldMappingActions.ADD_ASSOCIATED_ENTITY: {
      const updatedPayfactorsFields: EntityField =
        EntityMappingHelper.addAssociationToPayfactorsEntity(
          action.payload.entityType,
          action.payload.payfactorsEntityId,
          action.payload.entity,
          cloneDeep(state.payfactorsFields));

      const updatedProviderFields: EntityField =
        EntityMappingHelper.addAssocaitionToProviderEntity(
          action.payload.entityType,
          action.payload.entity,
          cloneDeep(state.providerFields));

      return {
        ...state,
        payfactorsFields: updatedPayfactorsFields,
        providerFields: updatedProviderFields
      };
    }
    case fromFieldMappingActions.REMOVE_ASSOCIATED_ENTITY: {
      const updatedPayfactorsFields: EntityField =
        EntityMappingHelper.removeAssociationToPayfactorsEntity(
          action.payload.entityType,
          action.payload.payfactorsEntityIndex,
          cloneDeep(state.payfactorsFields));

      const updatedProviderFields: EntityField =
        EntityMappingHelper.removeAssociationToProviderEntity(
          action.payload.entityType,
          action.payload.entity,
          cloneDeep(state.providerFields));

      return {
        ...state,
        payfactorsFields: updatedPayfactorsFields,
        providerFields: updatedProviderFields
      };
    }
    case fromFieldMappingActions.SAVE_MAPPING: {
      return {
        ...state,
        saving: true,
      };
    }
    case fromFieldMappingActions.SAVE_MAPPING_ERROR: {
      return {
        ...state,
        saving: false,
        savingError: true,
      };
    }
    case fromFieldMappingActions.SAVE_MAPPING_SUCCESS: {
      return {
        ...state,
        saving: false
      };
    }
    case fromFieldMappingActions.CANCEL_MAPPING: {
      return state = initialState;
    }
    default:
      return state;
  }
}

export const getFieldMappingCardLoading = (state: State) => state.loading;
export const getFieldMappingCardLoadingError = (state: State) => state.loadingError;
export const getSelectedEntities = (state: State) => state.selectedEntities;
export const getProviderFields = (state: State) => state.providerFields;
export const getPayfactorsFields = (state: State) => state.payfactorsFields;
export const savingMappings = (state: State) => state.saving;
export const savingMappingsError = (state: State) => state.savingError;
export const canSaveMappings = (state: State) => {
  return Object.entries(state.payfactorsFields).every(([entityType, fields]) =>
    fields.every(field => (field.IsRequired && field.AssociatedEntity && field.AssociatedEntity.length > 0) || !field.IsRequired)
  );
};
