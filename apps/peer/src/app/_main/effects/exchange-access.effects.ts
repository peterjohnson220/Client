import { Injectable } from '@angular/core';

import { Action, Store } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/concatMap';
import 'rxjs/add/operator/withLatestFrom';
import 'rxjs/add/operator/mergeMap';

import { AvailableExchangeItem, RequestExchangeAccessRequest } from 'libs/models/peer';
import { CompanyOption } from 'libs/models/common';
import { ExchangeCompanyApiService } from 'libs/data/payfactors-api';
import { ExchangeApiService } from 'libs/data/payfactors-api/peer';
import * as fromExchangeListActions from 'libs/features/peer/actions/exchange-list.actions';

import * as fromAvailableExchangesActions from '../actions/exchange-access/available-exchanges.actions';
import * as fromPeerParticipantsActions from '../actions/exchange-access/peer-participants.actions';
import * as fromExchangeAccessActions from '../actions/exchange-access/exchange-access.actions';
import * as fromPeerMainReducers from '../reducers';

@Injectable()
export class ExchangeAccessEffects {
  @Effect()
  openExchangeAccessModal$: Observable<Action> = this.actions$
    .ofType(fromExchangeAccessActions.OPEN_EXCHANGE_ACCESS_MODAL)
    .switchMap(() => of(new fromAvailableExchangesActions.LoadAvailableExchanges));

  @Effect()
  closeExchangeAccessModal$: Observable<Action> = this.actions$
    .ofType(fromExchangeAccessActions.CLOSE_EXCHANGE_ACCESS_MODAL)
    .switchMap(() => of(new fromAvailableExchangesActions.Reset));

  @Effect()
  loadAvailableExchanges$: Observable<Action> = this.actions$
    .ofType(fromAvailableExchangesActions.LOAD_AVAILABLE_EXCHANGES)
    .withLatestFrom(this.store.select(fromPeerMainReducers.getAvailableExchangesQueryPayload), (action, payload) => payload)
    .switchMap((payload: any) =>
      this.exchangeCompanyApiService.getTopExchanges(payload.query, payload.companyFilterId)
        .map((availableExchanges: AvailableExchangeItem[]) => new fromAvailableExchangesActions
          .LoadAvailableExchangesSuccess(availableExchanges))
        .catch(() => of(new fromAvailableExchangesActions.LoadAvailableExchangesError))
    );

  @Effect()
  loadPeerParticipants$: Observable<Action> = this.actions$
    .ofType(fromPeerParticipantsActions.LOAD_PEER_PARTICIPANTS)
    .map((action: fromPeerParticipantsActions.LoadPeerParticipants) => action.payload)
    .switchMap(searchTerm =>
      this.exchangeApiService.getTopPeerParticipants(searchTerm)
        .map((companyOptions: CompanyOption[]) => new fromPeerParticipantsActions
          .LoadPeerParticipantsSuccess(companyOptions))
        .catch(() => of(new fromPeerParticipantsActions.LoadPeerParticipantsError))
    );

  @Effect()
  updateSearchTerm$: Observable<Action> = this.actions$
    .ofType(fromAvailableExchangesActions.UPDATE_SEARCH_TERM)
    .switchMap(() => of(new fromAvailableExchangesActions.LoadAvailableExchanges) );

  @Effect()
  updateCompanyFilter$: Observable<Action> = this.actions$
    .ofType(fromAvailableExchangesActions.UPDATE_COMPANY_FILTER)
    .switchMap(() => of(new fromAvailableExchangesActions.LoadAvailableExchanges) );

  @Effect()
  exchangeAccessRequest$: Observable<Action> = this.actions$
    .ofType(fromExchangeAccessActions.EXCHANGE_ACCESS_REQUEST)
    .map((action: fromExchangeAccessActions.ExchangeAccessRequest) => action.payload)
    .switchMap((payload: RequestExchangeAccessRequest) =>
      this.exchangeCompanyApiService.requestExchangeAccess(payload)
        .concatMap(() => {
          return [
            new fromExchangeAccessActions.ExchangeAccessRequestSuccess,
            new fromExchangeAccessActions.CloseExchangeAccessModal,
            new fromExchangeListActions.LoadingExchanges
          ];
        })
        .catch(() => of(new fromExchangeAccessActions.ExchangeAccessRequestError))
    );

  constructor(
    private actions$: Actions,
    private store: Store<fromPeerMainReducers.State>,
    private exchangeApiService: ExchangeApiService,
    private exchangeCompanyApiService: ExchangeCompanyApiService
  ) {}
}


