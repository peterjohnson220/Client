import { Injectable } from '@angular/core';

import { Action, Store } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { catchError, switchMap, map, concatMap } from 'rxjs/operators';

import { ExchangeCompanyApiService, CompanyJobApiService } from 'libs/data/payfactors-api';
import { CompanyJobToMapTo } from 'libs/models/peer';
import { LatestCompanyJob } from 'libs/models';

import * as fromExchangeJobInfoActions from '../actions/exchange-job-mapping-info.actions';
import * as fromExchangeJobMappingGridActions from '../actions/exchange-job-mapping-grid.actions';
import * as fromPeerManagementReducer from '../reducers';

@Injectable()
export class ExchangeJobMappingInfoEffects {

  @Effect()
  loadCompanyJobsToMapToByQuery$: Observable<Action> = this.actions$.pipe(
    ofType(fromExchangeJobInfoActions.LOAD_COMPANY_JOBS_TO_MAP_TO_BY_QUERY),
    map((action: fromExchangeJobInfoActions.LoadCompanyJobsToMapToByQuery) => action.payload),
    switchMap(payload =>
      this.companyJobApiService.getTopCompanyJobsToMapTo(payload.exchangeId,
        payload.jobTitleAndCodeQuery, payload.jobDescriptionQuery).pipe(
          map((companyJobsToMapTo: CompanyJobToMapTo[]) => {
            return new fromExchangeJobInfoActions.LoadCompanyJobsToMapToByQuerySuccess(companyJobsToMapTo);
          }),
          catchError(() => of(new fromExchangeJobInfoActions.LoadCompanyJobsToMapToByQueryError())))
    )
  );

  @Effect()
  loadMappedCompanyJobs$: Observable<Action> = this.actions$.pipe(
    ofType(fromExchangeJobInfoActions.LOAD_MAPPED_COMPANY_JOBS),
    map((action: fromExchangeJobInfoActions.LoadMappedCompanyJobs) => action.payload),
    switchMap(payload =>
      this.companyJobApiService.getCompanyJobs(payload).pipe(
        map((companyJobsToMapTo: LatestCompanyJob[]) => {
          return new fromExchangeJobInfoActions.LoadMappedCompanyJobsSuccess(companyJobsToMapTo);
        }),
        catchError(() => of(new fromExchangeJobInfoActions.LoadMappedCompanyJobsError()))
      )
    )
  );

  @Effect()
  applyMapping$ = this.actions$.pipe(
    ofType(fromExchangeJobInfoActions.APPLY_MAPPING),
    map((action: fromExchangeJobInfoActions.ApplyMapping) => action.payload),
    switchMap(payload =>
      this.exchangeCompanyApiService.upsertExchangeJobMap(payload).pipe(
        concatMap((response) => {
          return [
            new fromExchangeJobMappingGridActions.LoadExchangeJobMappingsAfterMap(),
            new fromExchangeJobInfoActions.ApplyMappingSuccess()
          ];
        }),
        catchError(() => {
          return of(this.store.dispatch(new fromExchangeJobInfoActions.ApplyMappingError()));
        })
      )
    )
  );

  @Effect()
  deleteMappingConfirmation$ = this.actions$.pipe(
    ofType(fromExchangeJobInfoActions.DELETE_MAPPING),
    map((action: fromExchangeJobInfoActions.DeleteMapping) => action.payload),
    switchMap(payload =>
      this.exchangeCompanyApiService.deleteExchangeJobMapping(payload.exchangeJobToCompanyJobId).pipe(
        concatMap(() => {
          return [
            new fromExchangeJobMappingGridActions.LoadExchangeJobMappingsAfterMap(),
            new fromExchangeJobInfoActions.DeleteMappingSuccess()
          ];
        }),
        catchError(() => {
          return of(new fromExchangeJobInfoActions.DeleteMappingError());
        })
      ))
  );

  constructor(private actions$: Actions,
    private store: Store<fromPeerManagementReducer.State>,
    private exchangeCompanyApiService: ExchangeCompanyApiService,
    private companyJobApiService: CompanyJobApiService) {
  }
}
