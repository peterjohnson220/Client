import { Action } from '@ngrx/store';

import { MappingPackage } from 'libs/models';
import { EntityDataField, EntityField } from '../models';

export const INIT_FIELD_MAPPING_CARD = '[Data Management/Field Mappings] Init Field Mapping Card';
export const INIT_FIELD_MAPPING_CARD_ERROR = '[Data Management/Field Mappings] Init Field Mapping Card Error';
export const INIT_FIELD_MAPPING_CARD_SUCCESS = '[Data Management/Field Mappings] Init Field Mapping Card Success';

export const LOAD_PROVIDER_FIELDS_BY_ENTITY = '[Data Management/Field Mappings] Load Provider Fields By Entity';
export const LOAD_PROVIDER_FIELDS_BY_ENTITY_ERROR = '[Data Management/Field Mappings] Load Provider Fields By Entity Error';
export const LOAD_PROVIDER_FIELDS_BY_ENTITY_SUCCESS = '[Data Management/Field Mappings] Load Provider Fields By Entity Success';

export const LOAD_PAYFACTORS_FIELDS_BY_ENTITY = '[Data Management/Field Mappings] Load Payfactors Fields By Entity';
export const LOAD_PAYFACTORS_FIELDS_BY_ENTITY_ERROR = '[Data Management/Field Mappings] Load Payfactors Fields By Entity Error';
export const LOAD_PAYFACTORS_FIELDS_BY_ENTITY_SUCCESS = '[Data Management/Field Mappings] Load Payfactors Fields By Entity Success';

export const ADD_ASSOCIATED_ENTITY = '[Data Management/Field Mappings] Add Associated Entity to Payfactors Entity';
export const REMOVE_ASSOCIATED_ENTITY = '[Data Management/Field Mappings] Remove Associated Entity from Payfactors Entity';

export const TRY_SAVE_MAPPING = '[Data Management/Field Mappings] Try Save Mappings';
export const SAVE_MAPPING = '[Data Management/Field Mappings] Save Mappings';
export const SAVE_MAPPING_ERROR = '[Data Management/Field Mappings] Save Mappings Error';
export const SAVE_MAPPING_SUCCESS = '[Data Management/Field Mappings] Save Mappings Success';

export const CANCEL_MAPPING = '[Data Management/Field Mappings] Cancel Mapping Workflow';

export const LOAD_DEFAULT_PAYMARKET = '[Data Management/Field Mappings] Load Default Paymarket';
export const LOAD_DEFAULT_PAYMARKET_ERROR = '[Data Management/Field Mappings] Load Default Paymarket Error';
export const LOAD_DEFAULT_PAYMARKET_SUCCESS = '[Data Management/Field Mappings] Load Default Paymarket Success';
export const OPEN_DEFAULT_PAYMARKET_MODAL = '[Data Management/Field Mappings] Open Default Paymarket Modal';
export const DISMISS_DEFAULT_PAYMARKET_MODAL = '[Data Management/Field Mappings] Dismiss Default Paymarket Modal';

export const LOAD_CUSTOM_FIELDS_BY_ENTITY = '[Data Management/Field Mappings] Load Custom Fields';
export const LOAD_CUSTOM_FIELDS_BY_ENTITY_ERROR = '[Data Management/Field Mappings] Load Custom Fields Error';
export const LOAD_CUSTOM_FIELDS_BY_ENTITY_SUCCESS = '[Data Management/Field Mappings] Load Custom Fields Success';

export const LOAD_MAPPED_FIELDS = '[Data Management/Field Mappings] Load Mapped Fields';
export const LOAD_MAPPED_FIELDS_ERROR = '[Data Management/Field Mappings] Load Mapped Fields Error';
export const LOAD_MAPPED_FIELDS_SUCCESS = '[Data Management/Field Mappings] Load Mapped Fields Success';

// outbound jdm actions, delete me
export const SAVE_OUTBOUND_MAPPINGS = '[Data Management/Field Mappings] Save Outbound JDM Mappings';
export const SAVE_OUTBOUND_MAPPING_SUCCESS = '[Data Management/Field Mappings] Save Outbound JDM Mappings Success';


export class InitFieldMappingCard implements Action {
  readonly type = INIT_FIELD_MAPPING_CARD;

  constructor(public payload: string[]) {}
}

export class InitFieldMappingCardSuccess implements Action {
  readonly type = INIT_FIELD_MAPPING_CARD_SUCCESS;

  constructor() {}
}

export class InitFieldMappingCardError implements Action {
  readonly type = INIT_FIELD_MAPPING_CARD_ERROR;

  constructor() {}
}

export class LoadProviderFieldsByEntity implements Action {
  readonly type = LOAD_PROVIDER_FIELDS_BY_ENTITY;

  constructor(public payload: { entity: string }) {}
}
export class LoadProviderFieldsByEntitySuccess implements Action {
  readonly type = LOAD_PROVIDER_FIELDS_BY_ENTITY_SUCCESS;

  constructor(public payload: { entity: string, providerEntityFields: any[] }) {}
}
export class LoadProviderFieldsByEntityError implements Action {
  readonly type = LOAD_PROVIDER_FIELDS_BY_ENTITY_ERROR;

  constructor() {}
}

