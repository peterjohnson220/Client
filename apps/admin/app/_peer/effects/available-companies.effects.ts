import { Injectable } from '@angular/core';

import { Action } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';



import { GridDataResult } from '@progress/kendo-angular-grid';

import { ExchangeApiService } from 'libs/data/payfactors-api';

import * as fromAvailableCompaniesActions from '../actions/available-companies.actions';

@Injectable()
export class AvailableCompaniesEffects {

  @Effect()
  loadAvailableCompanies$: Observable<Action> = this.actions$.pipe(
      ofType(fromAvailableCompaniesActions.LOADING_AVAILABLE_COMPANIES),
      map((action: fromAvailableCompaniesActions.LoadingAvailableCompanies) => action.payload),
      switchMap(payload =>
        this.exchangeApiService.getAvailableCompanies(payload.exchangeId, payload.listState).pipe(
          map((availableCompaniesResult: GridDataResult) => new fromAvailableCompaniesActions
            .LoadingAvailableCompaniesSuccess(availableCompaniesResult)),
          catchError(() => of(new fromAvailableCompaniesActions.LoadingAvailableCompaniesError()))
        )
      )
    );

  constructor(
    private actions$: Actions,
    private exchangeApiService: ExchangeApiService
  ) {}
}
