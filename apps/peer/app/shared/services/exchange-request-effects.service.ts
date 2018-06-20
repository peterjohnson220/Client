import { Injectable } from '@angular/core';

import { Action, Store } from '@ngrx/store';
import { Actions } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { concatMap, switchMap, withLatestFrom, map, catchError } from 'rxjs/operators';

import { ExchangeRequestTypeEnum, RequestExchangeRequest } from 'libs/models/peer';
import { ExchangeCompanyApiService, ExchangeApiService } from 'libs/data/payfactors-api';

import * as fromExchangeRequestActions from '../actions/exchange-request.actions';
import * as fromSharedPeerReducer from '../../shared/reducers';

@Injectable()
export class ExchangeRequestEffectsService {
  openModal(type: ExchangeRequestTypeEnum): Observable<Action> {
    return this.actions$
      .ofType(`${type}_${fromExchangeRequestActions.OPEN_EXCHANGE_REQUEST_MODAL}`).pipe(
      switchMap(() => of(new fromExchangeRequestActions.ResetExchangeRequest(type))));
  }

  updateSearchTerm(type: ExchangeRequestTypeEnum): Observable<Action> {
    return this.actions$
      .ofType(`${type}_${fromExchangeRequestActions.UPDATE_SEARCH_TERM}`).pipe(
      switchMap(() => of(new fromExchangeRequestActions.LoadCandidates(type))));
  }

  updateFilterOptions(type: ExchangeRequestTypeEnum): Observable<Action> {
    return this.actions$
      .ofType(`${type}_${fromExchangeRequestActions.UPDATE_FILTER_OPTIONS}`).pipe(
      switchMap(() => of(new fromExchangeRequestActions.LoadCandidates(type))));
  }

  reset(type: ExchangeRequestTypeEnum): Observable<Action> {
    return this.actions$
      .ofType(`${type}_${fromExchangeRequestActions.RESET_EXCHANGE_REQUEST}`).pipe(
      switchMap(() => of(new fromExchangeRequestActions.LoadCandidates(type))));
  }

  loadCandidates<T>(type: ExchangeRequestTypeEnum, storeSelector): Observable<Action> {
    return this.actions$
      .ofType(`${type}_${fromExchangeRequestActions.LOAD_CANDIDATES}`).pipe(
        withLatestFrom(this.store.select(storeSelector), (action, payload) => payload),
        switchMap((payload: any) =>
          this.exchangeCompanyApiService.getTopCandidates<T>({
            RequestType: type,
            FilterCriteria: payload
          }).pipe(
            map((candidates: T[]) => new fromExchangeRequestActions.LoadCandidatesSuccess(type, candidates)),
            catchError(() => of(new fromExchangeRequestActions.LoadCandidatesError(type)))
          )
        )
      );
  }

  createExchangeRequest(type: ExchangeRequestTypeEnum, followUpActions: Action[] = []): Observable<Action> {
    return this.actions$
      .ofType(`${type}_${fromExchangeRequestActions.CREATE_EXCHANGE_REQUEST}`).pipe(
        map((action: fromExchangeRequestActions.CreateExchangeRequest) => action.payload),
        switchMap((payload: RequestExchangeRequest) => {
            return this.exchangeCompanyApiService.createExchangeRequest(payload).pipe(
              concatMap(() => {
                const actions: Action[] = [
                  new fromExchangeRequestActions.CreateExchangeRequestSuccess(type),
                  new fromExchangeRequestActions.CloseExchangeRequestModal(type)
                ];
                return actions.concat(followUpActions);
              }),
              catchError(() => of(new fromExchangeRequestActions.CreateExchangeRequestError(type)))
            );
          }
        )
      );
  }

  constructor(
    private actions$: Actions,
    private store: Store<fromSharedPeerReducer.State>,
    private exchangeApiService: ExchangeApiService,
    private exchangeCompanyApiService: ExchangeCompanyApiService
  ) {}
}
