import { Injectable } from '@angular/core';

import { Action, Store } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { catchError, switchMap, map, concatMap } from 'rxjs/operators';

import { ExchangeCompanyApiService } from 'libs/data/payfactors-api';
import { CompanyJobToMapTo } from 'libs/models/peer';

import * as fromExchangeJobMappingInfoActions from '../actions/exchange-job-mapping-info.actions';
import * as fromExchangeJobMappingGridActions from '../actions/exchange-job-mapping-grid.actions';
import * as fromPeerManagementReducer from '../reducers';

@Injectable()
export class ExchangeJobMappingInfoEffects {

  @Effect()
  loadCompanyJobsToMapToByQuery$: Observable<Action> = this.actions$.pipe(
    ofType(fromExchangeJobMappingInfoActions.LOAD_COMPANY_JOBS_TO_MAP_TO_BY_QUERY),
    map((action: fromExchangeJobMappingInfoActions.LoadCompanyJobsToMapToByQuery) => action.payload),
    switchMap(payload =>
      this.exchangeCompanyApiService.getTopCompanyJobsToMapTo(payload.exchangeId,
        payload.jobTitleAndCodeQuery, payload.jobDescriptionQuery).pipe(
          map((companyJobsToMapTo: CompanyJobToMapTo[]) => {
            return new fromExchangeJobMappingInfoActions.LoadCompanyJobsToMapToByQuerySuccess(companyJobsToMapTo);
          }),
          catchError(() => of(new fromExchangeJobMappingInfoActions.LoadCompanyJobsToMapToByQueryError())))
    )
  );


  @Effect()
  applyMapping$ = this.actions$.pipe(
    ofType(fromExchangeJobMappingInfoActions.APPLY_MAPPING),
    map((action: fromExchangeJobMappingInfoActions.ApplyMapping) => action.payload),
    switchMap(payload =>
      this.exchangeCompanyApiService.upsertExchangeJobMap(payload).pipe(
        concatMap((response) => {
          return [
            new fromExchangeJobMappingGridActions.LoadExchangeJobMappingsAfterMap(),
            new fromExchangeJobMappingInfoActions.ApplyMappingSuccess()
          ];
        }),
        catchError(() => {
          return of(this.store.dispatch(new fromExchangeJobMappingInfoActions.ApplyMappingError()));
        })
      )
    )
  );

  @Effect()
  deleteMappingConfirmation$ = this.actions$.pipe(
    ofType(fromExchangeJobMappingInfoActions.DELETE_MAPPING),
    map((action: fromExchangeJobMappingInfoActions.DeleteMapping) => action.payload),
    switchMap(payload =>
      this.exchangeCompanyApiService.deleteExchangeJobMapping(payload.exchangeJobToCompanyJobId).pipe(
        concatMap(() => {
          return [
            new fromExchangeJobMappingGridActions.LoadExchangeJobMappingsAfterMap(),
            new fromExchangeJobMappingInfoActions.DeleteMappingSuccess()
          ];
        }),
        catchError(() => {
          return of(new fromExchangeJobMappingInfoActions.DeleteMappingError());
        })
      ))
  );

  constructor(private actions$: Actions,
    private store: Store<fromPeerManagementReducer.State>,
    private exchangeCompanyApiService: ExchangeCompanyApiService) {
  }
}
