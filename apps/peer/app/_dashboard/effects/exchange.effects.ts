import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';

import { Observable } from 'rxjs';
import { mergeMap, map, filter } from 'rxjs/operators';

import { GetChartRequest, ExchangeChartTypeEnum } from 'libs/models';

import * as fromExchangeDashboardActions from '../actions/exchange-dashboard.actions';
import * as fromSharedPeerExchangeActions from '../../shared/actions/exchange.actions';
import * as fromExchangeJobComparisonGridActions from '../actions/exchange-job-comparison-grid.actions';

@Injectable()
export class ExchangeEffects {
  @Effect()
  loadExchange$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromSharedPeerExchangeActions.LOAD_EXCHANGE_SUCCESS),
      filter((action: fromSharedPeerExchangeActions.LoadExchangeSuccess) => action.payload.path === 'dashboard'),
      map((action: fromSharedPeerExchangeActions.LoadExchangeSuccess): GetChartRequest => {
        return { ExchangeId: action.payload.exchange.ExchangeId, ChartType: ''};
      }),
      mergeMap((getChartRequest) => [
        new fromExchangeDashboardActions.LoadCompanyChart({...getChartRequest, ChartType: ExchangeChartTypeEnum.Company}),
        new fromExchangeDashboardActions.LoadIndustryChart({...getChartRequest, ChartType: ExchangeChartTypeEnum.Industry}),
        new fromExchangeDashboardActions.LoadRevenueChart({...getChartRequest, ChartType: ExchangeChartTypeEnum.Revenue}),
        new fromExchangeDashboardActions.LoadJobFamilyChart({...getChartRequest, ChartType: ExchangeChartTypeEnum.Family}),
        new fromExchangeDashboardActions.LoadJobChart({...getChartRequest, ChartType: ExchangeChartTypeEnum.Job}),
        new fromExchangeJobComparisonGridActions.LoadExchangeJobComparisons(),
        new fromExchangeDashboardActions.CloseSidebar()
      ])
    );

  constructor(
    private actions$: Actions
  ) { }
}


