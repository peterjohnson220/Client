import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Store, Action, select } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';

import { Observable, of } from 'rxjs';
import { mergeMap, switchMap, map, withLatestFrom, catchError, delay, tap } from 'rxjs/operators';

import * as fromRootState from 'libs/state/state';
import { TransferMethodsHrisApiService, ProvidersHrisApiService,
  ConnectionsHrisApiService} from 'libs/data/payfactors-api/hris-api';
import { TransferMethodResponse, ProviderResponse, ValidateCredentialsResponse, ProviderSupportedEntityDTO, CredentialsPackage } from 'libs/models/hris-api';

import * as fromTransferDataPageActions from '../actions/transfer-data-page.actions';
import * as fromDataManagementMainReducer from '../reducers';
import { PayfactorsApiModelMapper } from '../helpers';


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



  constructor(
    private actions$: Actions,
    private store: Store<fromDataManagementMainReducer.State>,
    private transferMethodsHrisApiService: TransferMethodsHrisApiService,
    private providersHrisApiService: ProvidersHrisApiService,
    private connectionsHrisApiService: ConnectionsHrisApiService,
    private router: Router
  ) {}
}
