import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import {switchMap, map, tap, mergeMap} from 'rxjs/operators';

import { SurveySearchApiService } from 'libs/data/payfactors-api';
import { WindowCommunicationService } from 'libs/core/services';

import * as fromMultiMatchPageActions from '../actions/multi-match-page.actions';
import * as fromSearchFiltersActions from '../actions/search-filters.actions';
import * as fromAddDataReducer from '../reducers';

import * as fromSearchActions from '../actions/search.actions';
import {buildLockedCountryCodeFilter} from '../helpers';

@Injectable()
export class MultiMatchPageEffects {

  @Effect()
  getProjectSearchContext$ = this.actions$
    .ofType(fromMultiMatchPageActions.GET_PROJECT_SEARCH_CONTEXT)
    .pipe(
      map((action: fromMultiMatchPageActions.GetProjectSearchContext) => action.payload),
      switchMap((projectContext) => {
        return this.surveySearchApiService.getProjectSearchContext(projectContext.ProjectId)
          .pipe(
            mergeMap(response => {
                const actions = [];
                const searchContext = {
                  CountryCode: response.CountryCode,
                  CurrencyCode: response.CurrencyCode,
                  PayMarketId: response.PaymarketId,
                  ProjectId: response.ProjectId,
                  RestrictToCountryCode: projectContext.RestrictToCountryCode
                };
                actions.push(new fromSearchActions.SetProjectSearchContext(searchContext));
                actions.push(new fromSearchFiltersActions.GetDefaultScopesFilter());
                if (projectContext.RestrictToCountryCode) {
                  actions.push(new fromSearchFiltersActions.AddFilter(buildLockedCountryCodeFilter(searchContext)));
                }
                return actions;
              }
            )
          );
        }
      )
    );

  @Effect({dispatch: false})
  closeMultimatchApp$ = this.actions$
    .ofType(fromMultiMatchPageActions.CLOSE_MULTI_MATCH)
    .pipe(
      tap((action: fromMultiMatchPageActions.CloseMultiMatch) => {
        this.windowCommunicationService.postMessage(action.type);
      })
    );

    constructor(
      private actions$: Actions,
      private surveySearchApiService: SurveySearchApiService,
      private store: Store<fromAddDataReducer.State>,
      private windowCommunicationService: WindowCommunicationService
  ) {}
}
