import { Injectable } from '@angular/core';

import { Action } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { catchError, switchMap, map} from 'rxjs/operators';
import { GridDataResult } from '@progress/kendo-angular-grid';

import { ExchangeApiService } from 'libs/data/payfactors-api';

import { GridHelperService } from '../services/grid-helper.service';
import * as fromExchangeCompaniesActions from '../actions/exchange-companies.actions';

@Injectable()
export class ExchangeCompaniesEffects {

  @Effect()
  loadExchangeCompanies$: Observable<Action> = this.actions$.pipe(
      ofType(fromExchangeCompaniesActions.LOADING_EXCHANGE_COMPANIES),
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
  addExchangeCompanies$: Observable<Action> = this.actions$.pipe(
      ofType(fromExchangeCompaniesActions.ADDING_EXCHANGE_COMPANIES),
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

  @Effect()
  deleteExchangeCompany$: Observable<Action> = this.actions$.pipe(
      ofType(fromExchangeCompaniesActions.DELETING_EXCHANGE_COMPANY),
      map((action: fromExchangeCompaniesActions.DeletingExchangeCompany) => action.payload),
      switchMap(payload =>
        this.exchangeApiService.deleteExchangeCompany(payload).pipe(
          map(() => {
            this.gridHelperService.loadExchangeCompanies(payload.exchangeId);
            return new fromExchangeCompaniesActions.DeletingExchangeCompanySuccess;
          }),
          catchError(error => of(new fromExchangeCompaniesActions.DeletingExchangeCompanyError))
        )
      )
    );

  constructor(
    private actions$: Actions,
    private exchangeApiService: ExchangeApiService,
    private gridHelperService: GridHelperService
  ) {}
}


