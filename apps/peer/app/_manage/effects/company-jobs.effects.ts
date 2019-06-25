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
        (action: fromCompanyJobsActions.LoadCompanyJobs, gridState, searchTerm, exchangeId) =>
          ({ action, gridState, searchTerm, exchangeId })
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
      this.store.pipe(
        select(fromReducers.getCompanyJobsExchangeJobsTitleSearchTerm)),
        (action, titleSearchTerm) => titleSearchTerm
    ),
    // grab the description search term
    withLatestFrom(
      this.store.pipe(
        select(fromReducers.getCompanyJobsExchangeJobsDescriptionSearchTerm)),
        (titleSearchTerm, descriptionSearchTerm) => ({ titleSearchTerm, descriptionSearchTerm })
    ),
    // grab the exchange Id
    withLatestFrom(
      this.store.pipe(
        select(fromReducers.getCompanyJobsExchangeId)),
        (searchTerms, exchangeId) => ({ ...searchTerms, exchangeId } as ExchangeJobsSearchParams)
    ),
    switchMap((combined: ExchangeJobsSearchParams) =>
      this.exchangeCompanyApiService.GetAssociableExchangeJobs(combined).pipe(
        map((exchangeJobs) => new fromCompanyJobsActions.SearchExchangeJobsSuccess(exchangeJobs)),
        catchError(() => of(new fromCompanyJobsActions.SearchExchangeJobsError())
      )
    ))
  );

  // make an association
  @Effect()
  saveAssociation$: Observable<Action> = this.actions$.pipe(
    ofType(fromCompanyJobsActions.SAVE_ASSOCIATION),
    switchMap((action: any) =>
      this.exchangeCompanyApiService.upsertExchangeJobMap(action.payload).pipe(
        mergeMap(() => [
          new fromCompanyJobsActions.SaveAssociationSuccess(),
          new fromCompanyJobsActions.LoadMappedExchangeJobs(action.payload.CompanyJobId),
          new fromCompanyJobsActions.LoadCompanyJobs()
        ]),
        catchError(() => of(new fromCompanyJobsActions.SaveAssociationError())
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
