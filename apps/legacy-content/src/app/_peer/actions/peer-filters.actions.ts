import { Action } from '@ngrx/store';

import { FilterAggregateGroup } from '../reducers/peer-filters.reducer';

export const LOADING_PEER_FILTERS  = '[Peer Add Data Cut/Filters] Loading Peer Filters';
export const LOADING_PEER_FILTERS_SUCCESS  = '[Peer Add Data Cut/Filters] Loading Peer Filters Success';
export const LOADING_PEER_FILTERS_ERROR  = '[Peer Add Data Cut/Filters] Loading Peer Filters Error';

export class LoadingPeerFilters implements Action {
  readonly type = LOADING_PEER_FILTERS;
  readonly payload = null;
}

export class LoadingPeerFiltersSuccess implements Action {
  readonly type = LOADING_PEER_FILTERS_SUCCESS;

  constructor(public payload: FilterAggregateGroup[]) {}
}

export class LoadingPeerFiltersError implements Action {
  readonly type = LOADING_PEER_FILTERS_ERROR;
  readonly payload = null;
}

export type Actions
  = LoadingPeerFilters
  | LoadingPeerFiltersSuccess
  | LoadingPeerFiltersError;
