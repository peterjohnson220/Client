import { Injectable } from '@angular/core';

import { forkJoin, Observable, of } from 'rxjs';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, select, Store } from '@ngrx/store';
import { map, switchMap, catchError, withLatestFrom, mergeMap } from 'rxjs/operators';
import moment from 'moment';

import { CurrencyApiService, PricingApiService, UiPersistenceSettingsApiService } from 'libs/data/payfactors-api';
import { GetPricingHistoryRequest, PricingHistoryChartFilters, PayMarketPricingHistory, PricedPayMarket } from 'libs/models/payfactors-api';
import { FeatureAreaConstants, UiPersistenceSettingConstants } from 'libs/models';

import * as fromPricingHistoryChartActions from '../actions';
import * as fromPricingHistoryChartReducer from '../reducers';



@Injectable()
export class PricingHistoryChartEffects {

  constructor(
    private actions$: Actions,
    private pricingApiService: PricingApiService,
    private uiPersistenceSettingsApiService: UiPersistenceSettingsApiService,
    private currencyService: CurrencyApiService,
    private store: Store<fromPricingHistoryChartReducer.State>,
  ) { }

  @Effect()
  initPricingHistoryChart$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromPricingHistoryChartActions.INIT_PRICING_HISTORY_CHART),
      withLatestFrom(
        this.store.pipe(select(fromPricingHistoryChartReducer.getJobId)),
        (action: fromPricingHistoryChartActions.InitPricingHistoryChart, jobId) =>
          ({ action, jobId })
      ),
      switchMap(data =>
        forkJoin([
          this.pricingApiService.getPricedPaymarkets(data.jobId),
          this.currencyService.getCurrencies(),
          this.uiPersistenceSettingsApiService.getUiPersistenceSetting(
            FeatureAreaConstants.Jobs,
            `${UiPersistenceSettingConstants.JobsPagePricingHistoryComparison}_${data.jobId}`,
          )
        ])
          .pipe(
            mergeMap((response) => {
              const pricedPayMarkets = response[0];
              let userDefaultFilters = response[2]['@odata.null'] ? null : JSON.parse(response[2]);
              this.validateSelectedPaymarkets(userDefaultFilters, pricedPayMarkets);
              userDefaultFilters = this.getDefaultPMFilters(pricedPayMarkets, userDefaultFilters);
              return [
                new fromPricingHistoryChartActions.InitPricingHistoryChartSuccess(response),
                new fromPricingHistoryChartActions.InitUserDefaultFilters(userDefaultFilters)                
              ]
            }),
            catchError(() => of(new fromPricingHistoryChartActions.InitPricingHistoryChartError('There was an error loading your Pay Market and filter data')))
          )
      )
    );

  @Effect()
  UpdateFilters$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromPricingHistoryChartActions.UPDATE_FILTERS),
      switchMap((action: fromPricingHistoryChartActions.UpdateFilters) => {
        const getData = action.payload.PayMarkets.filter(p => p != null).length > 0;
        return getData
          ? of(new fromPricingHistoryChartActions.GetData)
          : of(new fromPricingHistoryChartActions.GetDataSuccess([]));
      })
    );

  @Effect()
  getData$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromPricingHistoryChartActions.GET_DATA),
      withLatestFrom(
        this.store.pipe(select(fromPricingHistoryChartReducer.getJobId)),
        this.store.pipe(select(fromPricingHistoryChartReducer.getFilters)),
        (action: fromPricingHistoryChartActions.GetData, jobId, filters) =>
          ({ action, jobId, filters })
      ),
      switchMap(data =>
        forkJoin([
          this.pricingApiService.getPricingHistoryComparison(this.makeGetDataRequest(data.jobId, data.filters)),
          this.uiPersistenceSettingsApiService.putUiPersistenceSetting({
            FeatureArea: FeatureAreaConstants.Jobs,
            SettingName: `${UiPersistenceSettingConstants.JobsPagePricingHistoryComparison}_${data.jobId}`,
            SettingValue: JSON.stringify(data.filters)
          })
        ])
          .pipe(
            map((response) => new fromPricingHistoryChartActions.GetDataSuccess(response[0] as PayMarketPricingHistory[])),
            catchError(() => of(new fromPricingHistoryChartActions.GetDataError('There was an error loading data for the selected Pay Markets')))
          )
      )
    );

  private makeGetDataRequest(jobId: number, filters: PricingHistoryChartFilters): GetPricingHistoryRequest {
    return {
      JobId: jobId,
      PayMarketIds: filters.PayMarkets.filter(p => !!p).map(p => p.Id),
      Rate: filters.Rate,
      Currency: filters.Currency,
      StartDate: filters.StartDate,
      EndDate: filters.EndDate
    }
  }

  private validateSelectedPaymarkets(filters: PricingHistoryChartFilters, pricedPayMarkets: PricedPayMarket[]): PricingHistoryChartFilters {
    if(filters?.PayMarkets){
      filters.PayMarkets.forEach((pm, index) => {
        const pricedPM = pricedPayMarkets.find(p => p.Id === pm?.Id)
        filters.PayMarkets[index] = pricedPM ? pricedPM : null;
      });
    }
    return filters;
  }

  private getDefaultPMFilters(pricedPayMarkets: PricedPayMarket[], userDefaultFilters: PricingHistoryChartFilters) {

    const defaultPMs = pricedPayMarkets.filter(v => v.IsDefault);
    if (userDefaultFilters?.PayMarkets?.length > 0) {
      return userDefaultFilters;
    } else if ((defaultPMs.length > 0)) {
      return {
        PayMarkets: [defaultPMs[0], null, null, null, null],
        Rate: defaultPMs[0].Rate,
        Currency: defaultPMs[0].Currency,
        StartDate: moment(defaultPMs[0].StartDate).startOf('month').toDate(),
        EndDate: moment(defaultPMs[0].EndDate).startOf('month').toDate()
      }
    } else {
      return {
        PayMarkets: [null, null, null, null, null],
        Rate: 'Annual',
        Currency: 'USD',
        StartDate: moment().subtract(3, 'year').startOf('month').toDate(),
        EndDate: moment().startOf('month').toDate()
      }
    }
  }
}
