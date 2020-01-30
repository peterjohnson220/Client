import { Action } from '@ngrx/store';

import { EntityDataField } from '../models';

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

export const SAVE_MAPPING = '[Data Management/Field Mappings] Save Mappings';
export const SAVE_MAPPING_ERROR = '[Data Management/Field Mappings] Save Mappings Error';
export const SAVE_MAPPING_SUCCESS = '[Data Management/Field Mappings] Save Mappings Success';

export const CANCEL_MAPPING = '[Data Management/Field Mappings] Cancel Mapping Workflow';

export class InitFieldMappingCard implements Action {
  readonly type = INIT_FIELD_MAPPING_CARD;

  constructor(public payload: { entities: any[]}) {}
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

  constructor() {}
}

export class CancelMapping implements Action {
  readonly type = CANCEL_MAPPING;

  constructor() {}
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
 | CancelMapping;
