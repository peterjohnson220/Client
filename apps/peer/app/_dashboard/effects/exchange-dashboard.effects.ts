import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';

import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { ExchangeApiService, ExchangeCompanyApiService } from 'libs/data/payfactors-api';
import { ChartItem } from 'libs/models';
import * as fromExchangeListActions from 'libs/features/peer/list/actions/exchange-list.actions';
import { ExchangeListItem } from 'libs/models';

import * as fromExchangeDashboardActions from '../actions/exchange-dashboard.actions';

@Injectable()
export class ExchangeDashboardEffects {
  @Effect()
  loadCompanyChart$: Observable<Action> = this.actions$
    .ofType(fromExchangeDashboardActions.LOADING_COMPANY_CHART).pipe(
      switchMap((action: fromExchangeDashboardActions.LoadingCompanyChart) =>
        this.exchangeCompanyApiService.getChart(action.payload).pipe(
          map((chartItems: ChartItem[]) => {
            return new fromExchangeDashboardActions.LoadingCompanyChartSuccess(chartItems);
          }),
          catchError(() => of(new fromExchangeDashboardActions.LoadingCompanyChartError()))
        )
      )
    );

  @Effect()
  loadJobChart$: Observable<Action> = this.actions$
    .ofType(fromExchangeDashboardActions.LOADING_JOB_CHART).pipe(
      switchMap((action: fromExchangeDashboardActions.LoadingJobChart) =>
        this.exchangeCompanyApiService.getChart(action.payload).pipe(
          map((chartItems: ChartItem[]) => {
            return new fromExchangeDashboardActions.LoadingJobChartSuccess(chartItems);
          }),
          catchError(() => of(new fromExchangeDashboardActions.LoadingJobChartError()))
        )
      )
    );

  @Effect()
  loadIndustryChart$: Observable<Action> = this.actions$
    .ofType(fromExchangeDashboardActions.LOADING_INDUSTRY_CHART).pipe(
      switchMap((action: fromExchangeDashboardActions.LoadingIndustryChart) =>
        this.exchangeCompanyApiService.getChart(action.payload).pipe(
          map((chartItems: ChartItem[]) => {
            return new fromExchangeDashboardActions.LoadingIndustryChartSuccess(chartItems);
          }),
          catchError(() => of(new fromExchangeDashboardActions.LoadingIndustryChartError()))
        )
      )
    );

  @Effect()
  loadJobFamilyChart$: Observable<Action> = this.actions$
    .ofType(fromExchangeDashboardActions.LOADING_JOB_FAMILY_CHART).pipe(
      switchMap((action: fromExchangeDashboardActions.LoadingJobFamilyChart) =>
        this.exchangeCompanyApiService.getChart(action.payload).pipe(
          map((chartItems: ChartItem[]) => {
            return new fromExchangeDashboardActions.LoadingJobFamilyChartSuccess(chartItems);
          }),
          catchError(() => of(new fromExchangeDashboardActions.LoadingJobFamilyChartError()))
        )
      )
    );

  @Effect()
  loadRevenueChart$: Observable<Action> = this.actions$
    .ofType(fromExchangeDashboardActions.LOADING_REVENUE_CHART).pipe(
      switchMap((action: fromExchangeDashboardActions.LoadingRevenueChart) =>
        this.exchangeCompanyApiService.getChart(action.payload).pipe(
          map((chartItems: ChartItem[]) => {
            return new fromExchangeDashboardActions.LoadingRevenueChartSuccess(chartItems);
          }),
          catchError(() => of(new fromExchangeDashboardActions.LoadingRevenueChartError()))
        )
      )
    );

  @Effect()
  loadDetailChart$: Observable<Action> = this.actions$
    .ofType(fromExchangeDashboardActions.LOADING_DETAIL_CHART).pipe(
      switchMap((action: fromExchangeDashboardActions.LoadingDetailChart) =>
        this.exchangeCompanyApiService.getDetailChart(action.payload).pipe(
          map((chartItems: ChartItem[]) => {
            return new fromExchangeDashboardActions.LoadingDetailChartSuccess(chartItems);
          }),
          catchError(() => of(new fromExchangeDashboardActions.LoadingDetailChartError()))
        )
      )
    );

  @Effect()
  loadExchanges$: Observable<Action> = this.actions$
    .ofType(fromExchangeListActions.LOADING_EXCHANGES).pipe(
      switchMap(() =>
        this.exchangeCompanyApiService.getExchanges().pipe(
          map((exchangeListItems: ExchangeListItem[]) => {
            return new fromExchangeListActions.LoadingExchangesSuccess(exchangeListItems);
          }),
          catchError(() => of(new fromExchangeListActions.LoadingExchangesError()))
        )
      )
    );

  constructor(
    private actions$: Actions,
    private exchangeApiService: ExchangeApiService,
    private exchangeCompanyApiService: ExchangeCompanyApiService
  ) {}
}


