import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap, mergeMap, withLatestFrom, tap } from 'rxjs/operators';

import * as fromLibsPeerMapActions from 'libs/features/peer/map/actions/map.actions';
import * as fromLibsPeerFilterSidebarActions from 'libs/features/peer/map/actions/filter-sidebar.actions';
import * as fromLibsPeerMapReducers from 'libs/features/peer/map/reducers';
import { ExchangeCompanyApiService, ExchangeDataSearchApiService } from 'libs/data/payfactors-api/peer';
import { WindowCommunicationService } from 'libs/core/services';
import { ExchangeDataCutDetail } from 'libs/models/peer/exchange-data-cut-detail.model';

import * as fromUpsertDataCutPageActions from '../actions/upsert-data-cut-page.actions';

@Injectable()
export class UpsertDataCutPageEffects {

  @Effect()
  upsertDataCut$ = this.actions$
    .ofType(fromUpsertDataCutPageActions.UPSERT_DATA_CUT).pipe(
      map((action: fromUpsertDataCutPageActions.UpsertDataCut) => action.payload),
      withLatestFrom(
        this.libsPeerMapStore.select(fromLibsPeerMapReducers.getUpsertDataCutRequestData),
        (action, exchangeDataCutRequestData) => ({action, exchangeDataCutRequestData})
      ),
      switchMap((latest) => {
        return this.exchangeCompanyApiService.upsertDataCut({
          DataCutGuid: latest.action.DataCutGuid,
          CompanyJobId: latest.action.CompanyJobId,
          UserSessionId: latest.action.UserSessionId,
          ZoomLevel: latest.action.ZoomLevel,
          CompanyPayMarketId: latest.exchangeDataCutRequestData.PayMarketDetails.CompanyPayMarketId,
          Filter: latest.exchangeDataCutRequestData.FilterDetails,
          PayMarketName: latest.exchangeDataCutRequestData.PayMarketDetails.PayMarketName
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
      switchMap((cutGuid: string) => {
        return this.exchangeDataSearchApiService.getDataCutDetails(cutGuid).pipe(
          map((response: ExchangeDataCutDetail) => new fromUpsertDataCutPageActions.LoadDataCutDetailsSuccess(response)),
          catchError(() => of(new fromUpsertDataCutPageActions.LoadDataCutDetailsError))
        );
      })
    );

  @Effect()
  loadDataCutDetailsSuccess$ = this.actions$
    .ofType(fromUpsertDataCutPageActions.LOAD_DATA_CUT_DETAILS_SUCCESS).pipe(
      map((action: fromUpsertDataCutPageActions.LoadDataCutDetailsSuccess) => action.payload),
      mergeMap((payload: ExchangeDataCutDetail) => {
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
    private exchangeDataSearchApiService: ExchangeDataSearchApiService,
    private windowCommunicationService: WindowCommunicationService
  ) {}
}
