import { Action } from '@ngrx/store';

export const LOAD = '[Infinite Scroll] Load';
export const LOAD_SUCCESS = '[Infinite Scroll] Load Success';
export const LOAD_ERROR = '[Infinite Scroll] Load Error';
export const LOAD_MORE = '[Infinite Scroll] Load More';
export const LOAD_MORE_SUCCESS = '[Infinite Scroll] Load More Success';
export const LOAD_MORE_ERROR = '[Infinite Scroll] Load More Error';
export const CLEAR = '[Infinite Scroll] Clear';

export class Load implements Action {
  readonly type = LOAD;

  constructor(public payload: {scrollId: string}) {}
}

export class LoadSuccess implements Action {
  readonly type = LOAD_SUCCESS;

  constructor(public payload: {scrollId: string, lastReturnedCount?: number}) {}
}

export class LoadError implements Action {
  readonly type = LOAD_ERROR;

  constructor(public payload: {scrollId: string}) {}
}

export class LoadMore implements Action {
  readonly type = LOAD_MORE;

  constructor(public payload: {scrollId: string}) {}
}

export class LoadMoreSuccess implements Action {
  readonly type = LOAD_MORE_SUCCESS;

  constructor(public payload: {scrollId: string, lastReturnedCount: number}) {}
}

export class LoadMoreError implements Action {
  readonly type = LOAD_MORE_ERROR;

  constructor(public payload: {scrollId: string}) {}
}

export class Clear implements Action {
  readonly type = CLEAR;

  constructor(public payload: {scrollId: string}) {}
}

export type Actions
  = Load
  | LoadSuccess
  | LoadError
  | LoadMore
  | LoadMoreSuccess
  | LoadMoreError
  | Clear;
