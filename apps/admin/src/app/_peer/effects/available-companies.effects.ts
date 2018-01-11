import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/switchMap';
import { GridDataResult } from '@progress/kendo-angular-grid';

import { ExchangeApiService } from 'libs/data/payfactors-api';

import * as fromAvailableCompaniesActions from '../actions/available-companies.actions';

@Injectable()
export class AvailableCompaniesEffects {

  @Effect()
  loadAvailableCompanies$: Observable<Action> = this.actions$
    .ofType(fromAvailableCompaniesActions.LOADING_AVAILABLE_COMPANIES)
    .map((action: fromAvailableCompaniesActions.LoadingAvailableCompanies) => action.payload)
    .switchMap(payload =>
      this.exchangeApiService.getAvailableCompanies(payload)
        .map((availableCompaniesResult: GridDataResult) => new fromAvailableCompaniesActions
          .LoadingAvailableCompaniesSuccess(availableCompaniesResult))
        .catch(() => of(new fromAvailableCompaniesActions.LoadingAvailableCompaniesError()))
    );

  constructor(
    private actions$: Actions,
    private exchangeApiService: ExchangeApiService
  ) {}
}
