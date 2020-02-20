import { Action } from '@ngrx/store';

import { Entity } from '../models';

export const GET_BASE_ENTITIES = '[Data Insights / Data View] Get Base Entities';
export const GET_BASE_ENTITIES_SUCCESS = '[Data Insights / Data View] Get Base Entities Success';
export const GET_BASE_ENTITIES_ERROR = '[Data Insights / Data View] Get Base Entities Error';

export class GetBaseEntities implements Action {
  readonly type = GET_BASE_ENTITIES;

  constructor() {}
}

export class GetBaseEntitiesSuccess implements Action {
  readonly type = GET_BASE_ENTITIES_SUCCESS;

  constructor(public payload: Entity[]) {}
}

export class GetBaseEntitiesError implements Action {
  readonly type = GET_BASE_ENTITIES_ERROR;

  constructor() {}
}

export type Actions
  = GetBaseEntities
  | GetBaseEntitiesSuccess
  | GetBaseEntitiesError;
