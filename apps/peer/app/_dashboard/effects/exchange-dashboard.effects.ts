import { Injectable } from '@angular/core';

import { Action, Store } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { ExchangeCompanyApiService, ExchangeDataSearchApiService, ExchangeApiService } from 'libs/data/payfactors-api';
import { ChartItem, ExchangeListItem } from 'libs/models';

import * as fromExchangeDashboardActions from '../actions/exchange-dashboard.actions';
import * as fromExchangeListActions from 'apps/admin/app/_peer/actions/exchange-list.actions';
import * as fromDashboardReducer from '../reducers';

@Injectable()
export class ExchangeDashboardEffects {
  @Effect()
  loadCompanyChart$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromExchangeDashboardActions.LOAD_COMPANY_CHART),
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
    .pipe(
      ofType(fromExchangeDashboardActions.LOAD_JOB_CHART),
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
    .pipe(
      ofType(fromExchangeDashboardActions.LOAD_INDUSTRY_CHART),
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
    .pipe(
      ofType(fromExchangeDashboardActions.LOAD_JOB_FAMILY_CHART),
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
    .pipe(
      ofType(fromExchangeDashboardActions.LOAD_REVENUE_CHART),
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
    .pipe(
      ofType(fromExchangeDashboardActions.LOAD_DETAIL_CHART),
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
    .pipe(
      ofType(fromExchangeListActions.LOAD_EXCHANGES),
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
      .pipe(
        ofType(fromExchangeDashboardActions.LOAD_MAP_COUNT),
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
    .pipe(
      ofType(fromExchangeDashboardActions.LOAD_EXCHANGE_JOB_ORGS),
      map((action: fromExchangeDashboardActions.LoadExchangeJobOrgs) => action.payload),
      switchMap((payload) =>
        this.exchangeCompanyApiService.getExchangeJobOrgs(payload.selectedExchangeJobComparison.ExchangeJobId, payload.selectedMarket).pipe(
          map((orgs: ChartItem[]) => {
            return new fromExchangeDashboardActions.LoadExchangeJobOrgsSuccess(orgs);
          }),
          catchError(() => of(new fromExchangeDashboardActions.LoadExchangeJobOrgsError()))
        )
      )
    );

  @Effect()
  exportExchangeJobs$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromExchangeDashboardActions.EXPORT_EXCHANGE_JOBS),
      switchMap((action: fromExchangeDashboardActions.ExportExchangeJobs) =>
        this.exchangeApiService.exportExchangeJobs(action.payload.exchangeId).pipe(
          map(() => {
            return new fromExchangeDashboardActions.ExportExchangeJobsSuccess();
          }),
          catchError(() => of(new fromExchangeDashboardActions.ExportExchangeJobsError()))
        )
      )
    );

  constructor(
    private actions$: Actions,
    private store: Store<fromDashboardReducer.State>,
    private exchangeCompanyApiService: ExchangeCompanyApiService,
    private exchangeDataSearchApiService: ExchangeDataSearchApiService,
    private exchangeApiService: ExchangeApiService
  ) {}
}


