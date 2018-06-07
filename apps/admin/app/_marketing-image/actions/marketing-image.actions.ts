import { Action } from '@ngrx/store';

export const SAVING_MARKETING_IMAGE =  '[marketing/image] Saving marketing image';
export const SAVING_MARKETING_IMAGE_SUCCESS =  '[marketing/image] Saving marketing image success';
export const SAVING_MARKETING_IMAGE_ERROR =  '[marketing/image] Saving marketing image error';

export class SavingFile implements Action {
  readonly type = SAVING_MARKETING_IMAGE;
  constructor(public payload: any) {}
}

export class SavingFileSuccess implements Action {
  readonly type = SAVING_MARKETING_IMAGE_SUCCESS;
  constructor() {}
}

export class SavingFileError implements Action {
  readonly type =SAVING_MARKETING_IMAGE_ERROR;
  constructor(public any: Error) {}
}

export type Actions
  = SavingFile
  | SavingFileSuccess
  | SavingFileError;
