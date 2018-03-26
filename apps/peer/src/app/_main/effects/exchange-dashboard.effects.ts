import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/switchMap';

import { ExchangeApiService, ExchangeCompanyApiService } from 'libs/data/payfactors-api';
import { Exchange, ChartItem, ExchangeCompany} from 'libs/models';

import * as fromExchangeDashboardActions from '../actions/exchange-dashboard.actions';

@Injectable()
export class ExchangeDashboardEffects {
  @Effect()
  loadIndustryChart$: Observable<Action> = this.actions$
    .ofType(fromExchangeDashboardActions.LOADING_INDUSTRY_CHART)
    .switchMap((action: fromExchangeDashboardActions.LoadingIndustryChart) =>
      this.exchangeCompanyApiService.getChart(action.payload)
        .map((chartItems: ChartItem[]) => {
          return new fromExchangeDashboardActions.LoadingIndustryChartSuccess(chartItems);
        })
        .catch(() => of(new fromExchangeDashboardActions.LoadingIndustryChartError()))
    );

  @Effect()
  loadJobFamilyChart$: Observable<Action> = this.actions$
    .ofType(fromExchangeDashboardActions.LOADING_JOB_FAMILY_CHART)
    .switchMap((action: fromExchangeDashboardActions.LoadingJobFamilyChart) =>
      this.exchangeCompanyApiService.getChart(action.payload)
        .map((chartItems: ChartItem[]) => {
          return new fromExchangeDashboardActions.LoadingJobFamilyChartSuccess(chartItems);
        })
        .catch(() => of(new fromExchangeDashboardActions.LoadingJobFamilyChartError()))
    );

  @Effect()
  loadRevenueChart$: Observable<Action> = this.actions$
    .ofType(fromExchangeDashboardActions.LOADING_REVENUE_CHART)
    .switchMap((action: fromExchangeDashboardActions.LoadingRevenueChart) =>
      this.exchangeCompanyApiService.getChart(action.payload)
        .map((chartItems: ChartItem[]) => {
          return new fromExchangeDashboardActions.LoadingRevenueChartSuccess(chartItems);
        })
        .catch(() => of(new fromExchangeDashboardActions.LoadingRevenueChartError()))
    );

  @Effect()
  loadDetailChart$: Observable<Action> = this.actions$
    .ofType(fromExchangeDashboardActions.LOADING_DETAIL_CHART)
    .switchMap((action: fromExchangeDashboardActions.LoadingDetailChart) =>
      this.exchangeCompanyApiService.getChart(action.payload)
        .map((chartItems: ChartItem[]) => {
          return new fromExchangeDashboardActions.LoadingDetailChartSuccess(chartItems);
        })
        .catch(() => of(new fromExchangeDashboardActions.LoadingDetailChartError()))
    );

  constructor(
    private actions$: Actions,
    private exchangeApiService: ExchangeApiService,
    private exchangeCompanyApiService: ExchangeCompanyApiService
  ) {}
}


