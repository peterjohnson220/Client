import { Injectable } from '@angular/core';

import { Store, select } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap, mergeMap, withLatestFrom, tap } from 'rxjs/operators';

import * as fromLibsPeerMapActions from 'libs/features/peer/map/actions/map.actions';
import * as fromLibsPeerExchangeExplorerMapActions from 'libs/features/peer/exchange-explorer/actions/map.actions';
import * as fromLibsPeerFilterSidebarActions from 'libs/features/peer/map/actions/filter-sidebar.actions';
import * as fromLibsPeerMapReducers from 'libs/features/peer/map/reducers';
import * as fromLibsExchangeExplorerReducers from 'libs/features/peer/exchange-explorer/reducers';
import { ExchangeCompanyApiService, ExchangeScopeApiService, ExchangeDataCutsApiService } from 'libs/data/payfactors-api/peer';
import { WindowCommunicationService } from 'libs/core/services';
import { PeerMapScopeSystemDetails } from 'libs/models/peer/';
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
      this.libsPeerMapStore.pipe(select(fromLibsPeerMapReducers.getUpsertDataCutRequestData)),
      this.libsPeerMapStore.pipe(select(fromLibsPeerMapReducers.getPeerMapSummary)),
      (action, exchangeDataCutRequestData, mapSummaryData) => ({action, exchangeDataCutRequestData, mapSummaryData})
    ),
    switchMap((latest) => {
      return this.exchangeDataCutsApiService.upsertDataCut({
        DataCutGuid: latest.action.DataCutGuid,
        CompanyJobId: latest.action.CompanyJobId,
        UserSessionId: latest.action.UserSessionId,
        ZoomLevel: latest.action.ZoomLevel,
        IsPayMarketOverride: latest.action.IsPayMarketOverride,
        CompanyPayMarketId: latest.exchangeDataCutRequestData.PayMarketDetails.CompanyPayMarketId,
        Filter: latest.exchangeDataCutRequestData.FilterDetails,
        PayMarketName: latest.exchangeDataCutRequestData.PayMarketDetails.PayMarketName,
        Companies: latest.mapSummaryData.OverallMapStats.Companies
      }).pipe(
        map((userJobMatchId) => new fromUpsertDataCutPageActions.UpsertDataCutSuccess(userJobMatchId)),
        catchError(() => of(new fromUpsertDataCutPageActions.UpsertDataCutError()))
      );
    })
  );

  @Effect()
  upsertDataCutNew$ = this.actions$.pipe(
    ofType(fromUpsertDataCutPageActions.UPSERT_DATA_CUT_NEW),
    map((action: fromUpsertDataCutPageActions.UpsertDataCutNew) => action.payload),
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
        map((userJobMatchId) => new fromUpsertDataCutPageActions.UpsertDataCutSuccess(userJobMatchId)),
        catchError(() => of(new fromUpsertDataCutPageActions.UpsertDataCutError()))
      );
    })
  );

  @Effect()
  loadDataCutDetails$ = this.actions$.pipe(
      ofType(fromUpsertDataCutPageActions.LOAD_DATA_CUT_DETAILS),
      map((action: fromUpsertDataCutPageActions.LoadDataCutDetails) => action.payload),
      switchMap((dataCutGuid: string) => {
        return this.exchangeScopeApiService.getDataCutPeerMapScope(dataCutGuid).pipe(
          map((response: PeerMapScopeSystemDetails) => new fromUpsertDataCutPageActions.LoadDataCutDetailsSuccess(response)),
          catchError(() => of(new fromUpsertDataCutPageActions.LoadDataCutDetailsError))
        );
      })
    );

  @Effect()
  loadDataCutDetailsSuccess$ = this.actions$.pipe(
      ofType(fromUpsertDataCutPageActions.LOAD_DATA_CUT_DETAILS_SUCCESS),
      map((action: fromUpsertDataCutPageActions.LoadDataCutDetailsSuccess) => action.payload),
      mergeMap((payload: PeerMapScopeSystemDetails) => {
        return [
          new fromLibsPeerFilterSidebarActions.ApplyCutCriteria(payload.SideBarInfo),
          new fromLibsPeerMapActions.ApplyCutCriteria(payload.MapInfo)
        ];
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
      ofType(fromLibsPeerMapActions.MAP_LOADED, fromLibsPeerExchangeExplorerMapActions.MAP_LOADED),
      tap((action: fromLibsPeerMapActions.MapLoaded|fromLibsPeerExchangeExplorerMapActions.MapLoaded) => {
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
    private libsPeerMapStore: Store<fromLibsPeerMapReducers.State>,
    private exchangeDataCutsApiService: ExchangeDataCutsApiService,
    private exchangeCompanyApiService: ExchangeCompanyApiService,
    private exchangeScopeApiService: ExchangeScopeApiService,
    private windowCommunicationService: WindowCommunicationService,
    private uiPersistenceSettingsApiService: UiPersistenceSettingsApiService
  ) {}
}
