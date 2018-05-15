import { Action } from '@ngrx/store';

import { Feature } from '../models';

export const LOADING_FEATURES =  '[Dashboard/Features] Loading Features';
export const LOADING_FEATURES_SUCCESS =  '[Dashboard/Features] Loading Features Success';
export const LOADING_FEATURES_ERROR =  '[Dashboard/Features] Loading Features Error';

export class LoadingFeatures implements Action {
  readonly type = LOADING_FEATURES;
}

export class LoadingFeaturesSuccess implements Action {
  readonly type = LOADING_FEATURES_SUCCESS;

  constructor(public payload: Feature[]) {}
}

export class LoadingFeaturesError implements Action {
  readonly type = LOADING_FEATURES_ERROR;

  constructor(public any: Error) {}
}

export type Actions
  = LoadingFeatures
  | LoadingFeaturesSuccess
  | LoadingFeaturesError;
