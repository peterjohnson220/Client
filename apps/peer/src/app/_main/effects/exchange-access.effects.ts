import { Injectable } from '@angular/core';

import { Action, Store } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/withLatestFrom';
import 'rxjs/add/operator/mergeMap';

import { ExchangeCompanyApiService } from 'libs/data/payfactors-api';
import { AvailableExchangeItem } from 'libs/models/peer';
import { ExchangeApiService } from 'libs/data/payfactors-api/peer';
import { CompanyOption } from 'libs/models/common';

import * as fromAvailableExchangesActions from '../actions/exchange-access/available-exchanges.actions';
import * as fromPeerParticipantsActions from '../actions/exchange-access/peer-participants.actions';
import * as fromExchangeAccessActions from '../actions/exchange-access/exchange-access.actions';
import * as fromPeerDataReducers from '../../../../../legacy-content/src/app/_peer/reducers';
import { ExchangeMapFilter, ExchangeMapResponse } from '../../../../../../libs/models/peer';
import * as fromPeerMapActions from '../../../../../legacy-content/src/app/_peer/actions/peer-map.actions';
import * as fromPeerMainReducers from '../reducers';

@Injectable()
export class ExchangeAccessEffects {
  @Effect()
  openExchangeAccessModal$: Observable<Action> = this.actions$
    .ofType(fromExchangeAccessActions.OPEN_EXCHANGE_ACCESS_MODAL)
    .mergeMap(() => [
      new fromAvailableExchangesActions.LoadAvailableExchanges({query: ''}),
      new fromPeerParticipantsActions.LoadPeerParticipants
    ]);

  @Effect()
  loadAvailableExchanges$: Observable<Action> = this.actions$
    .ofType(fromAvailableExchangesActions.LOAD_AVAILABLE_EXCHANGES)
    .map((action: fromAvailableExchangesActions.LoadAvailableExchanges) => action.payload)
    .switchMap((payload: any) =>
      this.exchangeCompanyApiService.getTopExchanges(payload.query, payload.companyFilterId)
        .map((availableExchanges: AvailableExchangeItem[]) => new fromAvailableExchangesActions
          .LoadAvailableExchangesSuccess(availableExchanges))
        .catch(() => of(new fromAvailableExchangesActions.LoadAvailableExchangesError))
    );

  @Effect()
  loadPeerParticipants$: Observable<Action> = this.actions$
    .ofType(fromPeerParticipantsActions.LOAD_PEER_PARTICIPANTS)
    .switchMap(() =>
      this.exchangeApiService.getCompaniesWithPeerEnabled(false)
        .map((companyOptions: CompanyOption[]) => new fromPeerParticipantsActions
          .LoadPeerParticipantsSuccess(companyOptions))
        .catch(() => of(new fromPeerParticipantsActions.LoadPeerParticipantsError))
    );

  @Effect()
  updateSearchTerm$: Observable<Action> = this.actions$
    .ofType(fromExchangeAccessActions.UPDATE_SEARCH_TERM)
    .withLatestFrom(this.store.select(fromPeerMainReducers.getAvailableExchangesQueryPayload), (action, payload) => payload)
    .switchMap((payload: any) => of(new fromAvailableExchangesActions.LoadAvailableExchanges(payload)) );

  @Effect()
  updateCompanyFilter$: Observable<Action> = this.actions$
    .ofType(fromExchangeAccessActions.UPDATE_COMPANY_FILTER)
    .withLatestFrom(this.store.select(fromPeerMainReducers.getAvailableExchangesQueryPayload), (action, payload) => payload)
    .switchMap((payload: any) => of(new fromAvailableExchangesActions.LoadAvailableExchanges(payload)) );

  constructor(
    private actions$: Actions,
    private store: Store<fromPeerMainReducers.State>,
    private exchangeApiService: ExchangeApiService,
    private exchangeCompanyApiService: ExchangeCompanyApiService
  ) {}
}


