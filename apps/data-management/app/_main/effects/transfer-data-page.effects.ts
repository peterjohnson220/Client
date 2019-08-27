import { Injectable } from '@angular/core';
import { Store, Action, select } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';

import { Observable } from 'rxjs';
import { mergeMap, switchMap, map, withLatestFrom } from 'rxjs/operators';

import * as fromRootState from 'libs/state/state';
import { TransferMethodsHrisApiService, ProvidersHrisApiService } from 'libs/data/payfactors-api/hris-api';
import { TransferMethodResponse, ProviderResponse } from 'libs/models/hris-api';

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
              const providers = PayfactorsApiModelMapper.mapProviderResponseToProvider(response);
              return new fromTransferDataPageActions.LoadProvidersSuccess(providers);
          })
        );
      })
    );

  constructor(
    private actions$: Actions,
    private store: Store<fromDataManagementMainReducer.State>,
    private transferMethodsHrisApiService: TransferMethodsHrisApiService,
    private providersHrisApiService: ProvidersHrisApiService
  ) {}
}
