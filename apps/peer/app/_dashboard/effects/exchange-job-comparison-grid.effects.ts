import { Injectable } from '@angular/core';

import { Action, Store } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { Observable, of } from 'rxjs';
import { catchError, map, withLatestFrom, switchMap } from 'rxjs/operators';

import { FeatureAreaConstants, UiPersistenceSettingConstants } from 'libs/models/common';
import { ExchangeCompanyApiService, UiPersistenceSettingsApiService } from 'libs/data/payfactors-api';

import * as fromExchangeJobComparisonGridActions from '../actions/exchange-job-comparison-grid.actions';
import * as fromDashboardReducer from '../reducers';
import * as fromSharedPeerReducer from '../../shared/reducers';

@Injectable()
export class ExchangeJobComparisonGridEffects {

  @Effect()
  loadExchangeJobMappings$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromExchangeJobComparisonGridActions.LOAD_EXCHANGE_JOB_COMPARISONS),
      withLatestFrom(
        this.store.select(fromDashboardReducer.getExchangeJobComparisonsGridState),
        this.sharedPeerStore.select(fromSharedPeerReducer.getExchangeId),
        (action: fromExchangeJobComparisonGridActions.LoadExchangeJobComparisons, listState, exchangeId) => {
          return {exchangeId, listState, countryCode: action.payload.countryCode};
        }
      ),
      switchMap(payload =>
        this.exchangeCompanyApiService.getExchangeJobComparisonList(payload.exchangeId, payload.listState, payload.countryCode).pipe(
          map((gridDataResult: GridDataResult) => {
            return new fromExchangeJobComparisonGridActions.LoadExchangeJobComparisonsSuccess(gridDataResult);
          }),
          catchError(() => of(new fromExchangeJobComparisonGridActions.LoadExchangeJobComparisonsError))
        )
      )
    );

  @Effect()
  selectComparisonMarket$ = this.actions$
    .pipe(
      ofType(fromExchangeJobComparisonGridActions.SELECT_COMPARISON_MARKET),
      switchMap((action: fromExchangeJobComparisonGridActions.SelectComparisonMarket) => {
        return this.uiPersistenceSettingsApiService.putUiPersistenceSetting({
          FeatureArea: FeatureAreaConstants.PeerDashboard,
          SettingName: UiPersistenceSettingConstants.ComparisonMarketSelection,
          SettingValue: action.payload.newMarket
        })
          .pipe(
            map(() => new fromExchangeJobComparisonGridActions.SelectedComparisonMarketPersisted),
            catchError(() => of())
          );
      })
    );

  @Effect()
  selectComparisonRate$ = this.actions$
    .pipe(
      ofType(fromExchangeJobComparisonGridActions.SELECT_RATE),
      switchMap((action: fromExchangeJobComparisonGridActions.SelectRate) => {
        return this.uiPersistenceSettingsApiService.putUiPersistenceSetting({
          FeatureArea: FeatureAreaConstants.PeerDashboard,
          SettingName: UiPersistenceSettingConstants.ComparisonRateSelection,
          SettingValue: action.payload.newRate
        })
          .pipe(
            map(() => new fromExchangeJobComparisonGridActions.SelectedRatePersisted()),
            catchError(() => of())
          );
      })
    );

  constructor(
    private actions$: Actions,
    private exchangeCompanyApiService: ExchangeCompanyApiService,
    private uiPersistenceSettingsApiService: UiPersistenceSettingsApiService,
    private store: Store<fromDashboardReducer.State>,
    private sharedPeerStore: Store<fromSharedPeerReducer.State>
  ) {}
}


