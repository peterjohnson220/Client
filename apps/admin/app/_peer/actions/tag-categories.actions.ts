import { Action } from '@ngrx/store';

import { GridDataResult } from '@progress/kendo-angular-grid';

import { AddTagCategoriesRequest, UpsertTagCategoryRequest } from 'libs/models/peer/requests';

export const LOAD_TAG_CATEGORIES = '[Peer Admin/Tag Categories] Load Tag Categories';
export const LOAD_TAG_CATEGORIES_SUCCESS = '[Peer Admin/Tag Categories] Load Tag Categories Success';
export const LOAD_TAG_CATEGORIES_ERROR = '[Peer Admin/Tag Categories] Load Tag Categories Error';
export const OPEN_CREATE_TAG_CATEGORY_MODAL = '[Peer Admin/Tag Categories] Open Create Tag Category Modal';
export const CLOSE_CREATE_TAG_CATEGORY_MODAL = '[Peer Admin/Tag Categories] Close Create Tag Category Modal';
export const CREATE_TAG_CATEGORY = '[Peer Admin/Tag Categories] Create Tag Category';
export const CREATE_TAG_CATEGORY_SUCCESS = '[Peer Admin/Tag Categories] Create Tag Category Success';
export const CREATE_TAG_CATEGORY_ERROR = '[Peer Admin/Tag Categories] Create Tag Category Error';
export const OPEN_ADD_TAG_CATEGORIES_MODAL = '[Peer Admin/Tag Categories] Open Add Tag Categories Modal';
export const CLOSE_ADD_TAG_CATEGORIES_MODAL = '[Peer Admin/Tag Categories] Close Add Tag Categories Modal';
export const ADD_TAG_CATEGORIES_TO_EXCHANGE = '[Peer Admin/Tag Categories] Add Tag Categories To Exchange';
export const ADD_TAG_CATEGORIES_TO_EXCHANGE_SUCCESS = '[Peer Admin/Tag Categories] Add Tag Categories To Exchange Success';
export const ADD_TAG_CATEGORIES_TO_EXCHANGE_ERROR = '[Peer Admin/Tag Categories] Add Tag Categories To Exchange Error';

export class LoadTagCategories implements Action {
  readonly type = LOAD_TAG_CATEGORIES;

  constructor(public payload: any) {}
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

export class OpenAddTagCategoriesModal implements Action {
  readonly type = OPEN_ADD_TAG_CATEGORIES_MODAL;
}

export class CloseAddTagCategoriesModal implements Action {
  readonly type = CLOSE_ADD_TAG_CATEGORIES_MODAL;
}

export class AddTagCategoriesToExchange implements Action {
  readonly type = ADD_TAG_CATEGORIES_TO_EXCHANGE;

  constructor(public payload: AddTagCategoriesRequest) {}
}

export class AddTagCategoriesToExchangeSuccess implements Action {
  readonly type = ADD_TAG_CATEGORIES_TO_EXCHANGE_SUCCESS;
}

export class AddTagCategoriesToExchangeError implements Action {
  readonly type = ADD_TAG_CATEGORIES_TO_EXCHANGE_ERROR;
}

export type Actions
  = LoadTagCategories
  | LoadTagCategoriesSuccess
  | LoadTagCategoriesError
  | OpenCreateTagCategoryModal
  | CloseCreateTagCategoryModal
  | CreateTagCategory
  | CreateTagCategorySuccess
  | CreateTagCategoryError
  | OpenAddTagCategoriesModal
  | CloseAddTagCategoriesModal
  | AddTagCategoriesToExchange
  | AddTagCategoriesToExchangeSuccess
  | AddTagCategoriesToExchangeError;
