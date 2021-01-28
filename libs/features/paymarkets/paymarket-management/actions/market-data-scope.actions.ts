import { Action } from '@ngrx/store';

import { GroupedListItem } from 'libs/models/list';
import { MDLocationsRequest } from 'libs/models/payfactors-api/paymarket';

export const GET_SIZES = '[Pay Market Management / Market Data Scope] Get Sizes';
export const GET_SIZES_SUCCESS = '[Pay Market Management / Market Data Scope] Get Sizes Success';
export const GET_SIZES_ERROR = '[Pay Market Management / Market Data Scope] Get Sizes Error';
export const GET_ALL_INDUSTRIES = '[Pay Market Management / Market Data Scope] Get All Industries';
export const GET_ALL_INDUSTRIES_SUCCESS = '[Pay Market Management / Market Data Scope] Get All Industries Success';
export const GET_ALL_INDUSTRIES_ERROR = '[Pay Market Management / Market Data Scope] Get All Industries Error';
export const GET_LOCATIONS = '[Pay Market Management / Market Data Scope] Get Locations';
export const GET_LOCATIONS_SUCCESS = '[Pay Market Management / Market Data Scope] Get Locations Success';
export const GET_LOCATIONS_ERROR = '[Pay Market Management / Market Data Scope] Get Locations Error';

export class GetSizes implements Action {
  readonly type = GET_SIZES;
  constructor() {}
}

export class GetSizesSuccess implements Action {
  readonly type = GET_SIZES_SUCCESS;
  constructor(public payload: GroupedListItem[]) {}
}

export class GetSizesError implements Action {
  readonly type = GET_SIZES_ERROR;
  constructor() {}
}

export class GetAllIndustries implements Action {
  readonly type = GET_ALL_INDUSTRIES;
  constructor() {}
}

export class GetAllIndustriesSuccess implements Action {
  readonly type = GET_ALL_INDUSTRIES_SUCCESS;
  constructor(public payload: GroupedListItem[]) { }
}

export class GetAllIndustriesError implements Action {
  readonly type = GET_ALL_INDUSTRIES_ERROR;
  constructor() {}
}

export class GetLocations implements Action {
  readonly type = GET_LOCATIONS;
  constructor(public payload: { request: MDLocationsRequest, locationExpandedKey?: string }) {}
}

export class GetLocationsSuccess implements Action {
  readonly type = GET_LOCATIONS_SUCCESS;
  constructor(public payload: { results: GroupedListItem[], reset: boolean, locationExpandedKey?: string }) {}
}

export class GetLocationsError implements Action {
  readonly type = GET_LOCATIONS_ERROR;
  constructor() {}
}

export type Actions
  = GetSizes
  | GetSizesSuccess
  | GetSizesError
  | GetAllIndustries
  | GetAllIndustriesSuccess
  | GetAllIndustriesError
  | GetLocations
  | GetLocationsSuccess
  | GetLocationsError;
