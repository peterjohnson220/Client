import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap, withLatestFrom, tap } from 'rxjs/operators';

import { ExchangeCompanyApiService, ExchangeDataSearchApiService } from 'libs/data/payfactors-api/peer';
import { WindowCommunicationService } from 'libs/core/services';
import * as fromPeerMapActions from 'libs/features/peer/map/actions/map.actions';
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
          map(() => new fromAddDataCutPageActions.AddingDataCutSuccess()),
          catchError(() => of(new fromAddDataCutPageActions.AddingDataCutError()))
        );
      })
    );

  // Window Communication
  @Effect({ dispatch: false })
  addingDataCutSuccess$ = this.actions$
    .ofType(fromAddDataCutPageActions.ADDING_DATA_CUT_SUCCESS).pipe(
      tap((action: fromAddDataCutPageActions.AddingDataCutSuccess) => {
        this.windowCommunicationService.postMessage(action.type);
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
