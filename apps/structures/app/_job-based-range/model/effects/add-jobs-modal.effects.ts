import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { WindowCommunicationService } from 'libs/core/services';
import { ProjectApiService } from 'libs/data/payfactors-api/project';
import * as fromUserFilterActions from 'libs/features/user-filter/actions/user-filter.actions';
import * as fromCompanySettingsActions from 'libs/state/app-context/actions/company-settings.actions';
import * as fromAddJobsPageActions from 'libs/features/add-jobs/actions/add-jobs-page.actions';
import * as fromAddJobsModalActions from 'libs/features/add-jobs/actions/modal.actions';
import * as fromAddJobsReducer from 'libs/features/add-jobs/reducers';

@Injectable()
export class AddJobsModalEffects {
  @Effect()
  setContext$ = this.actions$
    .pipe(
      ofType(fromAddJobsPageActions.SET_CONTEXT),
      mergeMap(() =>
        [new fromUserFilterActions.Init()]
      ));

  @Effect()
  addJobs$ = this.actions$
    .pipe(
      ofType(fromAddJobsPageActions.ADD_SELECTED_JOBS),
      withLatestFrom(
        this.store.select(fromAddJobsReducer.getContext),
        this.store.select(fromAddJobsReducer.getSelectedPaymarkets),
        this.store.select(fromAddJobsReducer.getSelectedJobIds),
        this.store.select(fromAddJobsReducer.getSelectedPayfactorsJobCodes),
        (action: fromAddJobsPageActions.AddSelectedJobs, context, payMarkets, selectedJobIds, selectedJobCodes) =>
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
                  new fromAddJobsPageActions.AddSelectedJobsSuccess(),
                  new fromAddJobsModalActions.HandlePageComplete()
                ]
              ),
              catchError(error => of(new fromAddJobsPageActions.AddSelectedJobsError(error)))
            );
        }
      )
    );

  @Effect({dispatch: false})
  addProjectJobsSuccess$ = this.actions$
    .pipe(
      ofType(fromAddJobsPageActions.ADD_SELECTED_JOBS_SUCCESS),
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
