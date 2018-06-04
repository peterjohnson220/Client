import { Injectable } from '@angular/core';

import { Action, Store } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/mergeMap';

import { ExchangeCompanyApiService } from 'libs/data/payfactors-api';
import { CompanyJobToMapTo } from 'libs/models/peer';

import * as fromExchangeJobMappingInfoActions from '../actions/exchange-job-mapping-info.actions';
import * as fromExchangeJobMappingGridActions from '../actions/exchange-job-mapping-grid.actions';
import * as fromPeerManagementReducer from '../reducers';
import { ExchangeJobMappingService } from '../services';

@Injectable()
export class ExchangeJobMappingInfoEffects {

  @Effect()
  loadCompanyJobsToMapToByQuery$: Observable<Action> = this.actions$
    .ofType(fromExchangeJobMappingInfoActions.LOAD_COMPANY_JOBS_TO_MAP_TO_BY_QUERY)
    .map((action: fromExchangeJobMappingInfoActions.LoadCompanyJobsToMapToByQuery) => action.payload)
    .switchMap(payload =>
      this.exchangeCompanyApiService.getTopCompanyJobsToMapTo(payload.exchangeId, payload.query)
        .map((companyJobsToMapTo: CompanyJobToMapTo[]) => {
          return new fromExchangeJobMappingInfoActions.LoadCompanyJobsToMapToByQuerySuccess(companyJobsToMapTo);
        })
        .catch(() => of(new fromExchangeJobMappingInfoActions.LoadCompanyJobsToMapToByQueryError()))
    );

  @Effect()
  applyMapping$ = this.actions$
    .ofType(fromExchangeJobMappingInfoActions.APPLY_MAPPING)
    .map((action: fromExchangeJobMappingInfoActions.ApplyMapping) => action.payload)
    .switchMap(payload =>
      this.exchangeCompanyApiService.upsertExchangeJobMap(payload)
        .concatMap(() => {
          return [
            new fromExchangeJobMappingGridActions.LoadExchangeJobMappingsAfterMap(),
            new fromExchangeJobMappingInfoActions.ApplyMappingSuccess()
          ];
        })
        .catch(() => {
          return of(this.store.dispatch(new fromExchangeJobMappingInfoActions.ApplyMappingError()));
        })
    );

  @Effect()
  deleteMappingConfirmation$ = this.actions$
    .ofType(fromExchangeJobMappingInfoActions.DELETE_MAPPING)
    .map((action: fromExchangeJobMappingInfoActions.DeleteMapping) => action.payload)
    .switchMap(payload =>
      this.exchangeCompanyApiService.deleteExchangeJobMapping(payload.exchangeJobToCompanyJobId)
        .concatMap(() => {
          return [
            new fromExchangeJobMappingGridActions.LoadExchangeJobMappingsAfterMap(),
            new fromExchangeJobMappingInfoActions.DeleteMappingSuccess()
          ];
        })
        .catch(() => {
          return of(new fromExchangeJobMappingInfoActions.DeleteMappingError());
        })
    );

  constructor(private actions$: Actions,
              private store: Store<fromPeerManagementReducer.State>,
              private exchangeCompanyApiService: ExchangeCompanyApiService,
              private exchangeJobMappingService: ExchangeJobMappingService) {
  }
}
