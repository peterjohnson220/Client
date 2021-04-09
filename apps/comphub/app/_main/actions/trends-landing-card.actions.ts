import { Action } from '@ngrx/store';

export const GET_NEW_EXCHANGE_PARTICIPANTS = '[Comphub/Trends Landing Card] Get New Exchange Participants';
export const GET_NEW_EXCHANGE_PARTICIPANTS_SUCCESS = '[Comphub/Trends Landing Card] Get New Exchange Participants Success';
export const GET_NEW_EXCHANGE_PARTICIPANTS_ERROR = '[Comphub/Trends Landing Card] Get New Exchange Participants Error';

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

export type Actions
  = GetNewExchangeParticipants
| GetNewExchangeParticipantsSuccess
| GetNewExchangeParticipantsError;
