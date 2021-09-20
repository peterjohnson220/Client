import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

import { CompanyEmployeeApiService, PricingApiService } from 'libs/data/payfactors-api';

import { PricingGraphTypeEnum } from '../models';
import * as fromJobPricingGraphActions from '../actions';
import * as fromJobPricingGraphReducer from '../reducers';

@Injectable()
export class JobPricingGraphEffects {

  constructor(
    private actions$: Actions,
    private pricingApiService: PricingApiService,
    private companyEmployeeApiService: CompanyEmployeeApiService,
    private store: Store<fromJobPricingGraphReducer.State>,
  ) { }

  @Effect()
  initJobPricingGraph$ = this.actions$
    .pipe(
      ofType(fromJobPricingGraphActions.LOAD_GRAPH_PAY_DATA),
      switchMap((action: fromJobPricingGraphActions.LoadGraphPayData) => {
          return this.companyEmployeeApiService.getEmployeesPayData(action.jobId, action.paymarketId)
            .pipe(
              map((response) => new fromJobPricingGraphActions.LoadGraphPayDataSuccess(response)),
              catchError(() => of(new fromJobPricingGraphActions.LoadGraphPayDataError('There was an error loading data for the selected Pay Market')))
            );
        }
      )
    );

  @Effect()
  getBasePricingData$ = this.actions$
    .pipe(
      ofType(
        fromJobPricingGraphActions.GET_BASE_PRICING_DATA
        ),
      switchMap((action: any) => {
        return this.pricingApiService.getRecentCompanyJobPricingByPayMarket(action.jobId, action.paymarketId, PricingGraphTypeEnum.Base, true)
          .pipe(
            map((response) => new fromJobPricingGraphActions.GetBasePricingDataSuccess(response, action.payData)),
            catchError(() => of(new fromJobPricingGraphActions.GetBasePricingDataError('There was an error loading data for the selected Pay Market')))
          );
      }
    )
  );

  @Effect()
  getTCCPricingData$ = this.actions$
    .pipe(
      ofType(
        fromJobPricingGraphActions.GET_TCC_PRICING_DATA
      ),
      switchMap((action: any) => {
          return this.pricingApiService.getRecentCompanyJobPricingByPayMarket(action.jobId, action.paymarketId, PricingGraphTypeEnum.TCC, true)
            .pipe(
              map((response) => new fromJobPricingGraphActions.GetTccPricingDataSuccess(response, action.payData)),
              catchError(() => of(new fromJobPricingGraphActions.GetTccPricingDataError('There was an error loading data for the selected Pay Market')))
            );
        }
      )
    );
}


