import { Injectable } from '@angular/core';
import { Location } from '@angular/common';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, catchError, switchMap, withLatestFrom, mergeMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import { DashboardApiService, CompanyJobApiService, ProjectApiService } from 'libs/data/payfactors-api';
import * as fromSearchPageActions from 'libs/features/search/search/actions/search-page.actions';
import { AddProjectJobsResponse } from 'libs/models/payfactors-api/project/response';
import { WindowCommunicationService } from 'libs/core/services';
import * as fromPaymarketReducer from 'libs/features/jobs/add-jobs/reducers';
import { PayfactorsAddJobsApiModelMapper } from 'libs/features/jobs/add-jobs/helpers';
import * as fromAddJobsReducer from 'libs/features/jobs/add-jobs/reducers';

import * as fromCreateNewJobPageActions from '../actions/create-new-job-page.actions';

@Injectable()
export class CreateNewJobPageEffects {

  @Effect()
  getJdmStatus$ = this.actions$
    .pipe(
      ofType(fromCreateNewJobPageActions.GET_JDM_STATUS),
      switchMap(() => {
          return this.dashboardApiService.getIsJdmEnabled()
            .pipe(
              map((response) => new fromCreateNewJobPageActions.GetJdmStatusSuccess(response)),
              catchError(() => of(new fromCreateNewJobPageActions.GetJdmStatusError()))
            );
        }
      )
    );

  @Effect()
  getJobFamilies$ = this.actions$
    .pipe(
      ofType(fromCreateNewJobPageActions.GET_JOB_FAMILIES),
      switchMap(() => {
          return this.companyJobApiService.getJobFamilies()
            .pipe(
              map((response) => new fromCreateNewJobPageActions.GetJobFamiliesSuccess(response)),
              catchError(() => of(new fromCreateNewJobPageActions.GetJobFamiliesError()))
            );
        }
      )
    );

  @Effect()
  createJob$ = this.actions$
    .pipe(
      ofType(fromCreateNewJobPageActions.CREATE_JOB),
      withLatestFrom(
        this.store.select(fromAddJobsReducer.getContext),
        this.store.select(fromPaymarketReducer.getSelectedPaymarkets),
        (action: fromCreateNewJobPageActions.CreateJob, context, selectedPayMarkets) => ({ action, context, selectedPayMarkets})
      ),
      switchMap(data => {
          return this.projectApiService.createNewJob(data.context.ProjectId,
            PayfactorsAddJobsApiModelMapper.buildCreateNewProjectJobRequest(data.action.payload, data.selectedPayMarkets))
            .pipe(
              mergeMap((response: AddProjectJobsResponse) => {
                const actions: any[] = [];

                if (response.JobExists) {
                  actions.push(new fromCreateNewJobPageActions.JobCodeExistsError());
                } else {
                  actions.push(new fromCreateNewJobPageActions.CreateJobSuccess());
                  actions.push(new fromSearchPageActions.CloseSearchPage());
                }

                return actions;
              }),
              catchError(() => of(new fromCreateNewJobPageActions.CreateJobError()))
            );
        }
      )
    );

  @Effect({dispatch: false})
  createJobSuccess$ = this.actions$
    .pipe(
      ofType(fromCreateNewJobPageActions.CREATE_JOB_SUCCESS),
      tap((action: fromCreateNewJobPageActions.CreateJobSuccess) => {
        this.windowCommunicationService.postMessage(action.type);
      })
    );

  constructor(
    private actions$: Actions,
    private dashboardApiService: DashboardApiService,
    private companyJobApiService: CompanyJobApiService,
    private projectApiService: ProjectApiService,
    private location: Location,
    private windowCommunicationService: WindowCommunicationService,
    private store: Store<fromAddJobsReducer.State>
  ) {
  }
}
