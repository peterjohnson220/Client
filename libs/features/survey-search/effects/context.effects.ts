import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { map } from 'rxjs/operators';

import * as fromSearchPageActions from 'libs/features/search/actions/search-page.actions';

import * as fromContextActions from '../actions/context.actions';

@Injectable()
export class ContextEffects {

  @Effect()
  setProjectContext$ = this.actions$
    .pipe(
      ofType(fromContextActions.SET_PROJECT_SEARCH_CONTEXT, fromContextActions.SET_MODIFY_PRICINGS_SEARCH_CONTEXT),
      map(() => {
        return new fromSearchPageActions.ShowPage();
      })
    );

  constructor(
    private actions$: Actions
  ) {}
}
