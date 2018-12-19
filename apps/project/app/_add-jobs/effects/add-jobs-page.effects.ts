import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { mergeMap, withLatestFrom, map, tap, catchError, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

import { ProjectApiService } from 'libs/data/payfactors-api/project';
import * as fromSearchResultsActions from 'libs/features/search/actions/search-results.actions';
import * as fromSearchPageActions from 'libs/features/search/actions/search-page.actions';
import { WindowCommunicationService } from 'libs/core/services';

import * as fromAddJobsPageActions from '../actions/add-jobs.page.actions';

import * as fromAddJobsReducer from '../reducers';

@Injectable()
export class AddJobsPageEffects {

  @Effect()
  setContext$ = this.actions$
    .ofType(fromAddJobsPageActions.SET_CONTEXT)
    .pipe(
      mergeMap(() =>
        [ new fromSearchResultsActions.GetResults({ keepFilteredOutOptions: false }), new fromSearchPageActions.ShowPage() ]
      ));

  @Effect()
  addJobs$ = this.actions$
    .ofType(fromAddJobsPageActions.ADD_SELECTED_JOBS)
    .pipe(
      withLatestFrom(
        this.store.select(fromAddJobsReducer.getContext),
        this.store.select(fromAddJobsReducer.getSelectedPaymarkets),
        this.store.select(fromAddJobsReducer.getSelectedJobIds),
        this.store.select(fromAddJobsReducer.getSelectedPayfactorsJobCodes),
        (action: fromAddJobsPageActions.AddSelectedJobs, context, payMarkets, selectedJobIds, selectedJobCodes) =>
          ({ action, context, payMarkets, selectedJobIds, selectedJobCodes })
      ),
      switchMap((contextData) => {
        const companyJobIds = contextData.selectedJobIds.map(j => Number(j));
          return this.addJobsApiService.addJobs(contextData.context.ProjectId, {
            CompanyPayMarketIds: contextData.payMarkets,
            CompanyJobIds: companyJobIds,
            PayfactorsJobCodes: contextData.selectedJobCodes
          })
            .pipe(
              mergeMap(() => [
                  new fromAddJobsPageActions.AddSelectedJobsSuccess(),
                  new fromSearchPageActions.CloseSearchPage()
                ]
              ),
              catchError(() => of(new fromAddJobsPageActions.AddSelectedJobsError()))
            );
        }
      )
    );

  @Effect({dispatch: false})
  addProjectJobsSuccess$ = this.actions$
    .ofType(fromAddJobsPageActions.ADD_SELECTED_JOBS_SUCCESS)
    .pipe(
      tap((action: fromAddJobsPageActions.AddSelectedJobsSuccess) => {
        this.windowCommunicationService.postMessage(action.type);
      })
    );

  constructor(
    private actions$: Actions,
    private windowCommunicationService: WindowCommunicationService,
    private addJobsApiService: ProjectApiService,
    private store: Store<fromAddJobsReducer.State>
  ) {
  }
}
