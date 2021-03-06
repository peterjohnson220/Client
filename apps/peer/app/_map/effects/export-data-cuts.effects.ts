import { Injectable } from '@angular/core';

import { Action, select, Store } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { map, switchMap, catchError, withLatestFrom } from 'rxjs/operators';

import { ExchangeDataCutsApiService } from 'libs/data/payfactors-api/peer';
import { ExchangeDataCutsExportRequest } from 'libs/models/peer/requests';
import { FeatureAreaConstants, UiPersistenceSettingConstants } from 'libs/models/common';
import { UiPersistenceSettingsApiService } from 'libs/data/payfactors-api/settings';
import { CurrencyApiService } from 'libs/data/payfactors-api/currency';
import { ExchangeExplorerContextService } from 'libs/features/peer/exchange-explorer/services';

import * as fromPeerMapReducer from '../reducers/';
import * as fromSharedPeerReducer from '../../shared/reducers';
import { PayfactorsApiModelMapper } from '../../shared/helpers/payfactors-api-model-mapper';

import * as fromExportDataCutsActions from '../actions/export-data-cuts.actions';

@Injectable()
export class ExportDataCutsEffects {

  @Effect()
  exportDataCuts$: Observable<Action> = this.actions$.pipe(
    ofType(fromExportDataCutsActions.EXPORT_DATA_CUTS),
    withLatestFrom(
      this.sharedPeerStore.pipe(select(fromSharedPeerReducer.getExchangeName)),
      this.exchangeExplorerContextService.selectFilterContext(),
      this.store.pipe(select(fromPeerMapReducer.getExchangeCompanyJobsGridSelections)),
      (action: fromExportDataCutsActions.ExportDataCuts, exchangeName, filterContext, gridSelections) => {
        return {
          ExchangeId: filterContext.FilterContext.ExchangeId,
          ExchangeName: exchangeName,
          ExchangeJobToCompanyJobIds: gridSelections,
          FilterModel: action.payload.exportCurrentMap ? filterContext : null,
          SelectedRate: action.payload.selectedRate,
          SelectedExchangeScopeIds: action.payload.scopes,
          SelectedWeightingType: action.payload.selectedWeightingType,
          SelectedCurrency: action.payload.selectedCurrency
        };
      }),
    switchMap((payload: ExchangeDataCutsExportRequest) => {
      return this.exchangeDataCutsApiService.exportExchangeDataCutsNew(payload).pipe(
        map(() => {
          return new fromExportDataCutsActions.ExportDataCutsSuccess;
        }),
        catchError(() => of(new fromExportDataCutsActions.ExportDataCutsError()))
      );
    })
  );

  @Effect()
  selectRateForExport$ = this.actions$
    .pipe(
      ofType(fromExportDataCutsActions.SELECT_RATE),
      switchMap((action: fromExportDataCutsActions.SelectRate) => {
        return this.uiPersistenceSettingsApiService.putUiPersistenceSetting({
          FeatureArea: FeatureAreaConstants.PeerManageScopes,
          SettingName: UiPersistenceSettingConstants.ExchangeDataCutsExportRateSelection,
          SettingValue: action.payload.newRate
        })
          .pipe(
            map(() => new fromExportDataCutsActions.SelectedRatePersisted()),
            catchError(() => of())
          );
      })
    );

  @Effect()
  selectWeightingTypeForExport$ = this.actions$
    .pipe(
      ofType(fromExportDataCutsActions.SELECT_WEIGHTING_TYPE),
      switchMap((action: fromExportDataCutsActions.SelectWeightingType) => {
        return this.uiPersistenceSettingsApiService.putUiPersistenceSetting({
          FeatureArea: FeatureAreaConstants.PeerManageScopes,
          SettingName: UiPersistenceSettingConstants.ExchangeDataCutsExportWeightingTypeSelection,
          SettingValue: action.payload.newWeightingType
        })
          .pipe(
            map(() => new fromExportDataCutsActions.SelectedWeightingTypePersisted()),
            catchError(() => of())
          );
      })
    );

    @Effect()
    loadCurrencies$: Observable<Action> = this.actions$
      .pipe(
        ofType(fromExportDataCutsActions.LOAD_CURRENCIES),
        switchMap(() =>
          this.currencyApiService.getCurrencies().pipe(
            map((response) => {
              return new fromExportDataCutsActions.LoadCurrenciesSuccess({currencies: PayfactorsApiModelMapper.mapCurrencyDtosToCurrency(response)});
            }),
            catchError(() => of(new fromExportDataCutsActions.LoadCurrenciesError)
            )
          )
        ));

  constructor(
    private actions$: Actions,
    private store: Store<fromPeerMapReducer.State>,
    private sharedPeerStore: Store<fromSharedPeerReducer.State>,
    private exchangeExplorerContextService: ExchangeExplorerContextService,
    private exchangeDataCutsApiService: ExchangeDataCutsApiService,
    private uiPersistenceSettingsApiService: UiPersistenceSettingsApiService,
    private currencyApiService: CurrencyApiService
  ) {}
}
