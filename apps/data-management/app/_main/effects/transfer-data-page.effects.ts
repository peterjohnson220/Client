import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Store, Action, select } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';

import { Observable, of } from 'rxjs';
import { mergeMap, switchMap, map, withLatestFrom, catchError, delay, tap } from 'rxjs/operators';

import * as fromRootState from 'libs/state/state';
import { TransferMethodsHrisApiService, ProvidersHrisApiService,
  ConnectionsHrisApiService} from 'libs/data/payfactors-api/hris-api';
import { TransferMethodResponse, ProviderResponse, ValidateCredentialsResponse, CredentialsPackage,
  generateMockOutboundTransferMethodResponseList, generateMockOutboundProviderResponseList } from 'libs/models/hris-api';

import * as fromTransferDataPageActions from '../actions/transfer-data-page.actions';
import * as fromDataManagementMainReducer from '../reducers';
import { PayfactorsApiModelMapper } from '../helpers';
import { generateMockJdmViewList } from '../models';
import { TransferDataWorkflowStep } from '../data';

@Injectable()
export class TransferDataPageEffects {

  @Effect()
  initTransferDataPage$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromTransferDataPageActions.INIT),
      switchMap((action: fromTransferDataPageActions.Init) =>
        [
          new fromTransferDataPageActions.LoadTransferMethods()
        ]
      )
    );

  @Effect()
  loadTransferMethods$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromTransferDataPageActions.LOAD_TRANSFER_METHODS),
      withLatestFrom(
        this.store.pipe(select(fromRootState.getUserContext)),
        (action, userContext) => {
          return {
            action,
            userContext
          };
        }
      ),
      switchMap((obj) => {
        return this.transferMethodsHrisApiService.getAllActiveTransferMethods(obj.userContext)
          .pipe(
            mergeMap((response: TransferMethodResponse[]) => {
              const transferMethods = PayfactorsApiModelMapper.mapTransferMethodResponseToTransferMethod(response);
              return [
                new fromTransferDataPageActions.LoadTransferMethodsSuccess(transferMethods),
                new fromTransferDataPageActions.SetSelectedTransferMethod(transferMethods.find( x => x.Selected).TransferMethodId)
              ];
            })
          );
      })
    );

  @Effect()
  setSelectedTransferMethod$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromTransferDataPageActions.SET_SELECTED_TRANSFER_METHOD),
      switchMap((action: fromTransferDataPageActions.SetSelectedTransferMethod) => [
        new fromTransferDataPageActions.LoadProviders()
      ])
    );

  @Effect()
  loadProviders$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromTransferDataPageActions.LOAD_PROVIDERS),
      withLatestFrom(
        this.store.select(fromDataManagementMainReducer.getSelectedTransferMethod),
        this.store.pipe(select(fromRootState.getUserContext)),
        (action, selectedTransferMethod, userContext) => {
          return {
            action,
            selectedTransferMethod,
            userContext
          };
        }
      ),
      switchMap((obj) => {
        return this.providersHrisApiService.getProvidersByTransferMethodId(obj.userContext, obj.selectedTransferMethod)
          .pipe(
            map((response: ProviderResponse[]) => {
              const providers = PayfactorsApiModelMapper.mapProviderResponsesToProviders(response);
              return new fromTransferDataPageActions.LoadProvidersSuccess(providers);
          })
        );
      })
    );

  @Effect()
  Authenticate$: Observable<Action> = this.actions$
    .pipe(
      ofType<fromTransferDataPageActions.Validate>(fromTransferDataPageActions.VALIDATE),
      withLatestFrom(this.store.pipe(select(fromRootState.getUserContext)),
      (action, userContext) => {
        return {
          action,
          userContext
        };
      }),
      switchMap((obj) => {
        let delayTime = 0;
        if (obj.action.payload.providerCode === 'PFTEST') {
          delayTime = 5000;
        }
        return this.connectionsHrisApiService.validateConnection(obj.userContext, obj.action.payload)
          .pipe(
            delay(delayTime),
            mergeMap((response: ValidateCredentialsResponse) => {
              if (!response.successful) {
                return [new fromTransferDataPageActions.ValidateError(response.errors)];
              }
              return [
                new fromTransferDataPageActions.ValidateSuccess()
              ];
            }),
            catchError(error => of(new fromTransferDataPageActions.ValidateError()))
          );
      })
    );

  // TODO: Refactor to remove this and move to hris-connection-effects for splitting out to individual pages
  @Effect()
    CreateConnection$: Observable<Action> = this.actions$
    .pipe(
      ofType<fromTransferDataPageActions.CreateConnection>(fromTransferDataPageActions.CREATE_CONNECTION),
      withLatestFrom(
        this.store.select(fromDataManagementMainReducer.getSelectedProvider),
        this.store.pipe(select(fromDataManagementMainReducer.getTransferDataPageActiveConnection)),
        this.store.pipe(select(fromRootState.getUserContext)),
      (action, provider, activeConnection, userContext) => {
        return {
          action,
          provider,
          activeConnection,
          userContext
        };
      }),
      switchMap((obj) => {
        if (obj.activeConnection) {
          return [
            new fromTransferDataPageActions.CreateConnectionSuccess(obj.activeConnection)
          ];
        }

        const connectionPostModel =
          PayfactorsApiModelMapper.createConnectionPostRequest(obj.action.payload, obj.userContext.CompanyId, obj.provider.ProviderId);
        return this.connectionsHrisApiService.connect(obj.userContext, connectionPostModel)
          .pipe(
            switchMap((response: any) => {
              return this.connectionsHrisApiService.get(obj.userContext)
                .pipe(
                  map((newConnection: CredentialsPackage) => {
                    return new fromTransferDataPageActions.CreateConnectionSuccess(newConnection);
                  }),
                  catchError(error => of(new fromTransferDataPageActions.CreateConnectionError()))
                );
            }),
            catchError(error => of(new fromTransferDataPageActions.CreateConnectionError()))
          );
      })
    );

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
    private transferMethodsHrisApiService: TransferMethodsHrisApiService,
    private providersHrisApiService: ProvidersHrisApiService,
    private connectionsHrisApiService: ConnectionsHrisApiService,
    private router: Router
  ) {}
}
