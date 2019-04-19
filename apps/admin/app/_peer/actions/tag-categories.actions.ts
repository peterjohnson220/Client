import { Action } from '@ngrx/store';

import { GridDataResult } from '@progress/kendo-angular-grid';

import { UpsertTagCategoryRequest } from 'libs/models/peer/requests';

export const LOAD_TAG_CATEGORIES = '[Peer Admin/Tag Categories] Load Tag Categories';
export const LOAD_TAG_CATEGORIES_SUCCESS = '[Peer Admin/Tag Categories] Load Tag Categories Success';
export const LOAD_TAG_CATEGORIES_ERROR = '[Peer Admin/Tag Categories] Load Tag Categories Error';
export const OPEN_CREATE_TAG_CATEGORY_MODAL = '[Peer Admin/Tag Categories] Open Create Tag Category Modal';
export const CLOSE_CREATE_TAG_CATEGORY_MODAL = '[Peer Admin/Tag Categories] Close Create Tag Category Modal';
export const CREATE_TAG_CATEGORY = '[Peer Admin/Tag Categories] Create Tag Category';
export const CREATE_TAG_CATEGORY_SUCCESS = '[Peer Admin/Tag Categories] Create Tag Category Success';
export const CREATE_TAG_CATEGORY_ERROR = '[Peer Admin/Tag Categories] Create Tag Category Error';

export class LoadTagCategories implements Action {
  readonly type = LOAD_TAG_CATEGORIES;

  constructor(public payload: string) {}
}

export class LoadTagCategoriesSuccess implements Action {
  readonly type = LOAD_TAG_CATEGORIES_SUCCESS;

  constructor(public payload: GridDataResult) {}
}

export class LoadTagCategoriesError implements Action {
  readonly type = LOAD_TAG_CATEGORIES_ERROR;
}

export class OpenCreateTagCategoryModal implements Action {
  readonly type = OPEN_CREATE_TAG_CATEGORY_MODAL;
}

export class CloseCreateTagCategoryModal implements Action {
  readonly type = CLOSE_CREATE_TAG_CATEGORY_MODAL;
}

export class CreateTagCategory implements Action {
  readonly type = CREATE_TAG_CATEGORY;

  constructor(public payload: UpsertTagCategoryRequest) {}
}

export class CreateTagCategorySuccess implements Action {
  readonly type = CREATE_TAG_CATEGORY_SUCCESS;
}

export class CreateTagCategoryError implements Action {
  readonly type = CREATE_TAG_CATEGORY_ERROR;
}

export type Actions
  = LoadTagCategories
  | LoadTagCategoriesSuccess
  | LoadTagCategoriesError
  | OpenCreateTagCategoryModal
  | CloseCreateTagCategoryModal
  | CreateTagCategory
  | CreateTagCategorySuccess
  | CreateTagCategoryError;
