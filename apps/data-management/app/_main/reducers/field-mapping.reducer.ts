import * as cloneDeep from 'lodash.clonedeep';

import { MappingPackage } from 'libs/models/hris-api/mapping';

import { EntityMappingHelper } from '../helpers';
import * as fromFieldMappingActions from '../actions/field-mapping.actions';
import { EntityField } from '../models/entity-field.model';

export interface State {
  loading: boolean;
  loadingError: boolean;
  mappedFields: MappingPackage;
  providerFields: EntityField;
  payfactorsFields: EntityField;
  selectedEntities: string[];
  saving: boolean;
  savingError: false;
  defaultPaymarket: string;
  defaultPaymarketLoading: boolean;
  defaultPaymarketLoadingError: boolean;
  defaultPaymarketModalOpen: boolean;
  isDirty: boolean;
}

const initialState: State = {
  loading: true,
  loadingError: false,
  mappedFields: null,
  providerFields: new EntityField(),
  payfactorsFields: new EntityField(),
  selectedEntities: null,
  saving: false,
  savingError: false,
  defaultPaymarket: null,
  defaultPaymarketLoading: false,
  defaultPaymarketLoadingError: false,
  defaultPaymarketModalOpen: false,
  isDirty: false
};

export function reducer(state: State = initialState, action: fromFieldMappingActions.Actions) {
  switch (action.type) {
    case fromFieldMappingActions.INIT_FIELD_MAPPING_CARD: {
      return {
        ...state,
        loading: true,
        isDirty: false,
        saving: false
      };
    }
    case fromFieldMappingActions.INIT_FIELD_MAPPING_CARD_ERROR: {
      return {
        ...state,
        loading: false,
        loadingError: true
      };
    }
    case fromFieldMappingActions.INIT_FIELD_MAPPING_CARD_SUCCESS: {
      return {
        ...state,
        loading: false,
        loadingError: false
      };
    }
    case fromFieldMappingActions.LOAD_PAYFACTORS_FIELDS_BY_ENTITY: {
      return {
        ...state,
        loadingError: false,
      };
    }
    case fromFieldMappingActions.LOAD_PAYFACTORS_FIELDS_BY_ENTITY_SUCCESS: {
      const pff = cloneDeep(state.payfactorsFields);
      pff[action.payload.entity] = action.payload.payfactorsEntityFields;
      return {
        ...state,
        loadingError: false,
        payfactorsFields: pff
      };
    }
    case fromFieldMappingActions.LOAD_PAYFACTORS_FIELDS_BY_ENTITY_ERROR: {
      return {
        ...state,
        loadingError: true,
      };
    }
    case fromFieldMappingActions.LOAD_PROVIDER_FIELDS_BY_ENTITY: {
      return {
        ...state,
        loadingError: false,
      };
    }
    case fromFieldMappingActions.LOAD_PROVIDER_FIELDS_BY_ENTITY_SUCCESS: {
      const pf = cloneDeep(state.providerFields);
      pf[action.payload.entity] = action.payload.providerEntityFields;
      return {
        ...state,
        providerFields: pf
      };
    }
    case fromFieldMappingActions.LOAD_PROVIDER_FIELDS_BY_ENTITY_ERROR: {
      return {
        ...state,
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
        providerFields: updatedProviderFields,
        isDirty: true
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
        providerFields: updatedProviderFields,
        isDirty: true
      };
    }
    case fromFieldMappingActions.SAVE_OUTBOUND_MAPPINGS:
    case fromFieldMappingActions.SAVE_MAPPING: {
      return {
        ...state,
        saving: true,
        savingError: false,
      };
    }
    case fromFieldMappingActions.SAVE_MAPPING_ERROR: {
      return {
        ...state,
        saving: false,
        savingError: true,
      };
    }
    case fromFieldMappingActions.SAVE_OUTBOUND_MAPPING_SUCCESS:
    case fromFieldMappingActions.SAVE_MAPPING_SUCCESS: {
      return {
        ...state,
        saving: false,
        savingError: false,
        isDirty: false
      };
    }
    case fromFieldMappingActions.LOAD_DEFAULT_PAYMARKET: {
      return {
        ...state,
        defaultPaymarket: null,
        defaultPaymarketLoading: true,
        defaultPaymarketLoadingError: false,
      };
    }
    case fromFieldMappingActions.LOAD_DEFAULT_PAYMARKET_ERROR: {
      return {
        ...state,
        defaultPaymarket: null,
        defaultPaymarketLoading: false,
        defaultPaymarketLoadingError: true,
      };
    }
    case fromFieldMappingActions.LOAD_DEFAULT_PAYMARKET_SUCCESS: {
      return {
        ...state,
        defaultPaymarket: action.payload.defaultPaymarket,
        defaultPaymarketLoading: false,
        defaultPaymarketLoadingError: false,
      };
    }
    case fromFieldMappingActions.OPEN_DEFAULT_PAYMARKET_MODAL: {
      return {
        ...state,
        defaultPaymarketModalOpen: true,
      };
    }
    case fromFieldMappingActions.DISMISS_DEFAULT_PAYMARKET_MODAL: {
      return {
        ...state,
        defaultPaymarketModalOpen: false,
      };
    }
    case fromFieldMappingActions.LOAD_CUSTOM_FIELDS_BY_ENTITY_SUCCESS: {
      const pf = cloneDeep(state.payfactorsFields);
      pf[action.payload.entityType] = EntityMappingHelper.mapCustomUdfFieldsToPayfactorsEntity(action.payload.customFields, pf[action.payload.entityType]);
      return {
        ...state,
        payfactorsFields: pf
      };
    }
    case fromFieldMappingActions.LOAD_MAPPED_FIELDS: {

      return {
        ...state,
        payfactorsFields: EntityMappingHelper.removeUnselectedEntities(action.payload.selectedEntities, state.payfactorsFields),
        mappedFields: action.payload.mappedFields
      };
    }
    case fromFieldMappingActions.LOAD_MAPPED_FIELDS_SUCCESS: {
      return {
        ...state,
        payfactorsFields: action.payload.payfactorsFields,
        providerFields: action.payload.providerFields,
      };
    }
    case fromFieldMappingActions.LOAD_MAPPED_FIELDS_ERROR: {
      return {
        ...state,
        loadingError: true
      };
    }
    default:
      return state;
  }
}

export const getFieldMappingPageLoading = (state: State) => state.loading;
export const getFieldMappingPageLoadingError = (state: State) => state.loadingError;
export const getProviderFields = (state: State) => state.providerFields;
export const getPayfactorsFields = (state: State) => state.payfactorsFields;
export const savingMappings = (state: State) => state.saving;
export const savingMappingsError = (state: State) => state.savingError;
export const canSaveMappings = (state: State) => {
  return state.payfactorsFields && Object.entries(state.payfactorsFields).every(([entityType, fields]) =>
    fields.every(field => (field.IsRequired && field.AssociatedEntity && field.AssociatedEntity.length > 0) || !field.IsRequired)
  );
};
export const getDefaultPaymarket = (state: State) => state.defaultPaymarket;
export const getDefaultPaymarketLoading = (state: State) => state.defaultPaymarketLoading;
export const getDefaultPaymarketLoadingError = (state: State) => state.defaultPaymarketLoadingError;
export const getDefaultPaymarketModalOpen = (state: State) => state.defaultPaymarketModalOpen;
export const isFieldMappingPageDirty = (state: State) => state.isDirty;
