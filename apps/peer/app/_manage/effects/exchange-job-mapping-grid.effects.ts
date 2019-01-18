import { Injectable } from '@angular/core';

import { Action, Store } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { Observable, of } from 'rxjs';
import { concatMap, map, switchMap, catchError, withLatestFrom } from 'rxjs/operators';

import { ExchangeCompanyApiService } from 'libs/data/payfactors-api';
import { ExchangeRequestTypeEnum } from 'libs/models/peer/requests';

import * as fromExchangeJobMappingGridActions from '../actions/exchange-job-mapping-grid.actions';
import * as fromExchangeJobInfoActions from '../actions/exchange-job-mapping-info.actions';
import * as fromExchangeRequestActions from '../../shared/actions/exchange-request.actions';
import * as fromPeerManageReducer from '../reducers/';
import * as fromSharedPeerReducer from '../../shared/reducers';

@Injectable()
export class ExchangeJobMappingGridEffects {

  @Effect()
  successfulExchangeJobRequest: Observable<Action> = this.actions$
    .ofType(`${ExchangeRequestTypeEnum.PayfactorsJob}_${fromExchangeRequestActions.CREATE_EXCHANGE_REQUEST_SUCCESS}`)
    .pipe(
      withLatestFrom(this.store.select(fromPeerManageReducer.getLoadExchangeJobMappingGridRequest), (action, payload) => payload),
      switchMap(payload => of(new fromExchangeJobMappingGridActions.LoadExchangeJobMappings()))
    );

  @Effect()
  loadExchangeJobMappings$: Observable<Action> = this.actions$
    .ofType(fromExchangeJobMappingGridActions.LOAD_EXCHANGE_JOB_MAPPINGS).pipe(
      withLatestFrom(
        this.store.select(fromPeerManageReducer.getExchangeJobMappingsGridState),
        this.sharedPeerStore.select(fromSharedPeerReducer.getExchangeId),
        (action, listState, exchangeId) => {
          return { exchangeId, listState };
        }
      ),
      switchMap(payload =>
        this.exchangeCompanyApiService.getExchangeJobsWithMappings(payload.exchangeId, payload.listState).pipe(
          map((gridDataResult: GridDataResult) => {
            return new fromExchangeJobMappingGridActions.LoadExchangeJobMappingsSuccess(gridDataResult);
          }),
          catchError((f) => of(new fromExchangeJobMappingGridActions.LoadExchangeJobMappingsError())))
      )
    );

  @Effect()
  loadExchangeJobMappingsAfterMap$: Observable<Action> = this.actions$
    .ofType(fromExchangeJobMappingGridActions.LOAD_EXCHANGE_JOB_MAPPINGS_AFTER_MAP).pipe(
      withLatestFrom(this.store.select(fromPeerManageReducer.getLoadExchangeJobMappingGridRequest), (action, payload) => payload),
      switchMap(payload =>
        this.exchangeCompanyApiService.getExchangeJobsWithMappings(payload.exchangeId, payload.listState).pipe(
          concatMap((gridDataResult: GridDataResult) => {
            return [
              new fromExchangeJobMappingGridActions.LoadExchangeJobMappingsSuccess(gridDataResult),
              new fromExchangeJobMappingGridActions.ReSetActiveExchangeJob()
            ];
          }),
          catchError(() => of(new fromExchangeJobMappingGridActions.LoadExchangeJobMappingsError())))
      )
    );

  @Effect()
  reselectExchangeJobMapping$: Observable<Action> = this.actions$
    .ofType(fromExchangeJobInfoActions.LOAD_MAPPED_COMPANY_JOBS_SUCCESS)
    .pipe(
      withLatestFrom(
        this.store.select(fromPeerManageReducer.getFirstCompanyJobMappingFromSelectedExchangeJob),
        (action, payload) => payload
      ),

      switchMap(payload => of(new fromExchangeJobInfoActions.SetActiveMapping(payload)))
    );

  constructor(
    private actions$: Actions,
    private exchangeCompanyApiService: ExchangeCompanyApiService,
    private store: Store<fromPeerManageReducer.State>,
    private sharedPeerStore: Store<fromSharedPeerReducer.State>
  ) { }
}
