import { Action } from '@ngrx/store';

export const RESET_JOB_ASSOCIATIONS_MODAL_STATE  = '[Peer Job Association Modal/Job Association Modal] Reset Job Associations Modal State';
export const CLOSE_JOB_ASSOCIATIONS_MODAL  = '[Peer Job Association Modal/Job Association Modal] Close Job Associations Modal';
export const SAVE_JOB_ASSOCIATIONS  = '[Peer Job Association Modal/Job Association Modal] Save Job Associations';
export const SAVE_JOB_ASSOCIATIONS_ERROR  = '[Peer Job Association Modal/Job Association Modal] Save Job Associations Error';
export const SAVE_JOB_ASSOCIATIONS_SUCCESS  = '[Peer Job Association Modal/Job Association Modal] Save Job Associations Success';

export class ResetJobAssociationsModalState implements Action {
  readonly type = RESET_JOB_ASSOCIATIONS_MODAL_STATE;
}

export class SaveJobAssociations implements Action {
  readonly type = SAVE_JOB_ASSOCIATIONS;
}

export class SaveJobAssociationsError implements Action {
  readonly type = SAVE_JOB_ASSOCIATIONS_ERROR;
}

export class SaveJobAssociationsSuccess implements Action {
  readonly type = SAVE_JOB_ASSOCIATIONS_SUCCESS;
}

export class CloseJobAssociationsModal implements Action {
  readonly type = CLOSE_JOB_ASSOCIATIONS_MODAL;
}

export type Actions
  = ResetJobAssociationsModalState
  | SaveJobAssociations
  | SaveJobAssociationsError
  | SaveJobAssociationsSuccess
  | CloseJobAssociationsModal;

