import { Injectable } from '@angular/core';

import { Actions, Effect } from '@ngrx/effects';
import { map, catchError, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

import { ComphubApiService } from 'libs/data/payfactors-api/comphub';
import { SortOption } from 'libs/models/payfactors-api/comphub/request';

import * as fromDataCardActions from '../actions/data-card.actions';
import { PayfactorsApiModelMapper } from '../helpers/payfactors-api-model-mapper';
import { QuickPriceGridContext } from '../models';

@Injectable()
export class DataCardEffects {

  @Effect()
  getQuickPriceMarketData$ = this.actions$
    .ofType(fromDataCardActions.GET_QUICK_PRICE_MARKET_DATA)
    .pipe(
      switchMap((action: fromDataCardActions.GetQuickPriceMarketData) => {
          return this.comphubApiService.getQuickPriceData({
            JobTitleShort: action.payload.JobTitleShort,
            CompanyPaymarketId: action.payload.CompanyPayMarketId,
            PagingOptions: {
              Count: action.payload.Take,
              From: action.payload.Skip
            },
            Sort: this.getSortOption(action.payload)
          })
            .pipe(
              map(response => {
                const gridDataResult = PayfactorsApiModelMapper.mapPriceDataToGridDataResult(response);
                return new fromDataCardActions.GetQuickPriceMarketDataSuccess(gridDataResult);
              }),
              catchError(() => of(new fromDataCardActions.GetQuickPriceMarketDataError()))
            );
        }
      ));

  getSortOption(gridContext: QuickPriceGridContext): SortOption {
    if (gridContext.Sort && gridContext.Sort.length) {
      // only allowing single sort
      return {
        Dir: gridContext.Sort[0].dir,
        Field: gridContext.Sort[0].field
      };
    }
    return null;
  }
  constructor(
    private actions$: Actions,
    private comphubApiService: ComphubApiService
  ) {
  }
}
