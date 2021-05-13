import { Action } from '@ngrx/store';

export const OPEN_MODAL = '[Structures - Range Group - Model Publish] Open Modal';
export const CLOSE_MODAL = '[Structures - Range Group - Model Publish] Close Modal';
export const PUBLISH_MODEL = '[Structures - Range Group - Model Publish] Publish Model';
export const PUBLISH_MODEL_SUCCESS = '[Structures - Range Group - Model Publish] Publish Model Success';
export const PUBLISH_MODEL_ERROR = '[Structures - Range Group - Model Publish] Publish Model Error';

export class OpenModal implements Action {
  readonly type = OPEN_MODAL;
}

export class CloseModal implements Action {
  readonly type = CLOSE_MODAL;
}

export class PublishModel implements Action {
  readonly type = PUBLISH_MODEL;

  constructor(public payload: { rangeGroupId: number }) {}
}

export class PublishModelSuccess implements Action {
  readonly type = PUBLISH_MODEL_SUCCESS;
}

export class PublishModelError implements Action {
  readonly type = PUBLISH_MODEL_ERROR;
}

export type PublishModelModalActions
  = OpenModal
  | CloseModal
  | PublishModel
  | PublishModelSuccess
  | PublishModelError;
