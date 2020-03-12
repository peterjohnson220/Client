import { Injectable } from '@angular/core';

import { Store, Action, select } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';

import { Observable } from 'rxjs';
import { mergeMap, switchMap, map, withLatestFrom } from 'rxjs/operators';

import * as fromRootState from 'libs/state/state';
import { TransferMethodsHrisApiService, ProvidersHrisApiService } from 'libs/data/payfactors-api/hris-api';
import { TransferMethodResponse, ProviderResponse } from 'libs/models/hris-api';

import * as fromProviderListActions from '../actions/provider-list.actions';
import * as fromDataManagementMainReducer from '../reducers';
import { PayfactorsApiModelMapper } from '../helpers';

@Injectable()
export class ProviderListEffects {

    @Effect()
    init$: Observable<Action> = this.actions$
        .pipe(
            ofType<fromProviderListActions.InitProviderList>(fromProviderListActions.INIT),
            switchMap(() => {
                return [
                    new fromProviderListActions.LoadTransferMethods()
                ];
            }
        )
    );

    @Effect()
    loadTransferMethods$: Observable<Action> = this.actions$
        .pipe(
            ofType<fromProviderListActions.LoadTransferMethods>(fromProviderListActions.LOAD_TRANSFER_METHODS),
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
                            new fromProviderListActions.LoadTransferMethodsSuccess(transferMethods),
                            new fromProviderListActions.SetSelectedTransferMethod(transferMethods.find( x => x.Selected).TransferMethodId)
                        ];
                    })
                );
            })
        );

    @Effect()
    setSelectedTransferMethod$: Observable<Action> = this.actions$
        .pipe(
            ofType<fromProviderListActions.SetSelectedTransferMethod>(fromProviderListActions.SET_SELECTED_TRANSFER_METHOD),
            switchMap((action: fromProviderListActions.SetSelectedTransferMethod) => [
                new fromProviderListActions.LoadProviders()
            ])
        );

    @Effect()
    loadProviders$: Observable<Action> = this.actions$
        .pipe(
            ofType<fromProviderListActions.LoadProviders>(fromProviderListActions.LOAD_PROVIDERS),
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
                        return new fromProviderListActions.LoadProvidersSuccess(providers);
                    })
                );
            })
        );

  constructor(
    private actions$: Actions,
    private store: Store<fromDataManagementMainReducer.State>,
    private transferMethodsHrisApiService: TransferMethodsHrisApiService,
    private providersHrisApiService: ProvidersHrisApiService,
  ) {}
}
