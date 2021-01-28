import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { map, tap } from 'rxjs/operators';

import { WindowCommunicationService } from 'libs/core/services';
import * as fromSearchPageActions from 'libs/features/search/search/actions/search-page.actions';
import * as fromSearchFeatureActions from 'libs/features/search/search/actions/search-feature.actions';

import { SearchFeaturePersistenceService } from '../services';

@Injectable()
export class SearchPageEffects {

  @Effect({dispatch: false})
  closeSurveySearch$ = this.actions$
    .pipe(
      ofType(fromSearchPageActions.CLOSE_SEARCH_PAGE),
      tap((action: fromSearchPageActions.CloseSearchPage) => {
        this.windowCommunicationService.postMessage(action.type);
      })
    );

  @Effect()
  setSearchFeatureId$ = this.actions$.pipe(
    ofType(fromSearchFeatureActions.SET_SEARCH_FEATURE_ID),
    tap((action: fromSearchFeatureActions.SetSearchFeatureId) => {
      this.searchFeaturePersistenceService.set(action.payload);
    }),
    map((action: fromSearchFeatureActions.SetSearchFeatureId) => new fromSearchPageActions.SetSearchFeatureId(action.payload))
  );

  @Effect({dispatch: false})
  resetSearchFeatureId$ = this.actions$.pipe(
    ofType(fromSearchFeatureActions.RESET_SEARCH_FEATURE_ID),
    tap((action: fromSearchFeatureActions.ResetSearchFeatureId) => this.searchFeaturePersistenceService.reset(action.payload))
  );

  constructor(
    private actions$: Actions,
    private windowCommunicationService: WindowCommunicationService,
    private searchFeaturePersistenceService: SearchFeaturePersistenceService
  ) {}
}
