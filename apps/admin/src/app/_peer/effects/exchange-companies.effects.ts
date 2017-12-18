import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/switchMap';

import { ExchangeApiService } from 'libs/data/payfactors-api';
import { ExchangeCompany } from 'libs/models';

import * as fromExchangeCompaniesActions from '../actions/exchange-companies.actions';

@Injectable()
export class ExchangeCompaniesEffects {

  @Effect()
  loadExchangeCompanies$: Observable<Action> = this.actions$
    .ofType(fromExchangeCompaniesActions.LOADING_EXCHANGE_COMPANIES)
    .map((action: fromExchangeCompaniesActions.LoadingExchangeCompanies) => action.payload)
    .switchMap(exchangeId =>
      this.exchangeApiService.getCompanies(exchangeId)
        .map((exchangeCompanies: ExchangeCompany[]) => new fromExchangeCompaniesActions.LoadingExchangeCompaniesSuccess(exchangeCompanies))
        .catch(error => of(new fromExchangeCompaniesActions.LoadingExchangeCompaniesError()))
    );

  constructor(
    private actions$: Actions,
    private exchangeApiService: ExchangeApiService
  ) {}
}


