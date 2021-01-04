import { Injectable } from '@angular/core';

import { forkJoin, Observable, of } from 'rxjs';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, select, Store } from '@ngrx/store';
import { map, switchMap, catchError, withLatestFrom, mergeMap } from 'rxjs/operators';

import { PricingApiService, UiPersistenceSettingsApiService } from 'libs/data/payfactors-api';
import { GetPricingHistoryRequest, PricingHistoryChartFilters, PayMarketPricingHistory, PricedPayMarkets } from 'libs/models/payfactors-api';
import { FeatureAreaConstants, UiPersistenceSettingConstants } from 'libs/models';

import * as fromPricingHistoryChartActions from '../actions';
import * as fromPricingHistoryChartReducer from '../reducers';


@Injectable()
export class PricingHistoryChartEffects {

  constructor(
    private actions$: Actions,
    private pricingApiService: PricingApiService,
    private uiPersistenceSettingsApiService: UiPersistenceSettingsApiService,
    private store: Store<fromPricingHistoryChartReducer.State>,
  ) { }

  @Effect()
  loadPricedPayMarkets$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromPricingHistoryChartActions.LOAD_PRICED_PAYMARKETS),
      withLatestFrom(
        this.store.pipe(select(fromPricingHistoryChartReducer.getJobId)),
        (action: fromPricingHistoryChartActions.LoadPricedPayMarkets, jobId) =>
          ({ action, jobId })
      ),
      switchMap(data =>
        forkJoin([
          this.pricingApiService.getPricedPaymarkets(data.jobId),
          this.uiPersistenceSettingsApiService.getUiPersistenceSetting(
            FeatureAreaConstants.Jobs,
            `${UiPersistenceSettingConstants.JobsPagePricingHistoryComparison}_${data.jobId}`,
          )
        ])
          .pipe(
            mergeMap((response) => {
              const pricedPayMarkets = response[0];
              const userDefaultFilters = response[1]['@odata.null'] ? null : JSON.parse(response[1]);
              this.validateSelectedPaymarkets(userDefaultFilters, pricedPayMarkets);
              return [
                new fromPricingHistoryChartActions.LoadPricedPayMarketsSuccess(pricedPayMarkets),
                new fromPricingHistoryChartActions.InitUserDefaultFilters(userDefaultFilters)
              ]
            }),
            catchError(() => of(new fromPricingHistoryChartActions.LoadPricedPayMarketsError('There was an error loading your Pay Market and filter data')))
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
        (action: fromPricingHistoryChartActions.LoadPricedPayMarkets, jobId, filters) =>
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
      StartDate: filters.StartDate,
      EndDate: filters.EndDate
    }
  }

  private validateSelectedPaymarkets(filters: PricingHistoryChartFilters, pricedPayMarkets: PricedPayMarkets[]) {
    filters?.PayMarkets?.forEach(pm => {
      pm = pricedPayMarkets.find(p => p.Id === pm?.Id) ? pm : null;
    });    
  }


}
