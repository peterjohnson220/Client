import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';

import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { ExchangeCompanyApiService } from 'libs/data/payfactors-api';
import { ExchangeListItem } from 'libs/models';

import * as fromExchangeSelectorActions from '../actions/exchange-selector.actions';

@Injectable()
export class ExchangeSelectorEffects {

  @Effect()
  loadExchanges$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromExchangeSelectorActions.LOAD_EXCHANGES),
      switchMap(() =>
        this.exchangeCompanyApiService.getExchanges().pipe(
          map((exchangeListItems: ExchangeListItem[]) => {
            return new fromExchangeSelectorActions.LoadExchangesSuccess(exchangeListItems);
          }),
          catchError(() => of(new fromExchangeSelectorActions.LoadExchangesError()))
        )
      )
    );

  constructor(
    private actions$: Actions,
    private exchangeCompanyApiService: ExchangeCompanyApiService
  ) { }
}


