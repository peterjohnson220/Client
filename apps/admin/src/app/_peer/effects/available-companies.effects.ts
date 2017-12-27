import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/switchMap';

import { AvailableCompany } from 'libs/models/peer';
import { ExchangeApiService } from 'libs/data/payfactors-api';
import * as fromAvailableCompaniesActions from '../actions/available-companies.actions';
import { GridDataResult } from '@progress/kendo-angular-grid';

@Injectable()
export class AvailableCompaniesEffects {

  @Effect()
  loadAvailableCompanies$: Observable<Action> = this.actions$
    .ofType(fromAvailableCompaniesActions.LOADING_AVAILABLE_COMPANIES)
    .map((action: fromAvailableCompaniesActions.LoadingAvailableCompanies) => action.payload)
    .switchMap(exchangeId =>
      this.exchangeApiService.getAvailableCompanies(exchangeId)
        .map((availableCompaniesResult: GridDataResult) => new fromAvailableCompaniesActions
          .LoadingAvailableCompaniesSuccess(availableCompaniesResult))
        .catch(error => of(new fromAvailableCompaniesActions.LoadingAvailableCompaniesError()))
    );

  constructor(
    private actions$: Actions,
    private exchangeApiService: ExchangeApiService
  ) {}
}


