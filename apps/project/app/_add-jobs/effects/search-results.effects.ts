import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { Actions, Effect } from '@ngrx/effects';
import { map } from 'rxjs/operators';

import * as fromAddJobsReducer from '../reducers';
import * as fromSearchResultsActions from '../actions/search-results.actions';
import { JobResult, generateMockPayFactorsJobResult } from '../models';

@Injectable()
export class SearchResultsEffects {

  @Effect()
  getMoreResults$ = this.actions$
    .ofType(fromSearchResultsActions.GET_MORE_RESULTS)
    .pipe(
      map(() => {
        const results: JobResult[] = [ generateMockPayFactorsJobResult() ];
        return new fromSearchResultsActions.GetMoreResultsSuccess(results);
      })
    );
  constructor(
    private store: Store<fromAddJobsReducer.State>,
    private actions$: Actions
  ) {}
}
