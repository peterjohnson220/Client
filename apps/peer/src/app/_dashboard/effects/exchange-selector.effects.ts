import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/switchMap';

import { ExchangeApiService, ExchangeCompanyApiService } from 'libs/data/payfactors-api';
import { ExchangeListItem } from 'libs/models';

import * as fromExchangeSelectorActions from '../actions/exchange-selector.actions';

@Injectable()
export class ExchangeSelectorEffects {

  @Effect()
  loadExchanges$: Observable<Action> = this.actions$
    .ofType(fromExchangeSelectorActions.LOAD_EXCHANGES)
    .switchMap(() =>
      this.exchangeCompanyApiService.getExchanges()
        .map((exchangeListItems: ExchangeListItem[]) => {
          return new fromExchangeSelectorActions.LoadExchangesSuccess(exchangeListItems);
        })
        .catch(() => of(new fromExchangeSelectorActions.LoadExchangesError()))
    );

  constructor(
    private actions$: Actions,
    private exchangeApiService: ExchangeApiService,
    private exchangeCompanyApiService: ExchangeCompanyApiService
  ) {}
}


