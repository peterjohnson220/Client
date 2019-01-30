import { Injectable } from '@angular/core';

import { Actions, Effect } from '@ngrx/effects';
import { map, catchError, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

import { ComphubApiService } from 'libs/data/payfactors-api/comphub';

import * as fromDataPageActions from '../actions/data-page.actions';
import { PayfactorsApiModelMapper } from '../helpers/payfactors-api-model-mapper';

@Injectable()
export class DataPageEffects {

  @Effect()
  getQuickPriceMarketData$ = this.actions$
    .ofType(fromDataPageActions.GET_QUICK_PRICE_MARKET_DATA)
    .pipe(
      switchMap((action: fromDataPageActions.GetQuickPriceMarketData) => {
          return this.comphubApiService.getQuickPriceData({
            JobTitleShort: action.payload.JobTitleShort,
            CompanyPaymarketId: action.payload.CompanyPayMarketId,
            PagingOptions: {
              Count: action.payload.Take,
              From: action.payload.Skip
            }
          })
            .pipe(
              map(response => {
                const gridDataResult = PayfactorsApiModelMapper.mapPriceDataToGridDataResult(response);
                return new fromDataPageActions.GetQuickPriceMarketDataSuccess(gridDataResult);
              }),
              catchError(() => of(new fromDataPageActions.GetQuickPriceMarketDataError()))
            );
        }
      ));


  constructor(
    private actions$: Actions,
    private comphubApiService: ComphubApiService
  ) {
  }
}
