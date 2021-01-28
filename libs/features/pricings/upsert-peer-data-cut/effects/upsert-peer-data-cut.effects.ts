import { Injectable } from '@angular/core';

import { Store, select } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap, withLatestFrom, tap } from 'rxjs/operators';

import * as fromSurveySearchReducer from 'libs/features/surveys/survey-search/reducers';
import * as fromLibsExchangeExplorerReducers from 'libs/features/peer/exchange-explorer/reducers';
import * as fromLibsPeerExchangeExplorerMapActions from 'libs/features/peer/exchange-explorer/actions/map.actions';
import { ExchangeScopeApiService, ExchangeDataCutsApiService } from 'libs/data/payfactors-api/peer';
import { WindowCommunicationService } from 'libs/core/services';
import { ExchangeExplorerContextService } from 'libs/features/peer/exchange-explorer/services';
import { UiPersistenceSettingsApiService } from 'libs/data/payfactors-api/settings';
import { FeatureAreaConstants, UiPersistenceSettingConstants } from 'libs/models/common';

import * as fromUpsertPeerDataCutActions from '../actions';

@Injectable()
export class UpsertPeerDataCutEffects {

  @Effect()
  upsertDataCut$ = this.actions$.pipe(
    ofType(fromUpsertPeerDataCutActions.UPSERT_DATA_CUT),
    map((action: fromUpsertPeerDataCutActions.UpsertDataCut) => action.payload),
    withLatestFrom(
      this.exchangeExplorerContextService.selectFilterContext(),
      this.store.pipe(select(fromLibsExchangeExplorerReducers.getPeerMapCompaniesFromSummary)),
      this.store.pipe(select(fromLibsExchangeExplorerReducers.getExchangeExplorerPayMarket)),
      (action, exchangeExplorerFilterContext, companies, paymarket) => ({action, exchangeExplorerFilterContext, companies, paymarket})
    ),
    switchMap((latest) => {
      return this.exchangeDataCutsApiService.upsertDataCutNew({
        DataCutGuid: latest.action.DataCutGuid,
        CompanyJobId: latest.action.CompanyJobId,
        EntityConfiguration: latest.action.EntityConfiguration,
        ZoomLevel: latest.action.ZoomLevel,
        IsPayMarketOverride: latest.action.IsPayMarketOverride,
        CompanyPayMarketId: latest.paymarket.CompanyPayMarketId,
        Filter: latest.exchangeExplorerFilterContext,
        PayMarketName: latest.paymarket.PayMarket,
        Companies: latest.companies
      }).pipe(
        map((payload) => new fromUpsertPeerDataCutActions.UpsertDataCutSuccess({UserJobMatchId: payload.Key,
          IsUpdate: payload.Value, BaseEntityId: latest.action.EntityConfiguration.BaseEntityId})),
        catchError(() => of(new fromUpsertPeerDataCutActions.UpsertDataCutError()))
      );
    })
  );

  @Effect()
  getTempExchangeJobDataCut$ = this.actions$.pipe(
    ofType(fromUpsertPeerDataCutActions.GET_REFINED_EXCHANGE_DATA_CUT_DETAILS),
    withLatestFrom(
      this.exchangeExplorerContextService.selectFilterContext(),
      this.store.select(fromSurveySearchReducer.getPricingMatchDataSearchContext),
      (action, exchangeExplorerFilterContext, pricingMatchDataSearchContext) => ({
        exchangeExplorerFilterContext, pricingMatchDataSearchContext})
    ),
    switchMap((context) => {
      const tempExchangeJobDataCutRequest = {
        ExchangeDataSearchRequest: context?.exchangeExplorerFilterContext,
        CountryCode: context?.pricingMatchDataSearchContext?.CountryCode,
        CurrencyCode: context?.pricingMatchDataSearchContext?.CurrencyCode,
        Rate: context?.pricingMatchDataSearchContext?.Rate
      };
      return this.exchangeDataCutsApiService.getTempExchangeJobDataCut(tempExchangeJobDataCutRequest).pipe(
        map((response) => new fromUpsertPeerDataCutActions.GetRefinedExchangeDataCutDetailsSuccess({
          ExchangeDataSearchRequest: context?.exchangeExplorerFilterContext,
          TempExchangeJobDataCut: response
        })),
        catchError(() => of(new fromUpsertPeerDataCutActions.GetRefinedExchangeDataCutDetailsError()))
      );
    })
  );


  // // Window Communication
  @Effect({ dispatch: false })
  upsertDataCutSuccess$ = this.actions$.pipe(
    ofType(fromUpsertPeerDataCutActions.UPSERT_DATA_CUT_SUCCESS),
    tap((action: fromUpsertPeerDataCutActions.UpsertDataCutSuccess) => {
      this.windowCommunicationService.postMessage(action.type, action.payload);
    })
  );

  @Effect({ dispatch: false })
  cancelUpsertDataCut$ = this.actions$.pipe(
    ofType(fromUpsertPeerDataCutActions.CANCEL_UPSERT_DATA_CUT),
    tap((action: fromUpsertPeerDataCutActions.CancelUpsertDataCut) => {
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
      ofType(fromUpsertPeerDataCutActions.SELECT_WEIGHTING_TYPE),
      switchMap((action: fromUpsertPeerDataCutActions.SelectWeightingType) => {
        return this.uiPersistenceSettingsApiService.putUiPersistenceSetting({
          FeatureArea: FeatureAreaConstants.PeerDataCuts,
          SettingName: UiPersistenceSettingConstants.PeerAddDataModalWeightingTypeSelection,
          SettingValue: action.payload.newWeightingType
        })
          .pipe(
            map(() => new fromUpsertPeerDataCutActions.SelectedWeightingTypePersisted()),
            catchError(() => of())
          );
      })
    );

  constructor(
    private actions$: Actions,
    private store: Store<fromLibsExchangeExplorerReducers.State>,
    private exchangeExplorerContextService: ExchangeExplorerContextService,
    private exchangeDataCutsApiService: ExchangeDataCutsApiService,
    private exchangeScopeApiService: ExchangeScopeApiService,
    private windowCommunicationService: WindowCommunicationService,
    private uiPersistenceSettingsApiService: UiPersistenceSettingsApiService
  ) {}
}
