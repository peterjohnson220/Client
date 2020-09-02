import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { Action, select, Store } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, switchMap, withLatestFrom, filter, mergeMap } from 'rxjs/operators';
import { GridDataResult } from '@progress/kendo-angular-grid';

import { ExchangeCompanyApiService } from 'libs/data/payfactors-api/peer';
import { JobDescriptionApiService } from 'libs/data/payfactors-api/jdm';
import { JobsApiService } from 'libs/data/payfactors-api/jobs';
import { ExchangeJob } from 'libs/features/peer/job-association/models/exchange-job.model';
import { PermissionService } from 'libs/core/services';
import { PermissionCheckEnum, Permissions } from 'libs/constants';

import { ExchangeJobsSearchParams } from '../models/exchange-jobs-search-params.model';
import * as fromCompanyJobsActions from '../actions/company-jobs.actions';
import * as fromReducers from '../reducers';

@Injectable()
export class CompanyJobsEffects {

  @Effect()
  loadCompanyJobs$: Observable<Action> = this.actions$.pipe(
    ofType(fromCompanyJobsActions.LOAD_COMPANY_JOBS),
    // grab grid state and search term
    withLatestFrom(
      this.store.pipe(select(fromReducers.getCompanyJobsGridState)),
      this.store.pipe(select(fromReducers.getCompanyJobsSearchTerm)),
      this.store.pipe(select(fromReducers.getCompanyJobsExchangeId)),
        (action, gridState, searchTerm, exchangeId) => ({ action, gridState, searchTerm, exchangeId })
    ),
    // make the call to the api service, then fire a success/failure action
    switchMap(combined => (
      this.exchangeCompanyApiService.GetActiveCompanyJobsWithMatchedExchangeJob(combined.gridState, [],
        combined.searchTerm, combined.exchangeId).pipe(
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

  // get exchange job with description and other props for display in detail panel
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

  // check if a company job has jdm descriptions
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

  // download a jdm description as a PDF
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

  // search for exchange jobs in detail panel
  @Effect()
  searchExchangeJobs$: Observable<Action> = this.actions$.pipe(
    ofType(fromCompanyJobsActions.SEARCH_EXCHANGE_JOBS),
     // grab the title search term
    withLatestFrom(
      this.store.pipe(select(fromReducers.getCompanyJobsExchangeJobsTitleSearchTerm)),
      this.store.pipe(select(fromReducers.getCompanyJobsExchangeJobsDescriptionSearchTerm)),
      this.store.pipe(select(fromReducers.getCompanyJobsExchangeId)),
        (action, titleSearchTerm, descriptionSearchTerm, exchangeId) => ({ titleSearchTerm, descriptionSearchTerm, exchangeId })
    ),
    switchMap((combined: ExchangeJobsSearchParams) =>
      this.exchangeCompanyApiService.GetAssociableExchangeJobs(combined).pipe(
        map((exchangeJobs) => new fromCompanyJobsActions.SearchExchangeJobsSuccess(exchangeJobs)),
        catchError(() => of(new fromCompanyJobsActions.SearchExchangeJobsError())
      )
    ))
  );

  // make a new association or approve a pending association
  @Effect()
  createAssociation$: Observable<Action> = this.actions$.pipe(
    ofType(fromCompanyJobsActions.CREATE_ASSOCIATION),
    switchMap((action: fromCompanyJobsActions.CreateAssociation) =>
      this.exchangeCompanyApiService.upsertExchangeJobMap(action.payload).pipe(
        mergeMap(() => [
          new fromCompanyJobsActions.CreateAssociationSuccess(),
          new fromCompanyJobsActions.LoadMappedExchangeJobs(action.payload.CompanyJobId),
          new fromCompanyJobsActions.LoadCompanyJobs()
        ]),
        catchError(() => of(new fromCompanyJobsActions.CreateAssociationError())
      )
    ))
  );

  // update a pending association to be approved
  @Effect()
  approvePendingAssociation$: Observable<Action> = this.actions$.pipe(
    ofType(fromCompanyJobsActions.APPROVE_PENDING_MATCH),
    switchMap((action: fromCompanyJobsActions.ApprovePendingMatch) =>
      this.exchangeCompanyApiService.approvePendingExchangeJobMapping(action.payload).pipe(
        mergeMap(() => [
          new fromCompanyJobsActions.ApprovePendingMatchSuccess(),
          new fromCompanyJobsActions.LoadCompanyJobs()
        ]),
        catchError(() => of(new fromCompanyJobsActions.UnmatchError())
      )
    ))
  );

  // remove a match
  @Effect()
  deleteAssociation$: Observable<Action> = this.actions$.pipe(
    ofType(fromCompanyJobsActions.UNMATCH),
    // grab the latest company job so that on success it can be used as the search term for finding a new match
    withLatestFrom(
      this.store.pipe(
        select(fromReducers.getCompanyJobsSelectedCompanyJob)),
        (action, selectedCompanyJob) => ({ action, selectedCompanyJob })
    ),
    switchMap((combined: any) =>
      this.exchangeCompanyApiService.deleteExchangeJobMappingByIds(combined.action.payload).pipe(
        mergeMap(() => [
          new fromCompanyJobsActions.UnmatchSuccess(),
          new fromCompanyJobsActions.LoadCompanyJobs(),
          new fromCompanyJobsActions.UpdateExchangeJobsTitleSearchTerm(combined.selectedCompanyJob.JobTitle),
          new fromCompanyJobsActions.SearchExchangeJobs()
        ]),
        catchError(() => of(new fromCompanyJobsActions.UnmatchError())
      )
    ))
  );

  @Effect()
  createProject$: Observable<Action> = this.actions$.pipe(
    ofType(fromCompanyJobsActions.CREATE_PROJECT),
    switchMap((data: any) => {
      return this.jobsApiService.createProject(data.payload).pipe(
        mergeMap((projectId: number) => {
          window.location.href = `/marketdata/marketdata.asp?usersession_id=${projectId}&show_peer_exchange=true`;
          return [];
        }),
        catchError(() => of(new fromCompanyJobsActions.CreateProjectError()))
        );
    })
  );

  constructor(
    private actions$: Actions,
    private store: Store<fromReducers.State>,
    private exchangeCompanyApiService: ExchangeCompanyApiService,
    private jobsApiService: JobsApiService,
    private permissionService: PermissionService,
    private jobDescriptionApiService: JobDescriptionApiService
  ) {}
}
