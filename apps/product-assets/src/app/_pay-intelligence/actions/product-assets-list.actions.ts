import { Action } from '@ngrx/store';

import { ProductAsset } from 'libs/models/product-assets';

export const LOADING_PRODUCT_ASSETS  = '[Product Assets] Loading Product Assets';
export const LOADING_PRODUCT_ASSETS_SUCCESS  = '[Product Assets] Loading Product Assets Success';
export const LOADING_PRODUCT_ASSETS_ERROR  = '[Product Assets] Loading Product Assets Error';
export const FILTER_PRODUCT_ASSETS = '[Product Assets] Filter Product Assets';
export const SHOW_NEW_ASSETS = '[Product Assets] Show New Assets';
export const LOAD_ALL_ASSETS = '[Product Assets] Load All Assets';

export class LoadingProductAssets implements Action {
  readonly type = LOADING_PRODUCT_ASSETS;
}

export class LoadingProductAssetsSuccess implements Action {
  readonly type = LOADING_PRODUCT_ASSETS_SUCCESS;

  constructor(public payload: ProductAsset[]) {}
}

export class LoadingProductAssetsError implements Action {
  readonly type = LOADING_PRODUCT_ASSETS_ERROR;
}

export class FilterProductAssets implements Action {
  readonly type = FILTER_PRODUCT_ASSETS;

  constructor(public payload: string) {}
}

export class ShowNewAssets implements Action {
  readonly type = SHOW_NEW_ASSETS;
}

export class LoadAllAssets implements Action {
  readonly type = LOAD_ALL_ASSETS;
}

export type Actions
  = LoadingProductAssets
  | LoadingProductAssetsSuccess
  | LoadingProductAssetsError
  | FilterProductAssets
  | ShowNewAssets
  | LoadAllAssets;
