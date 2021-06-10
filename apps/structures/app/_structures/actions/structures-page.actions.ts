import { Action } from '@ngrx/store';

export const DELETE_STRUCTURE_MODEL = '[Structures / Structures Page] Delete Structure Model';
export const DELETE_STRUCTURE_MODEL_SUCCESS  = '[Structures / Structures Page] Delete Structure Model Success';
export const DELETE_STRUCTURE_MODEL_ERROR  = '[Structures  / Structures Page] Delete Structure Model Error';
export const OPEN_DELETE_STRUCTURES_MODAL = '[Structures / Structures Page] Open Delete Structure Modal';
export const CLOSE_DELETE_STRUCTURES_MODAL = '[Structures / Structures Page] Close Delete Structure Modal';

export class DeleteStructureModel implements Action {
  readonly type = DELETE_STRUCTURE_MODEL;

  constructor(public payload: { pageViewId: string, rangeGroupIds: number[] }) {}
}

export class DeleteStructureModelSuccess implements Action {
  readonly type = DELETE_STRUCTURE_MODEL_SUCCESS;

  constructor() {}
}

export class DeleteStructureModelError implements Action {
  readonly type = DELETE_STRUCTURE_MODEL_ERROR;

  constructor() {}
}

export class OpenDeletePayMarketModal implements Action {
  readonly type = OPEN_DELETE_STRUCTURES_MODAL;
  constructor() {}
}

export class CloseDeletePayMarketModal implements Action {
  readonly type = CLOSE_DELETE_STRUCTURES_MODAL;
  constructor() {}
}


export type Actions
  = DeleteStructureModel
  | DeleteStructureModelSuccess
  | DeleteStructureModelError
  | OpenDeletePayMarketModal
  | CloseDeletePayMarketModal;
