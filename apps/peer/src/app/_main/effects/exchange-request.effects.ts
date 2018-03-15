import { Inject, Injectable } from '@angular/core';

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

import { ExchangeCompanyApiService } from 'libs/data/payfactors-api';
import { ExchangeApiService } from 'libs/data/payfactors-api/peer';

import * as fromExistingCompaniesActions from '../actions/exchange-request/existing-companies.actions';
import * as fromExchangeRequestActions from '../actions/exchange-request.actions';
import * as fromPeerMainReducers from '../reducers';
import { ExchangeRequestTypeEnum } from '../actions/exchange-request.actions';
import { RequestExchangeAccessRequest } from '../../../../../../libs/models/peer';
@Injectable()
export class ExchangeRequestEffects {
  @Effect()
  openReferCompaniesModal$: Observable<Action> = this.actions$
    .ofType(`${this.type}_${fromExchangeRequestActions.OPEN_EXCHANGE_REQUEST_MODAL}`)
    .switchMap(() => of(new fromExistingCompaniesActions.LoadExistingCompanies));

  @Effect()
  updateSearchTerm$: Observable<Action> = this.actions$
    .ofType(`${this.type}_${fromExchangeRequestActions.UPDATE_SEARCH_TERM}`)
    .switchMap(() => of(new fromExistingCompaniesActions.LoadExistingCompanies));

  @Effect()
  loadExistingCompanies$: Observable<Action> = this.actions$
    .ofType(fromExistingCompaniesActions.LOAD_EXISTING_COMPANIES)
    .withLatestFrom(this.store.select(fromPeerMainReducers.getExistingCompaniesExchangeRequestPayload), (action, payload) => payload)
    .switchMap((payload) =>
      this.exchangeCompanyApiService.getTopExchangeCandidates(payload)
        .map((result: any[]) => new fromExistingCompaniesActions.LoadExistingCompaniesSuccess(result))
        .catch(() => of(new fromExistingCompaniesActions.LoadExistingCompaniesError)));

  @Effect()
  createExchangeRequest$: Observable<Action> = this.actions$
    .ofType(`${this.type}_${fromExchangeRequestActions.CREATE_EXCHANGE_REQUEST}`)
    .map((action: fromExchangeRequestActions.CreateExchangeRequest) => action.payload)
    .switchMap((payload: RequestExchangeAccessRequest) =>
      this.exchangeCompanyApiService.requestExchangeAccess(payload)
        .map(() => new fromExchangeRequestActions.CreateExchangeRequestSuccess(ExchangeRequestTypeEnum.ReferPayfactorsCompany))
        .catch(() => of(new fromExchangeRequestActions.CreateExchangeRequestError(ExchangeRequestTypeEnum.ReferPayfactorsCompany)))
    );

  // @Effect()
  // createExchangeRequestSuccessful$: Observable<Action> = this.actions$
  //   .ofType(`${this.type}_${fromExchangeRequestActions.CREATE_EXCHANGE_REQUEST_SUCCESS}`)
  //   .switchMap(() => of(new fromExchangeRequestActions.CloseExchangeRequestModal(ExchangeRequestTypeEnum.ReferPayfactorsCompany)));


  constructor(
    protected type: ExchangeRequestTypeEnum,
    protected actions$: Actions,
    protected store: Store<fromPeerMainReducers.State>,
    protected exchangeApiService: ExchangeApiService,
    protected exchangeCompanyApiService: ExchangeCompanyApiService
  ) {}
}


