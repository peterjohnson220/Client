import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

import { CompanyEmployeeApiService, PricingApiService } from 'libs/data/payfactors-api';

import * as fromBasePayGraphActions from '../actions';
import * as fromBasePayGraphReducer from '../reducers';

@Injectable()
export class JobPricingGraphEffects {

  constructor(
    private actions$: Actions,
    private pricingApiService: PricingApiService,
    private companyEmployeeApiService: CompanyEmployeeApiService,
    private store: Store<fromBasePayGraphReducer.State>,
  ) { }

  @Effect()
  getPricingData$ = this.actions$
    .pipe(
      ofType(fromBasePayGraphActions.GET_PRICING_DATA),
      switchMap((action: fromBasePayGraphActions.GetPricingData) => {
        return this.pricingApiService.getRecentCompanyJobPricingByPayMarket(action.jobId, action.paymarketId, true)
          .pipe(
            mergeMap((response) => {
              return [
                new fromBasePayGraphActions.GetPricingDataSuccess(response),
                new fromBasePayGraphActions.LoadBasePayData(action.jobId, action.paymarketId, response)
              ];
            }),
            catchError(() => of(new fromBasePayGraphActions.GetPricingDataError('There was an error loading data for the selected Pay Market')))
          );
      }
    )
);

  @Effect()
  initBasePayGraph$ = this.actions$
    .pipe(
      ofType(fromBasePayGraphActions.LOAD_BASE_PAY_DATA),
      switchMap((action: fromBasePayGraphActions.LoadBasePayData) => {
          return this.companyEmployeeApiService.getEmployeesBasePay(action.jobId, action.paymarketId, action.pricing?.Currency, action.pricing?.Rate)
            .pipe(
              map((response) => new fromBasePayGraphActions.LoadBasePayDataSuccess(action.pricing, response)),
              catchError(() => of(new fromBasePayGraphActions.LoadBasePayDataError('There was an error loading data for the selected Pay Market')))
            );
        }
      )
    );
}


