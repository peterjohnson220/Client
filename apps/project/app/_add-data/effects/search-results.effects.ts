import { Injectable } from '@angular/core';

import { Actions, Effect } from '@ngrx/effects';

import * as fromSearchResultsActions from '../actions/search-results.actions';
import { AddDataEffectsService } from '../services';

@Injectable()
export class SearchResultsEffects {

  @Effect()
  searchSurveyJobsOnGetMoreResults$ = this.addDataEffectsService.searchSurveyJobs(
    this.actions$.ofType(fromSearchResultsActions.GET_MORE_RESULTS)
  );

  @Effect()
  getResults$ = this.addDataEffectsService.searchSurveyJobs(
    this.actions$.ofType(fromSearchResultsActions.GET_RESULTS)
  );

  constructor(
    private actions$: Actions,
    private addDataEffectsService: AddDataEffectsService
  ) {}
}
