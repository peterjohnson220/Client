import { Action } from '@ngrx/store';

export const ADDING_DATA_CUT  = '[Legacy Content/Add Data Cut Page] Adding Data Cut';
export const ADDING_DATA_CUT_SUCCESS  = '[Legacy Content/Add Data Cut Page] Adding Data Cut Success';
export const ADDING_DATA_CUT_ERROR  = '[Legacy Content/Add Data Cut Page] Adding Data Cut Error';
export const CANCEL_ADD_DATA_CUT = '[Legacy Content/Add Data Cut Page] Cancel Add Data Cut';
export const PAGE_IN_VIEW_IN_IFRAME = '[Legacy Content/Add Data Cut Page] Page In View From IFrame';


export class AddingDataCut implements Action {
  readonly type = ADDING_DATA_CUT;

  constructor(public payload: any) { }
}

export class AddingDataCutSuccess implements Action {
  readonly type = ADDING_DATA_CUT_SUCCESS;
}

export class AddingDataCutError implements Action {
  readonly type = ADDING_DATA_CUT_ERROR;
}

export class CancelAddDataCut implements Action {
  readonly type = CANCEL_ADD_DATA_CUT;
}

export class PageInViewInIframe implements Action {
  readonly type = PAGE_IN_VIEW_IN_IFRAME;
}

export type Actions
  = AddingDataCut
  | AddingDataCutSuccess
  | AddingDataCutError
  | CancelAddDataCut
  | PageInViewInIframe;
