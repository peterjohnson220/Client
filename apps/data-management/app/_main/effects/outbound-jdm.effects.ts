import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';

import { isObject } from 'lodash';
import { Observable, of } from 'rxjs';
import { delay, switchMap, withLatestFrom } from 'rxjs/operators';

import * as fromOutboundJdmActions from '../actions/outbound-jdm.actions';
import * as fromTransferDataPageActions from '../actions/transfer-data-page.actions';
import { ConnectionSummary } from '../models';
import * as fromDataManagementMainReducer from '../reducers';

@Injectable()
export class OutboundJdmEffects {

  @Effect()
  loadConnectionSummary$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromOutboundJdmActions.LOAD_CONNECTION_SUMMARY),
      delay(0),
      withLatestFrom(
        this.store.select(fromDataManagementMainReducer.getJdmConnectionSummaryObj),
        (action, existingSummary) => existingSummary,
      ),
      switchMap(existingSummary => of(
        isObject(existingSummary.obj) ?
          new fromOutboundJdmActions.LoadConnectionSummarySuccess(existingSummary.obj) :
          new fromOutboundJdmActions.ResetConnectionSummary()
      )),
    );

  @Effect()
  resetConnectionSummary$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromOutboundJdmActions.RESET_CONNECTION_SUMMARY),
      switchMap(() => {
        const summary: ConnectionSummary = {
          connectionID: null,
          statuses: [],
          provider: {
            Active: true,
            AuthenticationTypeId: 2,
            ImageUrl: 'assets/images/workday-logo.png',
            ProviderCode: 'WDMOCK',
            ProviderId: 54321,
            ProviderName: 'Workday Mock',
          },
          hasConnection: false,
          canEditConnection: false,
          canEditMappings: false,
          selectedEntities: [],
        };

        return of(new fromOutboundJdmActions.LoadConnectionSummarySuccess(summary));
      })
    );

  @Effect()
  saveCredentials$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromOutboundJdmActions.SAVE_CREDENTIALS),
      withLatestFrom(
        this.store.select(fromDataManagementMainReducer.getJdmConnectionSummaryObj),
        (action, existingSummary) => existingSummary,
      ),
      switchMap(existingSummary => {
        const summary = {
          ...existingSummary.obj,
          connectionID: 12345,
          canEditMappings: true,
          statuses: ['Authenticated']
        };
        return of(new fromOutboundJdmActions.SaveConnectionSummarySuccess(summary));
      }),
    );

  @Effect()
  validateCredentials$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromTransferDataPageActions.OUTBOUND_JDM_VALIDATE),
      delay(5000),
      switchMap(() => {
        return of(new fromTransferDataPageActions.ValidateSuccess());
      }),
    );

  @Effect()
  completeConnection$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromOutboundJdmActions.COMPLETE_CONNECTION),
      withLatestFrom(
        this.store.select(fromDataManagementMainReducer.getJdmConnectionSummaryObj),
        (action, existingSummary) => existingSummary,
      ),
      switchMap(existingSummary => {
        const summary = {
          ...existingSummary.obj,
          hasConnection: true
        };
        return of(new fromOutboundJdmActions.SaveConnectionSummarySuccess(summary));
      }),
    );

  constructor(
    private actions$: Actions,
    private store: Store<fromDataManagementMainReducer.State>,
  ) {}
}
