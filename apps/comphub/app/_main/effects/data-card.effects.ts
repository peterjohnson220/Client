import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

import { ComphubApiService } from 'libs/data/payfactors-api/comphub';
import { SortOption } from 'libs/models/payfactors-api/comphub/request';

import * as fromJobsCardActions from '../actions/jobs-card.actions';
import * as fromMarketsCardActions from '../actions/markets-card.actions';
import * as fromDataCardActions from '../actions/data-card.actions';
import * as fromComphubPageActions from '../actions/comphub-page.actions';
import * as fromComphubReducer from '../reducers';
import { PayfactorsApiModelMapper } from '../helpers';
import { JobData, QuickPriceGridContext } from '../models';
import { ComphubPages } from '../data';

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
            Sort: DataCardEffects.getSortOption(action.payload)
          })
            .pipe(
              mergeMap((response) => {
                const gridDataResult = PayfactorsApiModelMapper.mapPriceDataToGridDataResult(response);

                return [
                  new fromDataCardActions.GetQuickPriceMarketDataSuccess(gridDataResult),
                  new fromComphubPageActions.SetJobPricingLimitInfo(response.PricingLimitInfo)
                  ];
              }),
              catchError((error) => of(new fromDataCardActions.GetQuickPriceMarketDataError(),
                new fromComphubPageActions.HandleApiError(error)))
            );
        }
      ));

  @Effect()
  setSelectedJobData$ = this.actions$
    .ofType(fromDataCardActions.SET_SELECTED_JOB_DATA)
    .pipe(
      map((action: fromDataCardActions.SetSelectedJobData) => action.payload),
      mergeMap((jobData: JobData) => [
        new fromComphubPageActions.UpdateCardSubtitle({ cardId: ComphubPages.Data, subTitle: `Payfactors ${jobData.JobTitle}`}),
        new fromComphubPageActions.AddAccessiblePages([ComphubPages.Summary])
      ])
    );

  @Effect()
  clearSelectedJobData$ = this.actions$
    .ofType(fromDataCardActions.CLEAR_SELECTED_JOB_DATA)
    .pipe(
      mergeMap(() => {
        return [
          new fromComphubPageActions.UpdateCardSubtitle({ cardId: ComphubPages.Data, subTitle: ''}),
          new fromComphubPageActions.RemoveAccessiblePages([ComphubPages.Summary])
        ];
      })
    );

  @Effect()
  setMarketDataChange$ = this.actions$
  .ofType(
    fromMarketsCardActions.SET_SELECTED_PAYMARKET,
    fromJobsCardActions.SET_SELECTED_JOB)
  .pipe(
    map(() => new fromDataCardActions.SetMarketDataChange(true))
  );

  private static getSortOption(gridContext: QuickPriceGridContext): SortOption {
    if (gridContext.Sort) {
      // only allowing single sort
      return {
        Dir: gridContext.Sort.dir,
        Field: gridContext.Sort.field
      };
    }
    return null;
  }

  constructor(
    private actions$: Actions,
    private store: Store<fromComphubReducer.State>,
    private comphubApiService: ComphubApiService,
  ) {
  }
}
