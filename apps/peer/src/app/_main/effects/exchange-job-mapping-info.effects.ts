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
import * as fromPeerMainReducer from '../reducers';
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

  @Effect({ dispatch: false })
  applyMapping$ = this.actions$
    .ofType(fromExchangeJobMappingInfoActions.APPLY_MAPPING)
    .map((action: fromExchangeJobMappingInfoActions.ApplyMapping) => action.payload)
    .switchMap(payload =>
      this.exchangeCompanyApiService.upsertExchangeJobMap(payload)
        .map(() => {
          this.exchangeJobMappingService.loadExchangeJobMappingsAfterMap(payload.ExchangeId);
        })
        .catch(() => {
          return of(this.store.dispatch(new fromExchangeJobMappingInfoActions.ApplyMappingError()));
        })
    );


  constructor(private actions$: Actions,
              private store: Store<fromPeerMainReducer.State>,
              private exchangeCompanyApiService: ExchangeCompanyApiService,
              private exchangeJobMappingService: ExchangeJobMappingService) {
  }
}
