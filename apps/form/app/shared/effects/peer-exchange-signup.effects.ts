import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { ExchangeSignupFormApiService } from 'libs/data/payfactors-api/form';

import * as fromPeerExchangeSignupActions from '../actions/peer-exchange-signup.actions';
import { PayfactorsApiModelMapper } from '../helpers';

@Injectable()
export class PeerExchangeSignupEffects {

  @Effect()
  getExchangeSignupCompanies$: Observable<Action> = this.actions$
    .pipe(
      ofType<fromPeerExchangeSignupActions.GetExchangeSignupCompanies>(fromPeerExchangeSignupActions.GET_EXCHANGE_SIGNUP_COMPANIES),
      switchMap(action =>
        this.exchangeSignupFormApiService.getExchangeSignupCompanies(action.payload.exchangeName)
          .pipe(
            map((response) => {
              return new fromPeerExchangeSignupActions.GetExchangeSignupCompaniesSuccess({
                exchangeSignupCompanies: PayfactorsApiModelMapper.mapExchangeSignupCompanyResponseToCompanyBaseInformation(response)
              });
            }),
            catchError(error => of(new fromPeerExchangeSignupActions.GetExchangeSignupCompaniesError()))
          )
      )
    );

  constructor(
    private actions$: Actions,
    private exchangeSignupFormApiService: ExchangeSignupFormApiService
  ) {
  }
}
