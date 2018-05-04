import { Injectable } from '@angular/core';

import { Action, Store } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/switchMap';

import { ExchangeCompanyApiService, ExchangeDataSearchApiService } from 'libs/data/payfactors-api/peer';
import { WindowCommunicationService } from 'libs/core/services';
import * as fromPeerMapActions from 'libs/features/peer/map/actions/map.actions';
import * as fromPeerMapReducers from 'libs/features/peer/map/reducers';

import * as fromAddDataCutPageActions from '../actions/add-data-cut-page.actions';

@Injectable()
export class AddDataCutPageEffects {

  @Effect()
  addingDataCut$ = this.actions$
    .ofType(fromAddDataCutPageActions.ADDING_DATA_CUT)
    .map((action: fromAddDataCutPageActions.AddingDataCut) => action.payload)
    .withLatestFrom(
      this.peerMapStore.select(fromPeerMapReducers.getExchangeDataCutRequestData),
      (action, exchangeDataCutRequestData) => ({action, exchangeDataCutRequestData}))
    .switchMap((latest) => {
      return this.exchangeCompanyApiService.addDataCut({
        CompanyJobId: latest.action.CompanyJobId,
        CompanyPayMarketId: latest.action.CompanyPayMarketId,
        UserSessionId: latest.action.UserSessionId,
        Filter: latest.exchangeDataCutRequestData,
        ZoomLevel: latest.action.ZoomLevel,
        PayMarketName: latest.exchangeDataCutRequestData.PayMarketName
      })
      .map(() => new fromAddDataCutPageActions.AddingDataCutSuccess())
      .catch(() => of(new fromAddDataCutPageActions.AddingDataCutError()));
    });

  // Window Communication
  @Effect({ dispatch: false })
  addingDataCutSuccess$ = this.actions$
    .ofType(fromAddDataCutPageActions.ADDING_DATA_CUT_SUCCESS)
    .do((action: fromAddDataCutPageActions.AddingDataCutSuccess) => {
      this.windowCommunicationService.postMessage(action.type);
    });

  @Effect({ dispatch: false })
  cancelAddDataCut$ = this.actions$
    .ofType(fromAddDataCutPageActions.CANCEL_ADD_DATA_CUT)
    .do((action: fromAddDataCutPageActions.CancelAddDataCut) => {
      this.windowCommunicationService.postMessage(action.type);
    });

  @Effect({ dispatch: false })
  mapLoaded$ = this.actions$
    .ofType(fromPeerMapActions.MAP_LOADED)
    .do((action: fromPeerMapActions.MapLoaded) => {
      this.windowCommunicationService.postMessage(action.type);
    });

  constructor(
    private actions$: Actions,
    private peerMapStore: Store<fromPeerMapReducers.State>,
    private exchangeCompanyApiService: ExchangeCompanyApiService,
    private exchangeDataSearchApiService: ExchangeDataSearchApiService,
    private windowCommunicationService: WindowCommunicationService
  ) {}
}
