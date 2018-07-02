import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap, mergeMap, withLatestFrom, tap } from 'rxjs/operators';

import { ExchangeCompanyApiService, ExchangeDataSearchApiService } from 'libs/data/payfactors-api/peer';
import { WindowCommunicationService } from 'libs/core/services';
import { ExchangeDataCutDetail } from 'libs/models/peer/exchange-data-cut-detail.model';
import * as fromPeerMapActions from 'libs/features/peer/map/actions/map.actions';
import * as fromPeerFilterSidebarActions from 'libs/features/peer/map/actions/filter-sidebar.actions';
import * as fromPeerMapReducers from 'libs/features/peer/map/reducers';

import * as fromAddDataCutPageActions from '../actions/add-data-cut-page.actions';

@Injectable()
export class AddDataCutPageEffects {

  @Effect()
  addingDataCut$ = this.actions$
    .ofType(fromAddDataCutPageActions.ADDING_DATA_CUT).pipe(
      map((action: fromAddDataCutPageActions.AddingDataCut) => action.payload),
      withLatestFrom(
        this.peerMapStore.select(fromPeerMapReducers.getExchangeDataCutRequestData),
        (action, exchangeDataCutRequestData) => ({action, exchangeDataCutRequestData})
      ),
      switchMap((latest) => {
        return this.exchangeCompanyApiService.addDataCut({
          CompanyJobId: latest.action.CompanyJobId,
          CompanyPayMarketId: latest.action.CompanyPayMarketId,
          UserSessionId: latest.action.UserSessionId,
          Filter: latest.exchangeDataCutRequestData,
          ZoomLevel: latest.action.ZoomLevel,
          PayMarketName: latest.exchangeDataCutRequestData.PayMarketName
        }).pipe(
          map((userJobMatchId) => new fromAddDataCutPageActions.AddingDataCutSuccess(userJobMatchId)),
          catchError(() => of(new fromAddDataCutPageActions.AddingDataCutError()))
        );
      })
    );

  @Effect()
  updateDataCut$ = this.actions$
    .ofType(fromAddDataCutPageActions.UPDATE_DATA_CUT).pipe(
      map((action: fromAddDataCutPageActions.UpdateDataCut) => action.payload),
      withLatestFrom(
        this.peerMapStore.select(fromPeerMapReducers.getExchangeDataCutRequestData),
        (action, requestData) => ({action, requestData})
      ),
      switchMap((latest) => {
        return this.exchangeCompanyApiService.updateDataCut({
          DataCutGuid: latest.action.DataCutGuid,
          CompanyPayMarketId: latest.requestData.CompanyPayMarketId,
          Filter: latest.requestData,
          ZoomLevel: latest.action.ZoomLevel,
          PayMarketName: latest.requestData.PayMarketName
        }).pipe(
          map((userJobMatchId) => new fromAddDataCutPageActions.UpdateDataCutSuccess(userJobMatchId)),
          catchError(() => of(new fromAddDataCutPageActions.UpdateDataCutError()))
        );
      })
    );

  @Effect()
  loadDataCutDetails$ = this.actions$
    .ofType(fromAddDataCutPageActions.LOAD_DATA_CUT_DETAILS).pipe(
      map((action: fromAddDataCutPageActions.LoadDataCutDetails) => action.payload),
      switchMap((cutGuid: string) => {
        return this.exchangeDataSearchApiService.getDataCutDetails(cutGuid).pipe(
          map((response: ExchangeDataCutDetail) => new fromAddDataCutPageActions.LoadDataCutDetailsSuccess(response)),
          catchError(() => of(new fromAddDataCutPageActions.LoadDataCutDetailsError))
        );
      })
    );

  @Effect()
  loadDataCutDetailsSuccess$ = this.actions$
    .ofType(fromAddDataCutPageActions.LOAD_DATA_CUT_DETAILS_SUCCESS).pipe(
      map((action: fromAddDataCutPageActions.LoadDataCutDetailsSuccess) => action.payload),
      mergeMap((payload: ExchangeDataCutDetail) => {
        return [
          new fromPeerFilterSidebarActions.ApplyCutCriteria(payload.SideBarInfo),
          new fromPeerMapActions.ApplyCutCriteria(payload.MapInfo)
        ];
      })
    );

  // Window Communication
  @Effect({ dispatch: false })
  addingDataCutSuccess$ = this.actions$
    .ofType(fromAddDataCutPageActions.ADDING_DATA_CUT_SUCCESS).pipe(
      tap((action: fromAddDataCutPageActions.AddingDataCutSuccess) => {
        this.windowCommunicationService.postMessage(action.type, action.payload);
      })
  );

  @Effect({ dispatch: false })
  cancelAddDataCut$ = this.actions$
    .ofType(fromAddDataCutPageActions.CANCEL_ADD_DATA_CUT).pipe(
      tap((action: fromAddDataCutPageActions.CancelAddDataCut) => {
        this.windowCommunicationService.postMessage(action.type);
      })
  );

  @Effect({ dispatch: false })
  updateDataCutSuccess$ = this.actions$
    .ofType(fromAddDataCutPageActions.UPDATE_DATA_CUT_SUCCESS).pipe(
      tap((action: fromAddDataCutPageActions.UpdateDataCutSuccess) => {
        this.windowCommunicationService.postMessage(action.type, action.payload);
      })
    );

  @Effect({ dispatch: false })
  cancelUpdateDataCut$ = this.actions$
    .ofType(fromAddDataCutPageActions.CANCEL_UPDATE_DATA_CUT).pipe(
      tap((action: fromAddDataCutPageActions.CancelUpdateDataCut) => {
        this.windowCommunicationService.postMessage(action.type);
      })
    );

  @Effect({ dispatch: false })
  mapLoaded$ = this.actions$
    .ofType(fromPeerMapActions.MAP_LOADED).pipe(
      tap((action: fromPeerMapActions.MapLoaded) => {
        this.windowCommunicationService.postMessage(action.type);
      })
  );

  constructor(
    private actions$: Actions,
    private peerMapStore: Store<fromPeerMapReducers.State>,
    private exchangeCompanyApiService: ExchangeCompanyApiService,
    private exchangeDataSearchApiService: ExchangeDataSearchApiService,
    private windowCommunicationService: WindowCommunicationService
  ) {}
}
