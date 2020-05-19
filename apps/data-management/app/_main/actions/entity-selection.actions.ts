import {Action} from '@ngrx/store';

import {OrgDataEntityType} from 'libs/constants/hris-api';

import {EntityChoice, Provider} from '../models';

export const INIT = '[Data Management/Entity Selection Page] Initialize';
export const LOAD_ENTITY_SELECTION = '[Data Management/Entity Selection Page] Load Entity Selection';
export const LOAD_ENTITY_SELECTION_ERROR = '[Data Management/Entity Selection Page] Load Entity Selection Error';
export const LOAD_ENTITY_SELECTION_SUCCESS = '[Data Management/Entity Selection Page] Load Entity Selection Success';
export const UPDATE_ENTITY_SELECTIONS = '[Data Management/Entity Selection Page] Update Entity Selections';
export const UPDATE_ENTITY_SELECTIONS_ERROR = '[Data Management/Entity Selection Page] Update Entity Selections Error';
export const UPDATE_ENTITY_SELECTIONS_SUCCESS = '[Data Management/Entity Selection Page] Update Entity Selections Success';
export const SET_ENTITY_SELECTION = '[Data Management/Entity Selection Page] Set Entity Selections';
export const OPEN_REMOVE_ENTITY_MODAL = '[Data Management/Entity Selection Page] Open Remove Entity Modal';


export const DEACTIVATE_MAPPINGS_FOR_ENTITIES = '[Data Management/Entity Selection Page] Deactivate Field Mappings For Entity';
export const DEACTIVATE_MAPPINGS_FOR_ENTITIES_ERROR = '[Data Management/Entity Selection Page] Deactivate Field Mappings For Entity Error';
export const DEACTIVATE_MAPPINGS_FOR_ENTITIES_SUCCESS = '[Data Management/Entity Selection Page] Deactivate Field Mappings For Entity Success';

export class Init implements Action {
  readonly type = INIT;
}

export class LoadEntitySelection implements Action {
  readonly type = LOAD_ENTITY_SELECTION;

  constructor(public payload: Provider) {}
}

export class LoadEntitySelectionError implements Action {
  readonly type = LOAD_ENTITY_SELECTION_ERROR;
}

export class LoadEntitySelectionSuccess implements Action {
  readonly type = LOAD_ENTITY_SELECTION_SUCCESS;

  constructor(public payload: EntityChoice[]) {}
}

export class UpdateEntitySelections implements Action {
  readonly type = UPDATE_ENTITY_SELECTIONS;

  constructor(public payload: { connectionId: number, selectedEntities: OrgDataEntityType[]}) {}
}

export class UpdateEntitySelectionsError implements Action {
  readonly type = UPDATE_ENTITY_SELECTIONS_ERROR;
}

export class UpdateEntitySelectionsSuccess implements Action {
  readonly type = UPDATE_ENTITY_SELECTIONS_SUCCESS;
}

export class SetEntitySelections implements Action {
  readonly type = SET_ENTITY_SELECTION;

  constructor(public payload: {connectionId: number, selectedEntities: OrgDataEntityType[]}) {}
}

export class OpenRemoveEntityModal implements Action {
  readonly type = OPEN_REMOVE_ENTITY_MODAL;

  constructor(public payload: boolean) {}
}

export class DeactivateMappingForEntities implements Action {
  readonly type = DEACTIVATE_MAPPINGS_FOR_ENTITIES;

  constructor(public payload: { entityMappingsToRemove: string[], deactivateRedirectRoute: string, selectedEntities: OrgDataEntityType[] }) {}
}

export class DeactivateMappingForEntitiesError implements Action {
  readonly type = DEACTIVATE_MAPPINGS_FOR_ENTITIES_ERROR;

  constructor() {}
}

export class DeactivateMappingForEntitiesSuccess implements Action {
  readonly type = DEACTIVATE_MAPPINGS_FOR_ENTITIES_SUCCESS;

  constructor(public payload: { deactivateRedirectRoute: string }) {}
}

export type Actions
  = Init
  | LoadEntitySelection
  | LoadEntitySelectionError
  | LoadEntitySelectionSuccess
  | UpdateEntitySelections
  | UpdateEntitySelectionsError
  | UpdateEntitySelectionsSuccess
  | SetEntitySelections
  | OpenRemoveEntityModal
  | DeactivateMappingForEntities
  | DeactivateMappingForEntitiesError
  | DeactivateMappingForEntitiesSuccess;
