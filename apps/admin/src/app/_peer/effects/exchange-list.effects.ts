import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/switchMap';

import { ExchangeApiService } from 'libs/data/payfactors-api';
import { ExchangeListItem } from 'libs/models';

import * as fromExchangeListActions from '../actions/exchange-list.actions';

@Injectable()
export class ExchangeListEffects {

  @Effect()
  loadExchanges$: Observable<Action> = this.actions$
    .ofType(fromExchangeListActions.LOADING_EXCHANGES)
    .switchMap(() =>
      this.exchangeApiService.getAllExchanges()
        .map((exchangeListItems: ExchangeListItem[]) => new fromExchangeListActions.LoadingExchangesSuccess(exchangeListItems))
        .catch(error => of(new fromExchangeListActions.LoadingExchangesError()))
    );

  constructor(
    private actions$: Actions,
    private exchangeApiService: ExchangeApiService
  ) {}
}


