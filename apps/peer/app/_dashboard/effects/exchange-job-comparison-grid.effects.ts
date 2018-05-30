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

import * as fromExchangeJobComparisonGridActions from '../actions/exchange-job-comparison-grid.actions';
import * as fromDashboardReducer from '../reducers';
import * as fromSharedPeerReducer from '../../shared/reducers';

@Injectable()
export class ExchangeJobComparisonGridEffects {

  @Effect()
  loadExchangeJobMappings$: Observable<Action> = this.actions$
    .ofType(fromExchangeJobComparisonGridActions.LOAD_EXCHANGE_JOB_COMPARISONS)
    .withLatestFrom(
      this.store.select(fromDashboardReducer.getExchangeJobComparisonsGridState),
      this.sharedPeerStore.select(fromSharedPeerReducer.getExchangeId),
      (action, listState, exchangeId) => {
        return {exchangeId, listState};
      })
    .switchMap(payload =>
      this.exchangeCompanyApiService.getExchangeJobComparisonList(payload.exchangeId, payload.listState)
        .map((gridDataResult: GridDataResult) => {
          return new fromExchangeJobComparisonGridActions.LoadExchangeJobComparisonsSuccess(gridDataResult);
        })
        .catch(() => of(new fromExchangeJobComparisonGridActions.LoadExchangeJobComparisonsError))
    );

  constructor(
    private actions$: Actions,
    private exchangeCompanyApiService: ExchangeCompanyApiService,
    private store: Store<fromDashboardReducer.State>,
    private sharedPeerStore: Store<fromSharedPeerReducer.State>
  ) {}
}


