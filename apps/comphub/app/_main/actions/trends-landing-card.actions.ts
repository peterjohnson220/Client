import { Action } from '@ngrx/store';

import { ExchangeExplorerScopeResponseContext, PeerTrendResponse } from 'libs/models/payfactors-api/peer/exchange-data-filter/response';

export const GET_NEW_EXCHANGE_PARTICIPANTS = '[Comphub/Trends Landing Card] Get New Exchange Participants';
export const GET_NEW_EXCHANGE_PARTICIPANTS_SUCCESS = '[Comphub/Trends Landing Card] Get New Exchange Participants Success';
export const GET_NEW_EXCHANGE_PARTICIPANTS_ERROR = '[Comphub/Trends Landing Card] Get New Exchange Participants Error';
export const GET_ORG_INC_COUNT_HISTORY = '[Comphub/Trends Landing Card] Get Org/Inc Count History';
export const GET_ORG_INC_COUNT_HISTORY_SUCCESS = '[Comphub/Trends Landing Card] Get Org/Inc Count History Success';
export const GET_ORG_INC_COUNT_HISTORY_ERROR = '[Comphub/Trends Landing Card] Get Org/Inc Count History Error';
export const DELETE_SAVED_TREND = '[Comphub/Trends Landing Card] Delete Saved Trend';
export const DELETE_SAVED_TREND_SUCCESS = '[Comphub/Trends Landing Card] Delete Saved Trend Success';
export const DELETE_SAVED_TREND_ERROR = '[Comphub/Trends Landing Card] Delete Saved Trend Error';
export const SET_SELECTED_TREND_ID = '[Comphub/Trends Landing Card] Set Selected Trend Id';
export const LOAD_SAVED_TREND = '[Comphub/Trends Landing Card] Load Saved Trend';
export const LOAD_SAVED_TREND_SUCCESS = '[Comphub/Trends Landing Card] Load Saved Trend Success';
export const LOAD_SAVED_TREND_ERROR = '[Comphub/Trends Landing Card] Load Saved Trend Error';

export class GetNewExchangeParticipants implements Action {
  readonly type = GET_NEW_EXCHANGE_PARTICIPANTS;
  constructor(public payload: number) {}
}

export class GetNewExchangeParticipantsSuccess implements Action {
  readonly type = GET_NEW_EXCHANGE_PARTICIPANTS_SUCCESS;
  constructor(public payload: string[]) {}
}

export class GetNewExchangeParticipantsError implements Action {
 readonly type = GET_NEW_EXCHANGE_PARTICIPANTS_ERROR;
 constructor() {}
}

export class GetOrgIncCountHistory implements Action {
  readonly type = GET_ORG_INC_COUNT_HISTORY;
  constructor(public payload: number) {}
}

export class GetOrgIncCountHistorySuccess implements Action {
  readonly type = GET_ORG_INC_COUNT_HISTORY_SUCCESS;

  constructor(public payload: any[]) {}
}

export class GetOrgIncCountHistoryError implements Action {
  readonly type = GET_ORG_INC_COUNT_HISTORY_ERROR;
}

export class DeleteSavedTrend implements Action {
  readonly type = DELETE_SAVED_TREND;
  constructor(public payload: string) {}
}

export class DeleteSavedTrendSuccess implements Action {
  readonly type = DELETE_SAVED_TREND_SUCCESS;
  constructor() {}
}

export class DeleteSavedTrendError implements Action {
  readonly type = DELETE_SAVED_TREND_ERROR;
  constructor() {}
}
export class SetSelectedTrendId implements Action {
  readonly type = SET_SELECTED_TREND_ID;
  constructor(public payload: number) {}
}
export class LoadSavedTrend implements Action {
  readonly type = LOAD_SAVED_TREND;
  constructor(public payload: number) {}
}

export class LoadSavedTrendSuccess implements Action {
  readonly type = LOAD_SAVED_TREND_SUCCESS;
  constructor(public payload: PeerTrendResponse) {}
}

export class LoadSavedTrendError implements Action {
  readonly type = LOAD_SAVED_TREND_ERROR;
  constructor() {}
}

export type Actions
  = GetNewExchangeParticipants
| GetNewExchangeParticipantsSuccess
| GetNewExchangeParticipantsError
| GetOrgIncCountHistory
| GetOrgIncCountHistorySuccess
| GetOrgIncCountHistoryError
| DeleteSavedTrend
| DeleteSavedTrendSuccess
| DeleteSavedTrendError
| SetSelectedTrendId
| LoadSavedTrend
| LoadSavedTrendSuccess
| LoadSavedTrendError;
