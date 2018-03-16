import { Injectable } from '@angular/core';

import { Action, Store } from '@ngrx/store';
import { Actions } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { ExchangeRequestTypeEnum, RequestExchangeRequest } from 'libs/models/peer';
import { ExchangeCompanyApiService, ExchangeApiService } from 'libs/data/payfactors-api';

import * as fromExchangeRequestActions from '../actions/exchange-request.actions';
import * as fromPeerMainReducers from '../reducers';

@Injectable()
export class ExchangeRequestEffectsService {
  openModal(type: ExchangeRequestTypeEnum): Observable<Action> {
    return this.actions$
      .ofType(`${type}_${fromExchangeRequestActions.OPEN_EXCHANGE_REQUEST_MODAL}`)
      .switchMap(() => of(new fromExchangeRequestActions.LoadCandidates(type)));
  }

  closeModal(type: ExchangeRequestTypeEnum): Observable<Action> {
    return this.actions$
      .ofType(`${type}_${fromExchangeRequestActions.OPEN_EXCHANGE_REQUEST_MODAL}`)
      .switchMap(() => of(new fromExchangeRequestActions.ResetExchangeRequest(type)));
  }

  updateSearchTerm(type: ExchangeRequestTypeEnum): Observable<Action> {
    return this.actions$
      .ofType(`${type}_${fromExchangeRequestActions.UPDATE_SEARCH_TERM}`)
      .switchMap(() => of(new fromExchangeRequestActions.LoadCandidates(type)));
  }

  updateFilterOptions(type: ExchangeRequestTypeEnum): Observable<Action> {
    return this.actions$
      .ofType(`${type}_${fromExchangeRequestActions.UPDATE_FILTER_OPTIONS}`)
      .switchMap(() => of(new fromExchangeRequestActions.LoadCandidates(type)));
  }

  loadCandidates<T>(type: ExchangeRequestTypeEnum, storeSelector): Observable<Action> {
    return this.actions$
      .ofType(`${type}_${fromExchangeRequestActions.LOAD_CANDIDATES}`)
      .withLatestFrom(this.store.select(storeSelector), (action, payload) => payload)
      .switchMap((payload: any) =>
        this.exchangeCompanyApiService.getTopCandidates<T>(payload)
          .map((candidates: T[]) => new fromExchangeRequestActions.LoadCandidatesSuccess(type, candidates))
          .catch(() => of(new fromExchangeRequestActions.LoadCandidatesError(type)))
      );
  }

  createExchangeRequest(type: ExchangeRequestTypeEnum, followUpActions: Action[] = []): Observable<Action> {
    return this.actions$
      .ofType(`${type}_${fromExchangeRequestActions.CREATE_EXCHANGE_REQUEST}`)
      .map((action: fromExchangeRequestActions.CreateExchangeRequest) => action.payload)
      .switchMap((payload: RequestExchangeRequest) => {
          return this.exchangeCompanyApiService.requestExchangeAccess(payload)
            .concatMap(() => {
              const actions: Action[] = [
                new fromExchangeRequestActions.CreateExchangeRequestSuccess(type),
                new fromExchangeRequestActions.CloseExchangeRequestModal(type)
              ];
              return actions.concat(followUpActions);
            })
            .catch(() => of(new fromExchangeRequestActions.CreateExchangeRequestError(type)));
        }
      );
  }

  constructor(
    private actions$: Actions,
    private store: Store<fromPeerMainReducers.State>,
    private exchangeApiService: ExchangeApiService,
    private exchangeCompanyApiService: ExchangeCompanyApiService
  ) {}
}
