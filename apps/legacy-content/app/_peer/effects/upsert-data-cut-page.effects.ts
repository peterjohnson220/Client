import { Injectable } from '@angular/core';

import { Store, select } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap, withLatestFrom, tap } from 'rxjs/operators';

import * as fromLibsExchangeExplorerReducers from 'libs/features/peer/exchange-explorer/reducers';
import * as fromLibsPeerExchangeExplorerMapActions from 'libs/features/peer/exchange-explorer/actions/map.actions';
import { ExchangeScopeApiService, ExchangeDataCutsApiService } from 'libs/data/payfactors-api/peer';
import { WindowCommunicationService } from 'libs/core/services';
import { ExchangeExplorerContextService } from 'libs/features/peer/exchange-explorer/services';
import { UiPersistenceSettingsApiService } from 'libs/data/payfactors-api/settings';
import { FeatureAreaConstants, UiPersistenceSettingConstants } from 'libs/models/common';


import * as fromUpsertDataCutPageActions from '../actions/upsert-data-cut-page.actions';

@Injectable()
export class UpsertDataCutPageEffects {


  @Effect()
  upsertDataCut$ = this.actions$.pipe(
    ofType(fromUpsertDataCutPageActions.UPSERT_DATA_CUT),
    map((action: fromUpsertDataCutPageActions.UpsertDataCut) => action.payload),
    withLatestFrom(
      this.exchangeExplorerContextService.selectFilterContext(),
      this.libsExchangeExplorerStore.pipe(select(fromLibsExchangeExplorerReducers.getPeerMapCompaniesFromSummary)),
      this.libsExchangeExplorerStore.pipe(select(fromLibsExchangeExplorerReducers.getExchangeExplorerPayMarket)),
      (action, exchangeExplorerFilterContext, companies, paymarket) => ({action, exchangeExplorerFilterContext, companies, paymarket})
    ),
    switchMap((latest) => {
      return this.exchangeDataCutsApiService.upsertDataCutNew({
        DataCutGuid: latest.action.DataCutGuid,
        CompanyJobId: latest.action.CompanyJobId,
        UserSessionId: latest.action.UserSessionId,
        ZoomLevel: latest.action.ZoomLevel,
        IsPayMarketOverride: latest.action.IsPayMarketOverride,
        CompanyPayMarketId: latest.paymarket.CompanyPayMarketId,
        Filter: latest.exchangeExplorerFilterContext,
        PayMarketName: latest.paymarket.PayMarket,
        Companies: latest.companies
      }).pipe(
        map((payload) => new fromUpsertDataCutPageActions.UpsertDataCutSuccess({UserJobMatchId: payload.Key, IsUpdate: payload.Value})),
        catchError(() => of(new fromUpsertDataCutPageActions.UpsertDataCutError()))
      );
    })
  );

  // // Window Communication
  @Effect({ dispatch: false })
  upsertDataCutSuccess$ = this.actions$.pipe(
      ofType(fromUpsertDataCutPageActions.UPSERT_DATA_CUT_SUCCESS),
      tap((action: fromUpsertDataCutPageActions.UpsertDataCutSuccess) => {
        this.windowCommunicationService.postMessage(action.type, action.payload);
      })
  );

  @Effect({ dispatch: false })
  cancelUpsertDataCut$ = this.actions$.pipe(
      ofType(fromUpsertDataCutPageActions.CANCEL_UPSERT_DATA_CUT),
      tap((action: fromUpsertDataCutPageActions.CancelUpsertDataCut) => {
        this.windowCommunicationService.postMessage(action.type);
      })
  );

  @Effect({ dispatch: false })
  mapLoaded$ = this.actions$.pipe(
    ofType(fromLibsPeerExchangeExplorerMapActions.MAP_LOADED),
    tap((action: fromLibsPeerExchangeExplorerMapActions.MapLoaded) => {
      this.windowCommunicationService.postMessage(action.type);
    })
  );

  @Effect()
  selectWeightingTypeForAddDataCuts$ = this.actions$
    .pipe(
      ofType(fromUpsertDataCutPageActions.SELECT_WEIGHTING_TYPE),
      switchMap((action: fromUpsertDataCutPageActions.SelectWeightingType) => {
        return this.uiPersistenceSettingsApiService.putUiPersistenceSetting({
          FeatureArea: FeatureAreaConstants.PeerDataCuts,
          SettingName: UiPersistenceSettingConstants.PeerAddDataModalWeightingTypeSelection,
          SettingValue: action.payload.newWeightingType
        })
          .pipe(
            map(() => new fromUpsertDataCutPageActions.SelectedWeightingTypePersisted()),
            catchError(() => of())
          );
      })
    );

  constructor(
    private actions$: Actions,
    private libsExchangeExplorerStore: Store<fromLibsExchangeExplorerReducers.State>,
    private exchangeExplorerContextService: ExchangeExplorerContextService,
    private exchangeDataCutsApiService: ExchangeDataCutsApiService,
    private exchangeScopeApiService: ExchangeScopeApiService,
    private windowCommunicationService: WindowCommunicationService,
    private uiPersistenceSettingsApiService: UiPersistenceSettingsApiService
  ) {}
}
