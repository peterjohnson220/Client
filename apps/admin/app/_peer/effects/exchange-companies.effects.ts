import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';

import { Observable, of } from 'rxjs';
import { catchError, switchMap, map} from 'rxjs/operators';
import { GridDataResult } from '@progress/kendo-angular-grid';

import { ExchangeApiService } from 'libs/data/payfactors-api';

import { GridHelperService } from '../services/grid-helper.service';
import * as fromExchangeCompaniesActions from '../actions/exchange-companies.actions';

@Injectable()
export class ExchangeCompaniesEffects {

  @Effect()
  loadExchangeCompanies$: Observable<Action> = this.actions$
    .ofType(fromExchangeCompaniesActions.LOADING_EXCHANGE_COMPANIES).pipe(
      map((action: fromExchangeCompaniesActions.LoadingExchangeCompanies) => action.payload),
      switchMap(payload => {
          return this.exchangeApiService.getCompanies(payload.exchangeId, payload.listState).pipe(
            map((exchangeCompaniesResult: GridDataResult) => {
              return new fromExchangeCompaniesActions.LoadingExchangeCompaniesSuccess(exchangeCompaniesResult);
            }),
            catchError(error => of(new fromExchangeCompaniesActions.LoadingExchangeCompaniesError()))
          );
        }
      )
    );

  @Effect()
  addExchangeCompanies$: Observable<Action> = this.actions$
    .ofType(fromExchangeCompaniesActions.ADDING_EXCHANGE_COMPANIES).pipe(
      map((action: fromExchangeCompaniesActions.AddingExchangeCompanies) => action.payload),
      switchMap(payload =>
        this.exchangeApiService.addCompanies(payload).pipe(
          map(() => {
            this.gridHelperService.loadExchangeCompanies(payload.ExchangeId);
            return new fromExchangeCompaniesActions.AddingExchangeCompaniesSuccess;
          }),
          catchError(error => of(new fromExchangeCompaniesActions.AddingExchangeCompaniesError))
        )
      )
    );

  constructor(
    private actions$: Actions,
    private exchangeApiService: ExchangeApiService,
    private gridHelperService: GridHelperService
  ) {}
}


