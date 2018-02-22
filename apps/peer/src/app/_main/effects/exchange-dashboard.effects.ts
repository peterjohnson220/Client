import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/switchMap';

import { ExchangeApiService, ExchangeCompanyApiService } from 'libs/data/payfactors-api';
import { Exchange, ChartItem } from 'libs/models';

import * as fromExchangeDashboardActions from '../actions/exchange-dashboard.actions';

@Injectable()
export class ExchangeDashboardEffects {

  @Effect()
  loadExchange$: Observable<Action> = this.actions$
    .ofType(fromExchangeDashboardActions.LOADING_EXCHANGE)
    .switchMap((action: fromExchangeDashboardActions.LoadingExchange) =>
      this.exchangeApiService.getExchange(action.payload)
        .map((exchange: Exchange) => {
          return new fromExchangeDashboardActions.LoadingExchangeSuccess(exchange);
        })
        .catch(() => of(new fromExchangeDashboardActions.LoadingExchangeError()))
    );


  @Effect()
  loadChart$: Observable<Action> = this.actions$
    .ofType(fromExchangeDashboardActions.LOADING_CHART)
    .switchMap((action: fromExchangeDashboardActions.LoadingChart) =>
      this.exchangeCompanyApiService.getChart(action.payload)
        .map((chartItems: ChartItem[]) => {
          return new fromExchangeDashboardActions.LoadingChartSuccess(chartItems);
        })
        .catch(() => of(new fromExchangeDashboardActions.LoadingChartError()))
    );

  constructor(
    private actions$: Actions,
    private exchangeApiService: ExchangeApiService,
    private exchangeCompanyApiService: ExchangeCompanyApiService
  ) {}
}


