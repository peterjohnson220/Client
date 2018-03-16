import { Injectable } from '@angular/core';
import { Action, State, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import * as fromExchangeRequestActions from '../actions/exchange-request.actions';
import * as fromExistingCompaniesActions from '../actions/exchange-request/existing-companies.actions';
import { of } from 'rxjs/observable/of';
import { AvailableExchangeItem, ExchangeRequestTypeEnum } from '../../../../../../libs/models/peer';
import { ExchangeCompanyApiService } from '../../../../../../libs/data/payfactors-api';
import { Actions } from '@ngrx/effects';
import * as fromPeerMainReducers from '../reducers';
import { ExchangeApiService } from '../../../../../../libs/data/payfactors-api/peer';
import * as fromAvailableExchangesActions from '../actions/exchange-access/available-exchanges.actions';
import { MemoizedSelector } from '@ngrx/store/src/selector';

@Injectable()
export class ExchangeRequestEffectsService {
  openExchangeRequestModal(type: ExchangeRequestTypeEnum): Observable<Action> {
    return this.actions$
      .ofType(`${type}_${fromExchangeRequestActions.OPEN_EXCHANGE_REQUEST_MODAL}`)
      .switchMap(() => of(new fromExchangeRequestActions.LoadCandidates(type)));
  }

  closeExchangeRequestModal(type: ExchangeRequestTypeEnum): Observable<Action> {
    return this.actions$
      .ofType(`${type}_${fromExchangeRequestActions.OPEN_EXCHANGE_REQUEST_MODAL}`)
      .switchMap(() => of(new fromExchangeRequestActions.ResetExchangeRequest(type)));
  }

  loadExchangeRequestCandidates<T>(type: ExchangeRequestTypeEnum, storeSelector): Observable<Action> {
    return this.actions$
      .ofType(`${type}_${fromExchangeRequestActions.LOAD_CANDIDATES}`)
      .withLatestFrom(this.store.select(storeSelector), (action, payload) => payload)
      .switchMap((payload: any) =>
        this.exchangeCompanyApiService.getTopCandidates<T>(payload)
          .map((candidates: T[]) => new fromExchangeRequestActions.LoadCandidatesSuccess(type, candidates))
          .catch(() => of(new fromAvailableExchangesActions.LoadAvailableExchangesError))
      );
  }

  constructor(
    private actions$: Actions,
    private store: Store<fromPeerMainReducers.State>,
    private exchangeApiService: ExchangeApiService,
    private exchangeCompanyApiService: ExchangeCompanyApiService
  ) {}
}
