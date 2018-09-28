import { Injectable } from '@angular/core';

import { Store, select } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap, mergeMap, withLatestFrom, tap } from 'rxjs/operators';

import * as fromLibsPeerMapActions from 'libs/features/peer/map/actions/map.actions';
import * as fromLibsPeerFilterSidebarActions from 'libs/features/peer/map/actions/filter-sidebar.actions';
import * as fromLibsPeerMapReducers from 'libs/features/peer/map/reducers';
import { ExchangeCompanyApiService, ExchangeScopeApiService } from 'libs/data/payfactors-api/peer';
import { WindowCommunicationService } from 'libs/core/services';
import { PeerMapScopeSystemDetails } from 'libs/models/peer/';

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
        return this.exchangeCompanyApiService.upsertDataCut({
          DataCutGuid: latest.action.DataCutGuid,
          CompanyJobId: latest.action.CompanyJobId,
          UserSessionId: latest.action.UserSessionId,
          ZoomLevel: latest.action.ZoomLevel,
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
  loadDataCutDetails$ = this.actions$
    .ofType(fromUpsertDataCutPageActions.LOAD_DATA_CUT_DETAILS).pipe(
      map((action: fromUpsertDataCutPageActions.LoadDataCutDetails) => action.payload),
      switchMap((dataCutGuid: string) => {
        return this.exchangeScopeApiService.getDataCutPeerMapScope(dataCutGuid).pipe(
          map((response: PeerMapScopeSystemDetails) => new fromUpsertDataCutPageActions.LoadDataCutDetailsSuccess(response)),
          catchError(() => of(new fromUpsertDataCutPageActions.LoadDataCutDetailsError))
        );
      })
    );

  @Effect()
  loadDataCutDetailsSuccess$ = this.actions$
    .ofType(fromUpsertDataCutPageActions.LOAD_DATA_CUT_DETAILS_SUCCESS).pipe(
      map((action: fromUpsertDataCutPageActions.LoadDataCutDetailsSuccess) => action.payload),
      mergeMap((payload: PeerMapScopeSystemDetails) => {
        return [
          new fromLibsPeerFilterSidebarActions.ApplyCutCriteria(payload.SideBarInfo),
          new fromLibsPeerMapActions.ApplyCutCriteria(payload.MapInfo)
        ];
      })
    );

  // Window Communication
  @Effect({ dispatch: false })
  upsertDataCutSuccess$ = this.actions$
    .ofType(fromUpsertDataCutPageActions.UPSERT_DATA_CUT_SUCCESS).pipe(
      tap((action: fromUpsertDataCutPageActions.UpsertDataCutSuccess) => {
        this.windowCommunicationService.postMessage(action.type, action.payload);
      })
  );

  @Effect({ dispatch: false })
  cancelUpsertDataCut$ = this.actions$
    .ofType(fromUpsertDataCutPageActions.CANCEL_UPSERT_DATA_CUT).pipe(
      tap((action: fromUpsertDataCutPageActions.CancelUpsertDataCut) => {
        this.windowCommunicationService.postMessage(action.type);
      })
  );

  @Effect({ dispatch: false })
  mapLoaded$ = this.actions$
    .ofType(fromLibsPeerMapActions.MAP_LOADED).pipe(
      tap((action: fromLibsPeerMapActions.MapLoaded) => {
        this.windowCommunicationService.postMessage(action.type);
      })
  );

  constructor(
    private actions$: Actions,
    private libsPeerMapStore: Store<fromLibsPeerMapReducers.State>,
    private exchangeCompanyApiService: ExchangeCompanyApiService,
    private exchangeScopeApiService: ExchangeScopeApiService,
    private windowCommunicationService: WindowCommunicationService
  ) {}
}
