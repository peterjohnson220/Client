import { Action } from '@ngrx/store';

import { ExchangeJobSearchOption } from 'libs/models/peer/ExchangeJobSearchOption';

export const SET_SELECTED_JOBS = '[Comphub/Peer Trends Data/Jobs Card Jobs Card] Set Selected Jobs';
export const CLEAR_SELECTED_JOBS = '[Comphub/Peer Trends Data/Jobs Card Jobs Card] Clear Selected Jobs';

export class SetSelectedJobs implements Action {
  readonly type = SET_SELECTED_JOBS;
  constructor(public payload: ExchangeJobSearchOption[]) {}
}

export class ClearSelectedJobs implements Action {
  readonly type = CLEAR_SELECTED_JOBS;
}

export type Actions
  = SetSelectedJobs
  | ClearSelectedJobs;
