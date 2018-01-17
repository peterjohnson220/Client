import { Injectable } from '@angular/core';

import { Action } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';
import { GridDataResult } from '@progress/kendo-angular-grid';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/mergeMap';

import { ExchangeCompanyApiService } from 'libs/data/payfactors-api';

import * as fromExchangeJobMappingActions from '../actions/exchange-job-mapping.actions';

@Injectable()
export class ExchangeJobMappingEffects {

  @Effect()
  loadExchangeJobMappings$: Observable<Action> = this.actions$
    .ofType(fromExchangeJobMappingActions.LOADING_EXCHANGE_JOB_MAPPINGS)
    .map((action: fromExchangeJobMappingActions.LoadingExchangeJobMappings) => action.payload)
    .switchMap(payload =>
      this.exchangeCompanyApiService.getExchangeJobsWithMappings(payload.exchangeId, payload.query, payload.listState)
        .map((gridDataResult: GridDataResult) => {
          return new fromExchangeJobMappingActions.LoadingExchangeJobMappingsSuccess(gridDataResult);
        })
        .catch(() => of(new fromExchangeJobMappingActions.LoadingExchangeJobMappingsError()))
    );

  constructor(
    private actions$: Actions,
    private exchangeCompanyApiService: ExchangeCompanyApiService
  ) {}
}


