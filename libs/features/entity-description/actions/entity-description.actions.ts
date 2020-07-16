import {Action} from '@ngrx/store';
import {EntityDescriptionTypeEnum} from '../../../models/entity-description/entity-description-type.enum';

export const GET_ENTITY_DESCRIPTION = '[Feature / Entity Description] Get Entity Description';
export const GET_ENTITY_DESCRIPTION_SUCCESS = '[Feature / Entity Description] Get Entity Description Success';
export const GET_ENTITY_DESCRIPTION_ERROR = '[Feature / Entity Description] Get Entity Description Error';

export class GetEntityDescription implements Action {
  readonly type = GET_ENTITY_DESCRIPTION;
  constructor(public payload: {entityType: EntityDescriptionTypeEnum, entityId: number}) {}
}

export class GetEntityDescriptionSuccess implements Action {
  readonly type = GET_ENTITY_DESCRIPTION_SUCCESS;
  constructor(public payload: string) {}
}

export class GetEntityDescriptionError implements Action {
  readonly type = GET_ENTITY_DESCRIPTION_ERROR;
}

export type Actions =
  GetEntityDescription
| GetEntityDescriptionError
| GetEntityDescriptionSuccess;
