import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { mergeMap } from 'rxjs/operators';

import * as fromSearchResultsActions from 'libs/features/search/actions/search-results.actions';
import * as fromSearchPageActions from 'libs/features/search/actions/search-page.actions';

import * as fromAddJobsPageActions from '../actions/add-jobs.page.actions';

import * as fromAddJobsReducer from '../reducers';

@Injectable()
export class AddJobsPageEffects {

  @Effect()
  setContext = this.actions$
    .ofType(fromAddJobsPageActions.SET_CONTEXT)
    .pipe(
      mergeMap(() =>
        [ new fromSearchResultsActions.GetResults({ keepFilteredOutOptions: false }), new fromSearchPageActions.ShowPage() ]
      ));

  constructor(
    private actions$: Actions,
    private store: Store<fromAddJobsReducer.State>
  ) {
  }
}
