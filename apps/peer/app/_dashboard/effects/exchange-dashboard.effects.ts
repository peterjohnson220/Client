import { Injectable } from '@angular/core';
import {Action, Store} from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';

import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { ExchangeCompanyApiService, ExchangeDataSearchApiService } from 'libs/data/payfactors-api';
import { ChartItem, ExchangeListItem } from 'libs/models';

import * as fromExchangeDashboardActions from '../actions/exchange-dashboard.actions';
import * as fromExchangeListActions from 'apps/admin/app/_peer/actions/exchange-list.actions';
import * as fromDashboardReducer from '../reducers';

@Injectable()
export class ExchangeDashboardEffects {
  @Effect()
  loadCompanyChart$: Observable<Action> = this.actions$
    .ofType(fromExchangeDashboardActions.LOAD_COMPANY_CHART).pipe(
      switchMap((action: fromExchangeDashboardActions.LoadCompanyChart) =>
        this.exchangeCompanyApiService.getChart(action.payload).pipe(
          map((chartItems: ChartItem[]) => {
            return new fromExchangeDashboardActions.LoadCompanyChartSuccess(chartItems);
          }),
          catchError(() => of(new fromExchangeDashboardActions.LoadCompanyChartError()))
        )
      )
    );

  @Effect()
  loadJobChart$: Observable<Action> = this.actions$
    .ofType(fromExchangeDashboardActions.LOAD_JOB_CHART).pipe(
      switchMap((action: fromExchangeDashboardActions.LoadJobChart) =>
        this.exchangeCompanyApiService.getChart(action.payload).pipe(
          map((chartItems: ChartItem[]) => {
            return new fromExchangeDashboardActions.LoadJobChartSuccess(chartItems);
          }),
          catchError(() => of(new fromExchangeDashboardActions.LoadJobChartError()))
        )
      )
    );

  @Effect()
  loadIndustryChart$: Observable<Action> = this.actions$
    .ofType(fromExchangeDashboardActions.LOAD_INDUSTRY_CHART).pipe(
      switchMap((action: fromExchangeDashboardActions.LoadIndustryChart) =>
        this.exchangeCompanyApiService.getChart(action.payload).pipe(
          map((chartItems: ChartItem[]) => {
            return new fromExchangeDashboardActions.LoadIndustryChartSuccess(chartItems);
          }),
          catchError(() => of(new fromExchangeDashboardActions.LoadIndustryChartError()))
        )
      )
    );

  @Effect()
  loadJobFamilyChart$: Observable<Action> = this.actions$
    .ofType(fromExchangeDashboardActions.LOAD_JOB_FAMILY_CHART).pipe(
      switchMap((action: fromExchangeDashboardActions.LoadJobFamilyChart) =>
        this.exchangeCompanyApiService.getChart(action.payload).pipe(
          map((chartItems: ChartItem[]) => {
            return new fromExchangeDashboardActions.LoadJobFamilyChartSuccess(chartItems);
          }),
          catchError(() => of(new fromExchangeDashboardActions.LoadJobFamilyChartError()))
        )
      )
    );

  @Effect()
  loadRevenueChart$: Observable<Action> = this.actions$
    .ofType(fromExchangeDashboardActions.LOAD_REVENUE_CHART).pipe(
      switchMap((action: fromExchangeDashboardActions.LoadRevenueChart) =>
        this.exchangeCompanyApiService.getChart(action.payload).pipe(
          map((chartItems: ChartItem[]) => {
            return new fromExchangeDashboardActions.LoadRevenueChartSuccess(chartItems);
          }),
          catchError(() => of(new fromExchangeDashboardActions.LoadRevenueChartError()))
        )
      )
    );

  @Effect()
  loadDetailChart$: Observable<Action> = this.actions$
    .ofType(fromExchangeDashboardActions.LOAD_DETAIL_CHART).pipe(
      switchMap((action: fromExchangeDashboardActions.LoadDetailChart) =>
        this.exchangeCompanyApiService.getDetailChart(action.payload).pipe(
          map((chartItems: ChartItem[]) => {
            return new fromExchangeDashboardActions.LoadDetailChartSuccess(chartItems);
          }),
          catchError(() => of(new fromExchangeDashboardActions.LoadDetailChartError()))
        )
      )
    );

  @Effect()
  loadExchanges$: Observable<Action> = this.actions$
    .ofType(fromExchangeListActions.LOAD_EXCHANGES).pipe(
      switchMap(() =>
        this.exchangeCompanyApiService.getExchanges().pipe(
          map((exchangeListItems: ExchangeListItem[]) => {
            return new fromExchangeListActions.LoadExchangesSuccess(exchangeListItems);
          }),
          catchError(() => of(new fromExchangeListActions.LoadExchangesError()))
        )
      )
    );

    @Effect()
    loadMapCount$: Observable<Action> = this.actions$
      .ofType(fromExchangeDashboardActions.LOAD_MAP_COUNT).pipe(
        map((action: fromExchangeDashboardActions.LoadMapCount) => action.exchangeId),
        switchMap((payload: number) =>
        this.exchangeDataSearchApiService.getMapHasData(payload).pipe(
          map((resp: any) =>
              new fromExchangeDashboardActions.LoadMapCountSuccess(resp.HasMapData)),
          catchError(() => of(new fromExchangeDashboardActions.LoadMapCountError()))
        )
      )
    );


  @Effect()
  loadExchangeJobOrgs$: Observable<Action> = this.actions$
    .ofType(fromExchangeDashboardActions.LOAD_EXCHANGE_JOB_ORGS).pipe(
      map((action: fromExchangeDashboardActions.LoadExchangeJobOrgs) => action),
      switchMap((action) =>
        this.exchangeCompanyApiService.getExchangeJobOrgs(action.payload.ExchangeJobId).pipe(
          map((orgs: string[]) => {
            return new fromExchangeDashboardActions.LoadExchangeJobOrgsSuccess(orgs);
          }),
          catchError(() => of(new fromExchangeDashboardActions.LoadExchangeJobOrgsError()))
        )
      )
    );

  constructor(
    private actions$: Actions,
    private store: Store<fromDashboardReducer.State>,
    private exchangeCompanyApiService: ExchangeCompanyApiService,
    private exchangeDataSearchApiService: ExchangeDataSearchApiService
  ) {}
}


