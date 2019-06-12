import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { Action, select, Store } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, switchMap, withLatestFrom, filter, tap } from 'rxjs/operators';
import { GridDataResult } from '@progress/kendo-angular-grid';

import { ExchangeCompanyApiService } from 'libs/data/payfactors-api/peer';
import { JobDescriptionApiService } from 'libs/data/payfactors-api/jdm';
import { ExchangeJob } from 'libs/features/peer/job-association/models/exchange-job.model';
import { PermissionService } from 'libs/core/services';
import { PermissionCheckEnum, Permissions } from 'libs/constants';

import * as fromCompanyJobsActions from '../actions/company-jobs.actions';
import * as fromReducers from '../reducers';

@Injectable()
export class CompanyJobsEffects {

  @Effect()
  loadCompanyJobs$: Observable<Action> = this.actions$.pipe(
    ofType(fromCompanyJobsActions.LOAD_COMPANY_JOBS),
    // grab grid state
    withLatestFrom(
      this.store.pipe(
        select(fromReducers.getCompanyJobsGridState)),
        (action, gridState) => gridState
    ),
    // grab the search term
    withLatestFrom(
      this.store.pipe(
        select(fromReducers.getCompanyJobsSearchTerm)),
        (gridState, searchTerm) => ({ gridState, searchTerm })
    ),
    // make the call to the api service, then fire a success/failure action
    switchMap(combined => (
      this.exchangeCompanyApiService.getActiveCompanyJobs(combined.gridState, [], combined.searchTerm).pipe(
        map((gridDataResult: GridDataResult) => new fromCompanyJobsActions.LoadCompanyJobsSuccess(gridDataResult)),
        catchError((error: HttpErrorResponse ) => {
          if (error.status === 400 && error.error.Message.includes('Paging')) {
            return of(new fromCompanyJobsActions.LoadCompanyJobsPagingError(error.error.Message));
          } else {
            return of(new fromCompanyJobsActions.LoadCompanyJobsError());
          }
        })
      )
    ))
  );

  @Effect()
  loadJdmDescriptionIds$: Observable<Action> = this.actions$.pipe(
    ofType(fromCompanyJobsActions.SET_SELECTED_COMPANY_JOB),
    // make sure we're setting a job in the payload, and the user has the required permissions to view jdm descriptions
    filter((action: any) => action.payload),
    filter(() => this.permissionService.CheckPermission([Permissions.JOB_DESCRIPTIONS], PermissionCheckEnum.All)),
    switchMap((action: fromCompanyJobsActions.SetSelectedCompanyJob) =>
      this.jobDescriptionApiService.getJobDescriptionIds(action.payload.CompanyJobId).pipe(
        map((jdmDescriptionIds: number[]) => new fromCompanyJobsActions.LoadJdmDescriptionIdsComplete(jdmDescriptionIds)),
        catchError(() => of(new fromCompanyJobsActions.LoadJdmDescriptionIdsComplete([]))
      )
    ))
  );

  @Effect()
  loadMappedExchangeJobs$: Observable<Action> = this.actions$.pipe(
    ofType(fromCompanyJobsActions.LOAD_MAPPED_EXCHANGE_JOBS),
    switchMap((action: fromCompanyJobsActions.LoadMappedExchangeJobs) =>
      this.exchangeCompanyApiService.getAssociatedExchangeJobs(action.payload).pipe(
        map((exchangeJobs: ExchangeJob[]) => new fromCompanyJobsActions.LoadMappedExchangeJobsSuccess(exchangeJobs)),
        catchError(() => of(new fromCompanyJobsActions.LoadMappedExchangeJobsError())
      )
    ))
  );

  @Effect()
  downloadJdmDescription$: Observable<Action> = this.actions$.pipe(
    ofType(fromCompanyJobsActions.DOWNLOAD_JDM_DESCRIPTION),
    // if we're downloading the PDF there is only be 1 jdm description id, so grab it and send in the request
    withLatestFrom(this.store.pipe(
      select(fromReducers.getCompanyJobsJdmDescriptionIds)),
      (action, jdmDescriptionIds: number[]) => jdmDescriptionIds[0]
    ),
    switchMap((jdmDescriptionId: number) =>
      this.jobDescriptionApiService.downloadPdf(jdmDescriptionId).pipe(
        map(() => new fromCompanyJobsActions.DownloadJdmDescriptionSuccess()),
        catchError(() => of(new fromCompanyJobsActions.DownloadJdmDescriptionError())
      )
    ))
  );

  constructor(
    private actions$: Actions,
    private store: Store<fromReducers.State>,
    private exchangeCompanyApiService: ExchangeCompanyApiService,
    private permissionService: PermissionService,
    private jobDescriptionApiService: JobDescriptionApiService
  ) {}
}