export class LoadPayfactorsFieldsByEntity implements Action {
  readonly type = LOAD_PAYFACTORS_FIELDS_BY_ENTITY;

  constructor(public payload: { entity: string }) {}
}
export class LoadPayfactorsFieldsByEntitySuccess implements Action {
  readonly type = LOAD_PAYFACTORS_FIELDS_BY_ENTITY_SUCCESS;

  constructor(public payload: { entity: string, payfactorsEntityFields: any[] }) {}
}
export class LoadPayfactorsFieldsByEntityError implements Action {
  readonly type = LOAD_PAYFACTORS_FIELDS_BY_ENTITY_ERROR;

  constructor() {}
}

export class AddAssociatedEntity implements Action {
  readonly type = ADD_ASSOCIATED_ENTITY;

  constructor(public payload: { entity: EntityDataField, entityType: string, payfactorsEntityId: number}) {}
}

export class RemoveAssociatedEntity implements Action {
  readonly type = REMOVE_ASSOCIATED_ENTITY;

  constructor(public payload: {entity: EntityDataField, payfactorsEntityIndex: number, entityType: string}) {}
}

export class TrySaveMapping implements Action {
  readonly type = TRY_SAVE_MAPPING;

  constructor() {}
}

export class SaveMapping implements Action {
  readonly type = SAVE_MAPPING;

  constructor() {}
}

export class SaveMappingError implements Action {
  readonly type = SAVE_MAPPING_ERROR;

  constructor() {}
}

export class SaveMappingSuccess implements Action {
  readonly type = SAVE_MAPPING_SUCCESS;

  constructor(public payload) {}
}

export class LoadDefaultPaymarket implements Action {
  readonly type = LOAD_DEFAULT_PAYMARKET;

  constructor() {}
}

export class LoadDefaultPaymarketError implements Action {
  readonly type = LOAD_DEFAULT_PAYMARKET_ERROR;

  constructor() {}
}

export class LoadDefaultPaymarketSuccess implements Action {
  readonly type = LOAD_DEFAULT_PAYMARKET_SUCCESS;

  constructor(public payload: { defaultPaymarket: string }) {}
}

export class OpenDefaultPaymarketModal implements Action {
  readonly type = OPEN_DEFAULT_PAYMARKET_MODAL;

  constructor() {}
}

export class DismissDefaultPaymarketModal implements Action {
  readonly type = DISMISS_DEFAULT_PAYMARKET_MODAL;

  constructor(public payload: { saveDefaultPaymarket: boolean }) {}
}

export class LoadCustomFieldsByEntity implements Action {
  readonly type = LOAD_CUSTOM_FIELDS_BY_ENTITY;

  constructor(public payload: { entity: string }) {}
}

export class LoadCustomFieldsByEntityError implements Action {
  readonly type = LOAD_CUSTOM_FIELDS_BY_ENTITY_ERROR;

  constructor() {}
}

export class LoadCustomFieldsByEntitySuccess implements Action {
  readonly type = LOAD_CUSTOM_FIELDS_BY_ENTITY_SUCCESS;

  constructor(public payload: { customFields: any, entityType: string }) {}
}

export class LoadMappedFields implements Action {
  readonly type = LOAD_MAPPED_FIELDS;

  constructor(public payload: { mappedFields: MappingPackage, selectedEntities: string[] }) {}
}

export class LoadMappedFieldsError implements Action {
  readonly type = LOAD_MAPPED_FIELDS_ERROR;

  constructor() {}
}

export class LoadMappedFieldsSucces implements Action {
  readonly type = LOAD_MAPPED_FIELDS_SUCCESS;

  constructor(public payload: { payfactorsFields: EntityField, providerFields: EntityField }) {}
}



// outbound jdm actions, delete me
export class SaveOutboundJdmFieldMappings implements Action {
  readonly type = SAVE_OUTBOUND_MAPPINGS;

  constructor() {}
}
export class SaveOutboundJdmFieldMappingsSuccess implements Action {
  readonly type = SAVE_OUTBOUND_MAPPING_SUCCESS;

  constructor(public payload) {}
}


export type Actions
 = InitFieldMappingCard
 | InitFieldMappingCardError
 | InitFieldMappingCardSuccess
 | LoadProviderFieldsByEntity
 | LoadProviderFieldsByEntityError
 | LoadProviderFieldsByEntitySuccess
 | LoadPayfactorsFieldsByEntity
 | LoadPayfactorsFieldsByEntityError
 | LoadPayfactorsFieldsByEntitySuccess
 | AddAssociatedEntity
 | RemoveAssociatedEntity
 | SaveMapping
 | SaveMappingError
 | SaveMappingSuccess
 | LoadDefaultPaymarket
 | LoadDefaultPaymarketError
 | LoadDefaultPaymarketSuccess
 | OpenDefaultPaymarketModal
 | DismissDefaultPaymarketModal
 | LoadCustomFieldsByEntity
 | LoadCustomFieldsByEntityError
 | LoadCustomFieldsByEntitySuccess
 | LoadMappedFields
 | LoadMappedFieldsError
 | LoadMappedFieldsSucces
 | TrySaveMapping
 | SaveOutboundJdmFieldMappings
 | SaveOutboundJdmFieldMappingsSuccess;
