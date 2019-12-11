import { Action } from '@ngrx/store';
import { EntityField } from '../models';

export const INIT_FIELD_MAPPING_CARD = '[Data Management/Field Mappings] Init Field Mapping Card';
export const INIT_FIELD_MAPPING_CARD_ERROR = '[Data Management/Field Mappings] Init Field Mapping Card Error';
export const INIT_FIELD_MAPPING_CARD_SUCCESS = '[Data Management/Field Mappings] Init Field Mapping Card Success';

export const LOAD_PROVIDER_FIELDS_BY_ENTITY = '[Data Management/Field Mappings] Load Provider Fields By Entity';
export const LOAD_PROVIDER_FIELDS_BY_ENTITY_ERROR = '[Data Management/Field Mappings] Load Provider Fields By Entity Error';
export const LOAD_PROVIDER_FIELDS_BY_ENTITY_SUCCESS = '[Data Management/Field Mappings] Load Provider Fields By Entity Success';

export const LOAD_PAYFACTORS_FIELDS_BY_ENTITY = '[Data Management/Field Mappings] Load Payfactors Fields By Entity';
export const LOAD_PAYFACTORS_FIELDS_BY_ENTITY_ERROR = '[Data Management/Field Mappings] Load Payfactors Fields By Entity Error';
export const LOAD_PAYFACTORS_FIELDS_BY_ENTITY_SUCCESS = '[Data Management/Field Mappings] Load Payfactors Fields By Entity Success';

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

export type Actions
 = InitFieldMappingCard
 | InitFieldMappingCardError
 | InitFieldMappingCardSuccess
 | LoadProviderFieldsByEntity
 | LoadProviderFieldsByEntityError
 | LoadProviderFieldsByEntitySuccess
 | LoadPayfactorsFieldsByEntity
 | LoadPayfactorsFieldsByEntityError
 | LoadPayfactorsFieldsByEntitySuccess;
