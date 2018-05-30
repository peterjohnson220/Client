import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/switchMap';

import { GetChartRequest, ExchangeChartTypeEnum } from 'libs/models';

import * as fromExchangeDashboardActions from '../actions/exchange-dashboard.actions';
import * as fromSharedPeerExchangeActions from '../../shared/actions/exchange.actions';
import * as fromExchangeJobComparisonGridActions from '../actions/exchange-job-comparison-grid.actions';

@Injectable()
export class ExchangeEffects {
  @Effect()
  loadExchange$: Observable<Action> = this.actions$
    .ofType(fromSharedPeerExchangeActions.LOAD_EXCHANGE_SUCCESS)
    .map((action: fromSharedPeerExchangeActions.LoadExchangeSuccess): GetChartRequest => {
      return { ExchangeId: action.payload.ExchangeId, ChartType: ''};
    })
    .mergeMap((getChartRequest) => [
      new fromExchangeDashboardActions.LoadingCompanyChart({...getChartRequest, ChartType: ExchangeChartTypeEnum.Company}),
      new fromExchangeDashboardActions.LoadingIndustryChart({...getChartRequest, ChartType: ExchangeChartTypeEnum.Industry}),
      new fromExchangeDashboardActions.LoadingRevenueChart({...getChartRequest, ChartType: ExchangeChartTypeEnum.Revenue}),
      new fromExchangeDashboardActions.LoadingJobFamilyChart({...getChartRequest, ChartType: ExchangeChartTypeEnum.Family}),
      new fromExchangeDashboardActions.LoadingJobChart({...getChartRequest, ChartType: ExchangeChartTypeEnum.Job}),
      new fromExchangeJobComparisonGridActions.LoadExchangeJobComparisons(),
      new fromExchangeDashboardActions.CloseSidebar()
    ]);

  constructor(
    private actions$: Actions
  ) {}
}


