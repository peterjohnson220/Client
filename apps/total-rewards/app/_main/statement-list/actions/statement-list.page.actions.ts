import { Action } from '@ngrx/store';

export const TOGGLE_TAB = '[Total Rewards/Statement List] Toggle Tab';
export const SET_TAB = '[Total Rewards/Statement List] Set Tab';

export class ToggleTab implements Action {
  readonly type = TOGGLE_TAB;
}

export class SetTab implements Action {
  readonly type = SET_TAB;
  constructor(public payload: 'Statements' | 'Templates') { }
}

export type StatementListPageActions = ToggleTab | SetTab;
