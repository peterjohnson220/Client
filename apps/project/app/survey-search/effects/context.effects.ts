import { Injectable } from '@angular/core';

import { Actions, Effect } from '@ngrx/effects';
import { map } from 'rxjs/operators';

import * as fromSearchPageActions from 'libs/features/search/actions/search-page.actions';

import * as fromContextActions from '../actions/context.actions';

@Injectable()
export class ContextEffects {

  @Effect()
  setProjectContext$ = this.actions$
    .ofType(fromContextActions.SET_PROJECT_SEARCH_CONTEXT)
    .pipe(
      map(() => {
        return new fromSearchPageActions.ShowPage();
      })
    );

  constructor(
    private actions$: Actions
  ) {}
}
