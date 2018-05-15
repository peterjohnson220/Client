import { Injectable } from '@angular/core';

import { Action, Store } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/mergeMap';

import { ExchangeCompanyApiService } from 'libs/data/payfactors-api';
import { ExchangeRequestTypeEnum } from 'libs/models/peer/requests';

import * as fromExchangeJobMappingGridActions from '../actions/exchange-job-mapping-grid.actions';
import * as fromExchangeJobMappingInfoActions from '../actions/exchange-job-mapping-info.actions';
import * as fromExchangeRequestActions from '../../shared/actions/exchange-request.actions';
import * as fromPeerMainReducer from '../reducers';

@Injectable()
export class ExchangeJobMappingGridEffects {

  @Effect()
  successfulExchangeJobRequest: Observable<Action> = this.actions$
    .ofType(`${ExchangeRequestTypeEnum.PayfactorsJob}_${fromExchangeRequestActions.CREATE_EXCHANGE_REQUEST_SUCCESS}`)
    .withLatestFrom(this.store.select(fromPeerMainReducer.getLoadExchangeJobMappingGridRequest), (action, payload) => payload)
    .switchMap(payload => of(new fromExchangeJobMappingGridActions.LoadExchangeJobMappings(payload)));

  @Effect()
  loadExchangeJobMappings$: Observable<Action> = this.actions$
    .ofType(fromExchangeJobMappingGridActions.LOAD_EXCHANGE_JOB_MAPPINGS)
    .map((action: fromExchangeJobMappingGridActions.LoadExchangeJobMappings) => action.payload)
    .switchMap(payload =>
      this.exchangeCompanyApiService.getExchangeJobsWithMappings(payload.exchangeId, payload.listState)
        .map((gridDataResult: GridDataResult) => {
          return new fromExchangeJobMappingGridActions.LoadExchangeJobMappingsSuccess(gridDataResult);
        })
        .catch(() => of(new fromExchangeJobMappingGridActions.LoadExchangeJobMappingsError()))
    );

  @Effect()
  loadExchangeJobMappingsAfterMap$: Observable<Action> = this.actions$
    .ofType(fromExchangeJobMappingGridActions.LOAD_EXCHANGE_JOB_MAPPINGS_AFTER_MAP)
    .map((action: fromExchangeJobMappingGridActions.LoadExchangeJobMappingsAfterMap) => action.payload)
    .switchMap(payload =>
      this.exchangeCompanyApiService.getExchangeJobsWithMappings(payload.exchangeId, payload.listState)
        .mergeMap((gridDataResult: GridDataResult) => {
          return [
            new fromExchangeJobMappingGridActions.LoadExchangeJobMappingsSuccess(gridDataResult),
            new fromExchangeJobMappingGridActions.ReSelectExchangeJobMapping(),
            new fromExchangeJobMappingInfoActions.ApplyMappingSuccess()
          ];
        })
        .catch(() => of(new fromExchangeJobMappingGridActions.LoadExchangeJobMappingsError()))
    );

  constructor(
    private actions$: Actions,
    private exchangeCompanyApiService: ExchangeCompanyApiService,
    private store: Store<fromPeerMainReducer.State>
  ) {}
}


