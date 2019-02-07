import { Injectable } from '@angular/core';

import { Actions, Effect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { mergeMap, withLatestFrom, map, tap, catchError, switchMap } from 'rxjs/operators';

import { WindowCommunicationService } from 'libs/core/services';
import { ProjectApiService } from 'libs/data/payfactors-api/project';
import * as fromSearchPageActions from 'libs/features/search/actions/search-page.actions';
import * as fromUserFilterActions from 'libs/features/user-filter/actions/user-filter.actions';
import * as fromCompanySettingsActions from 'libs/state/app-context/actions/company-settings.actions';

import * as fromAddJobsPageActions from '../actions/add-jobs-page.actions';
import * as fromAddJobsReducer from '../reducers';

@Injectable()
export class AddJobsPageEffects {

  @Effect()
  setContext$ = this.actions$
    .ofType(fromAddJobsPageActions.SET_CONTEXT)
    .pipe(
      mergeMap(() =>
        [ new fromUserFilterActions.Init() ]
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
          return this.projectApiService.addJobs(contextData.context.ProjectId, {
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
              catchError(error => of(new fromAddJobsPageActions.AddSelectedJobsError(error)))
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
      }),
      map(() => new fromCompanySettingsActions.LoadCompanySettings())
    );

  constructor(
    private actions$: Actions,
    private windowCommunicationService: WindowCommunicationService,
    private projectApiService: ProjectApiService,
    private store: Store<fromAddJobsReducer.State>
  ) {
  }
}
