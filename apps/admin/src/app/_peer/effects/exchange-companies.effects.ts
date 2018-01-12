import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/concatMap';
import { GridDataResult } from '@progress/kendo-angular-grid';

import { ExchangeApiService } from 'libs/data/payfactors-api';
import * as fromExchangeCompaniesActions from '../actions/exchange-companies.actions';
import { GridHelperService } from '../services/grid-helper.service';


@Injectable()
export class ExchangeCompaniesEffects {

  @Effect()
  loadExchangeCompanies$: Observable<Action> = this.actions$
    .ofType(fromExchangeCompaniesActions.LOADING_EXCHANGE_COMPANIES)
    .map((action: fromExchangeCompaniesActions.LoadingExchangeCompanies) => action.payload)
    .switchMap(payload => {
        return this.exchangeApiService.getCompanies(payload)
          .map((exchangeCompaniesResult: GridDataResult) => {
            return new fromExchangeCompaniesActions.LoadingExchangeCompaniesSuccess(exchangeCompaniesResult);
          })
          .catch(error => of(new fromExchangeCompaniesActions.LoadingExchangeCompaniesError()));
      }
    );

  @Effect()
  addExchangeCompanies$: Observable<Action> = this.actions$
    .ofType(fromExchangeCompaniesActions.ADDING_EXCHANGE_COMPANIES)
    .map((action: fromExchangeCompaniesActions.AddingExchangeCompanies) => action.payload)
    .switchMap(payload =>
      this.exchangeApiService.addCompanies(payload)
        .map(() => {
          this.gridHelperService.loadExchangeCompanies(payload.ExchangeId);
          return new fromExchangeCompaniesActions.AddingExchangeCompaniesSuccess;
        })
        .catch(error => of(new fromExchangeCompaniesActions.AddingExchangeCompaniesError))
    );

  constructor(
    private actions$: Actions,
    private exchangeApiService: ExchangeApiService,
    private gridHelperService: GridHelperService
  ) {}
}


