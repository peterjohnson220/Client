import { Injectable } from "@angular/core";

import { mergeMap } from "rxjs/operators";
import { Actions, Effect, ofType } from "@ngrx/effects";

import * as fromSearchPageActions from 'libs/features/search/actions/search-page.actions';

import * as fromSharedActions from '../../shared/actions/shared.actions';

@Injectable()
export class SearchPageEffects {

  @Effect()
  setIsNewModelAddJobs$ = this.actions$
    .pipe(
      ofType(fromSearchPageActions.CLOSE_SEARCH_PAGE),
      mergeMap(() =>
        [new fromSharedActions.SetIsNewModelAddJobs(false)]
      ));

  constructor(
    private actions$: Actions
  ) {
  }
}
