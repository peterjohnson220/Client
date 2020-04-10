import { Action } from '@ngrx/store';

export const TOGGLE_TAB = '[Total Rewards/Statement List] Toggle Tab';

export class ToggleTab implements Action {
  readonly type = TOGGLE_TAB;
}

export type StatementListPageActions = ToggleTab;
