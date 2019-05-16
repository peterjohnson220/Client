import { Action } from '@ngrx/store';

export const INITIALIZE = '[Peer/Job Association Modal] Initialize';
export const CLOSE_JOB_ASSOCIATIONS_MODAL = '[Peer/Job Association Modal] Close Job Association Modal';
export const OPEN_JOB_ASSOCIATIONS_MODAL = '[Peer/Job Association Modal] Open Job Association Modal';
export const RELOAD_JOB_ASSOCIATIONS_MODAL  = '[Peer/Job Association Modal] Reload Job Association Modal';
export const RESET_JOB_ASSOCIATIONS_MODAL  = '[Peer/Job Association Modal] Reset Job Association Modal';
export const SAVE_JOB_ASSOCIATIONS  = '[Peer/Job Association Modal] Save Job Associations';
export const SAVE_JOB_ASSOCIATIONS_ERROR  = '[Peer/Job Association Modal] Save Job Associations Error';
export const SAVE_JOB_ASSOCIATIONS_SUCCESS  = '[Peer/Job Association Modal] Save Job Associations Success';

// saveable actions are fired when the user makes changes to the JAM that would be lost without saving
export const CHANGE_SAVEABLE_ENTITIES  = '[Peer/Job Association Modal] Change Saveable Entities';
export const CLOSE_MODAL_WITH_SAVEABLE_CHANGES = '[Peer/Job Association Modal] Close Modal With Saveable Changes';
export const CANCEL_UNSAVED_CHANGES_WARNING = '[Peer/Job Association Modal] Cancel Unsaved Changes Warning';

export class Initialize implements Action {
  readonly type = INITIALIZE;
}

export class CloseJobAssociationsModal implements Action {
  readonly type = CLOSE_JOB_ASSOCIATIONS_MODAL;
}

export class OpenJobAssociationModal implements Action {
  readonly type = OPEN_JOB_ASSOCIATIONS_MODAL;
}

export class ReloadJobAssociationsModal implements Action {
  readonly type = RELOAD_JOB_ASSOCIATIONS_MODAL;
}

export class ResetJobAssociationsModal implements Action {
  readonly type = RESET_JOB_ASSOCIATIONS_MODAL;
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

export class ChangeSaveableEntities implements Action {
  readonly type = CHANGE_SAVEABLE_ENTITIES;
  constructor(public payload: boolean) {}
}

export class CloseModalWithSaveableChanges implements Action {
  readonly type = CLOSE_MODAL_WITH_SAVEABLE_CHANGES;
}

export class CancelUnsavedChangesWarning implements Action {
  readonly type = CANCEL_UNSAVED_CHANGES_WARNING;
}

export type Actions
  = Initialize
  | CloseJobAssociationsModal
  | OpenJobAssociationModal
  | ReloadJobAssociationsModal
  | ResetJobAssociationsModal
  | SaveJobAssociations
  | SaveJobAssociationsError
  | SaveJobAssociationsSuccess
  | ChangeSaveableEntities
  | CloseModalWithSaveableChanges
  | CancelUnsavedChangesWarning;
