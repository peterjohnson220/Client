import { Action } from '@ngrx/store';

export const SET_TAB = '[Total Rewards/Statement List] Set Tab';

export class SetTab implements Action {
  readonly type = SET_TAB;
  constructor(public payload: 'Statements' | 'Templates') { }
}

export type StatementListPageActions = SetTab;
