import { Action } from '@ngrx/store';

import { ProjectSearchContext } from '../models';

export const SET_PROJECT_SEARCH_CONTEXT = '[Project Add Data/Search Page] Set Project Search Context';

export class SetProjectSearchContext implements Action {
  readonly type = SET_PROJECT_SEARCH_CONTEXT;

  constructor(public payload: ProjectSearchContext) {}
}

export type Actions
  = SetProjectSearchContext;
