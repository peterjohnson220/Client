import { Action } from '@ngrx/store';

export const GET_REPOSITORIES_BY_ROUTE = '[Data Management/ Repositories By Route] Get Repositories By Route';
export const GET_REPOSITORIES_BY_ROUTE_SUCCESS = '[Data Management/ Repositories By Route] Get Repositories By Route Success';
export const GET_REPOSITORIES_BY_ROUTE_ERROR = '[Data Management/ Repositories By Route] Get Repositories By Route Error';

export class GetRepositoriesByRoute implements Action {
  readonly type = GET_REPOSITORIES_BY_ROUTE;
  constructor(public payload: string ) {
  }
}

export class GetRepositoriesByRouteSuccess implements Action {
  readonly type = GET_REPOSITORIES_BY_ROUTE_SUCCESS;
  constructor(public payload: any ) {
  }
}

export class GetRepositoriesByRouteError implements Action {
  readonly type = GET_REPOSITORIES_BY_ROUTE_ERROR;
}

export type Actions
  = GetRepositoriesByRoute
  | GetRepositoriesByRouteSuccess
  | GetRepositoriesByRouteError;
