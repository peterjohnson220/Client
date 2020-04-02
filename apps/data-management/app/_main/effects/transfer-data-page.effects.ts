import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, select, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, delay, map, mergeMap, switchMap, tap, withLatestFrom } from 'rxjs/operators';

import { ConnectionsHrisApiService } from 'libs/data/payfactors-api/hris-api';
import {
  CredentialsPackage,
  generateMockOutboundProviderResponseList,
  generateMockOutboundTransferMethodResponseList,
  ValidateCredentialsResponse
} from 'libs/models/hris-api';
import * as fromRootState from 'libs/state/state';

import * as fromTransferDataPageActions from '../actions/transfer-data-page.actions';
import * as fromDataManagementMainReducer from '../reducers';
import { PayfactorsApiModelMapper } from '../helpers';
import { generateMockJdmViewList } from '../models';
import { TransferDataWorkflowStep } from '../data';

@Injectable()
export class TransferDataPageEffects {
  @Effect()
  loadOutboundProviders$: Observable<Action> = this.actions$
  .pipe(
       ofType(fromTransferDataPageActions.LOAD_OUTBOUND_PROVIDERS),
  switchMap((obj) => {
    const providers = PayfactorsApiModelMapper.mapProviderResponsesToProviders(generateMockOutboundProviderResponseList());
    return [new fromTransferDataPageActions.LoadOutboundProvidersSuccess(providers)];
  })
  );

  @Effect()
  setOutboundSelectedTransferMethod$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromTransferDataPageActions.SET_OUTBOUND_SELECTED_TRANSFER_METHOD),
      switchMap((action: fromTransferDataPageActions.SetOutboundSelectedTransferMethod) => [
        new fromTransferDataPageActions.LoadOutboundProviders()
      ])
    );

  @Effect()
  loadOutboundTransferMethods$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromTransferDataPageActions.LOAD_OUTBOUND_TRANSFER_METHODS),
      switchMap((obj) => {
        const transferMethods = PayfactorsApiModelMapper.mapTransferMethodResponseToTransferMethod(generateMockOutboundTransferMethodResponseList());
        return [
          new fromTransferDataPageActions.LoadOutboundTransferMethodsSuccess(transferMethods),
          new fromTransferDataPageActions.SetOutboundSelectedTransferMethod(transferMethods.find( x => x.Selected).TransferMethodId)
        ];
      })
    );

  @Effect()
  initOutboundTransferDataPage$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromTransferDataPageActions.OUTBOUND_INIT),
      switchMap((action: fromTransferDataPageActions.OutboundInit) =>
        [
          new fromTransferDataPageActions.LoadOutboundTransferMethods()
        ]
      )
    );

  @Effect()
  InitOutboundJdmViewSelectionPage$: Observable<Action> = this.actions$
  .pipe(
    ofType<fromTransferDataPageActions.InitOutboundJdmViewSelectionPage>(fromTransferDataPageActions.INIT_OUTBOUND_JDM_VIEW_SELECTION_PAGE),
    switchMap(() => {
      return [
        new fromTransferDataPageActions.UpdateOutboundWorkflowstep(TransferDataWorkflowStep.OutboundSelectJdmViews),
        new fromTransferDataPageActions.LoadOutboundJdmViews()
      ];
    })
  );

  @Effect()
  LoadOutboundJdmViews$: Observable<Action> = this.actions$
  .pipe(
    ofType<fromTransferDataPageActions.LoadOutboundJdmViews>(fromTransferDataPageActions.LOAD_OUTBOUND_JDM_VIEWS),
    withLatestFrom(
      this.store.select(fromDataManagementMainReducer.getOutboundJdmViews),
      (action, jdmViews) => {
        return {
          action,
          jdmViews
        };
      }
    ),
    switchMap((obj) => {
      let jdmViews = [];
      if (obj.jdmViews.obj.length === 0) {
        jdmViews = generateMockJdmViewList();
      } else {
        jdmViews = obj.jdmViews.obj;
      }

      return [
        new fromTransferDataPageActions.LoadOutboundJdmViewsSuccess(jdmViews)
      ];
    }),
    catchError(e => of(new fromTransferDataPageActions.LoadOutboundJdmViewsError()))
  );
  @Effect()
  UpdateOutboundJdmViews$: Observable<Action> = this.actions$
  .pipe(
    ofType<fromTransferDataPageActions.UpdateOutboundJdmViews>(fromTransferDataPageActions.UPDATE_OUTBOUND_JDM_VIEWS),
    switchMap(() => {
      return [
        new fromTransferDataPageActions.UpdateOutboundJdmViewsSuccess()
      ];
    }),
    catchError(e => of(new fromTransferDataPageActions.UpdateOutboundJdmViewsError()))
  );

  constructor(
    private actions$: Actions,
    private store: Store<fromDataManagementMainReducer.State>,
    private connectionsHrisApiService: ConnectionsHrisApiService,
  ) {}
}
