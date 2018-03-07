import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';

import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/switchMap';

import { ExchangeCompanyApiService } from 'libs/data/payfactors-api/peer';
import { WindowCommunicationService } from 'libs/core/services';

import * as fromAddDataCutActions from '../actions/add-data-cut.actions';
import * as fromPeerDataReducers from '../reducers';

@Injectable()
export class AddDataCutEffects {

  @Effect()
  addingDataCut$ = this.actions$
    .ofType(fromAddDataCutActions.ADDING_DATA_CUT)
    .map((action: fromAddDataCutActions.AddingDataCut) => action.payload)
    .withLatestFrom(this.store.select(fromPeerDataReducers.getPeerMapFilter), (action, filter) => {
      return {action: action, filter: filter};
    })
    .switchMap((latest) => {
      return this.exchangeCompanyApiService.addDataCut({
        CompanyJobId: latest.action.CompanyJobId,
        CompanyPayMarketId: latest.action.CompanyPayMarketId,
        UserSessionId: latest.action.UserSessionId,
        Filter: latest.filter
      })
      .map(() => new fromAddDataCutActions.AddingDataCutSuccess())
      .catch(() => of(new fromAddDataCutActions.AddingDataCutError()));
    });

  @Effect({ dispatch: false })
  addingDataCutSuccess$ = this.actions$
    .ofType(fromAddDataCutActions.ADDING_DATA_CUT_SUCCESS)
    .do((action: fromAddDataCutActions.AddingDataCutSuccess) => {
      this.windowCommunicationService.postMessage(action.type);
    });

  @Effect({ dispatch: false })
  cancelAddDataCut$ = this.actions$
    .ofType(fromAddDataCutActions.CANCEL_ADD_DATA_CUT)
    .do((action: fromAddDataCutActions.CancelAddDataCut) => {
      this.windowCommunicationService.postMessage(action.type);
    });

  constructor(
    private actions$: Actions,
    private store: Store<fromPeerDataReducers.State>,
    private exchangeCompanyApiService: ExchangeCompanyApiService,
    private windowCommunicationService: WindowCommunicationService
  ) {}
}
