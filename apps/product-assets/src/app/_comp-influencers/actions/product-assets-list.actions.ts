import { Action } from '@ngrx/store';

import { ProductAsset } from '../../../../../../libs/models/product-assets/index';

export const LOADING_PRODUCT_ASSETS  = '[Product Assets] Loading Product Assets';
export const LOADING_PRODUCT_ASSETS_SUCCESS  = '[Product Assets] Loading Product Assets Success';
export const LOADING_PRODUCT_ASSETS_ERROR  = '[Product Assets] Loading Product Assets Error';

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

export type Actions
  = LoadingProductAssets
  | LoadingProductAssetsSuccess
  | LoadingProductAssetsError;
