import { Injectable } from '@angular/core';
import { Action, select, Store } from '@ngrx/store';
import { HttpErrorResponse } from '@angular/common/http';

import { Effect, Actions, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, mergeMap, switchMap, withLatestFrom, filter } from 'rxjs/operators';

import { PermissionCheckEnum, Permissions } from 'libs/constants';

import * as fromCompanyJobsActions from '../actions/company-jobs.actions';
import * as fromReducer from '../reducers';
import { ExchangeCompanyApiService } from '../../../../data/payfactors-api/peer';
import { JobDescriptionApiService } from '../../../../data/payfactors-api/jdm';
import { PermissionService } from 'libs/core/services';

@Injectable()
export class CompanyJobsEffects {
  @Effect()
  init$: Observable<Action> = this.actions$.pipe(
    ofType(fromCompanyJobsActions.LOAD),
    mergeMap(() => [new fromCompanyJobsActions.LoadCompanyJobs()])
  );

  @Effect()
  loadCompanyJobs$: Observable<Action> = this.actions$.pipe(
    ofType(fromCompanyJobsActions.LOAD_COMPANY_JOBS),
    // grab list state
    withLatestFrom(
      this.store.pipe(
        select(fromReducer.getCompanyJobsGridState)),
      (action, listState) => listState
    ),
    withLatestFrom(this.store.pipe(
      select(fromReducer.getCompanyJobIdFilters)),
      (listState, companyJobIds) => ({listState, companyJobIds})
    ),
    withLatestFrom(this.store.pipe(select(fromReducer.getCompanyJobsSearchTerm)),
      ({listState, companyJobIds}, searchTerm) => ({listState, companyJobIds, searchTerm})
    ),
    // make the call to the api service, then fire a success/failure action
    switchMap(combined => (
      this.exchangeCompanyApiService.getActiveCompanyJobs(
          combined.listState, combined.companyJobIds, combined.searchTerm).pipe(
            map((grid) => new fromCompanyJobsActions.LoadCompanyJobsSuccess(grid)),
        catchError((error: HttpErrorResponse ) => {
          if (error.status === 400) {
            return of(new fromCompanyJobsActions.LoadCompanyJobsBadRequest(error.error.Message));
          } else {
            return of(new fromCompanyJobsActions.LoadCompanyJobsError(error.error.Message));
          }
        })
      )
    ))
  );

  @Effect()
  loadJdmDescriptionIds$: Observable<Action> = this.actions$.pipe(
    ofType(fromCompanyJobsActions.SELECT_COMPANY_JOB_FOR_DETAIL_PANEL),
    filter(() => this.permissionService.CheckPermission([Permissions.JOB_DESCRIPTIONS], PermissionCheckEnum.Single)),
    switchMap((action: fromCompanyJobsActions.SelectJobTitleOrCode) =>
      this.jobDescriptionApiService.getJobDescriptionIds(action.payload.CompanyJobId).pipe(
        map((jdmDescriptionIds: number[]) => new fromCompanyJobsActions.LoadJdmDescriptionIdsComplete(jdmDescriptionIds)),
        catchError(() => of(new fromCompanyJobsActions.LoadJdmDescriptionIdsComplete([]))
      )
    ))
  );

  @Effect()
  downloadJdmDescription$: Observable<Action> = this.actions$.pipe(
    ofType(fromCompanyJobsActions.DOWNLOAD_JDM_DESCRIPTION),
    // if we're downloading the PDF there is only be 1 jdm description id, so grab it and send in the request
    withLatestFrom(this.store.pipe(
      select(fromReducer.getCompanyJobsJdmDescriptionIds)),
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
    private store: Store<fromReducer.State>,
    private exchangeCompanyApiService: ExchangeCompanyApiService,
    private jobDescriptionApiService: JobDescriptionApiService,
    private permissionService: PermissionService
  ) {}
}
