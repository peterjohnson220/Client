import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { WindowCommunicationService } from 'libs/core/services';
import * as fromUserFilterActions from 'libs/features/user-filter/actions/user-filter.actions';
import * as fromSearchPageActions from 'libs/features/search/actions/search-page.actions';
import * as fromCompanySettingsActions from 'libs/state/app-context/actions/company-settings.actions';
import { ProjectApiService } from 'libs/data/payfactors-api/project';
import * as fromPaymarketReducer from 'libs/features/add-jobs/reducers';

import * as fromJobBasedRangesAddJobsModalActions from '../actions/job-based-ranges-add-jobs-modal.actions';
import * as fromStructuresReducer from '../reducers';

@Injectable()
export class JobBasedRangesAddJobsModalEffects {
  @Effect()
  setContext$ = this.actions$
    .pipe(
      ofType(fromJobBasedRangesAddJobsModalActions.SET_CONTEXT),
      mergeMap(() =>
        [new fromUserFilterActions.Init()]
      ));

  @Effect()
  addJobs$ = this.actions$
    .pipe(
      ofType(fromJobBasedRangesAddJobsModalActions.ADD_SELECTED_JOBS),
      withLatestFrom(
        this.store.select(fromStructuresReducer.getContext),
        this.store.select(fromPaymarketReducer.getSelectedPaymarkets),
        this.store.select(fromStructuresReducer.getSelectedJobIds),
        this.store.select(fromStructuresReducer.getSelectedPayfactorsJobCodes),
        (action: fromJobBasedRangesAddJobsModalActions.AddSelectedJobs, context, payMarkets, selectedJobIds, selectedJobCodes) =>
          ({action, context, payMarkets, selectedJobIds, selectedJobCodes})
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
                  new fromJobBasedRangesAddJobsModalActions.AddSelectedJobsSuccess(),
                  new fromSearchPageActions.CloseSearchPage()
                ]
              ),
              catchError(error => of(new fromJobBasedRangesAddJobsModalActions.AddSelectedJobsError(error)))
            );
        }
      )
    );

  @Effect({dispatch: false})
  addProjectJobsSuccess$ = this.actions$
    .pipe(
      ofType(fromJobBasedRangesAddJobsModalActions.ADD_SELECTED_JOBS_SUCCESS),
      tap((action: fromJobBasedRangesAddJobsModalActions.AddSelectedJobsSuccess) => {
        this.windowCommunicationService.postMessage(action.type);
      }),
      map(() => new fromCompanySettingsActions.LoadCompanySettings())
    );

  @Effect()
  closeSurveySearch$ = this.actions$
    .pipe(
      ofType(fromSearchPageActions.CLOSE_SEARCH_PAGE),
      mergeMap(() =>
        [new fromJobBasedRangesAddJobsModalActions.CloseAddJobsModal()]
      ));

  constructor(
    private actions$: Actions,
    private windowCommunicationService: WindowCommunicationService,
    private projectApiService: ProjectApiService,
    private store: Store<fromStructuresReducer.State>
  ) {
  }
}
