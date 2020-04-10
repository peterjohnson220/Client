import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';

import { ComphubApiService } from 'libs/data/payfactors-api/comphub';
import { SortOption } from 'libs/models/payfactors-api/comphub/request';
import { ExchangeExplorerContextService } from 'libs/features/peer/exchange-explorer/services';

import * as fromJobsCardActions from '../actions/jobs-card.actions';
import * as fromMarketsCardActions from '../actions/markets-card.actions';
import * as fromSummaryCardActions from '../actions/summary-card.actions';
import * as fromDataCardActions from '../actions/data-card.actions';
import * as fromComphubPageActions from '../actions/comphub-page.actions';
import * as fromComphubReducer from '../reducers';
import { PayfactorsApiModelMapper } from '../helpers';
import { JobData, QuickPriceGridContext } from '../models';
import { ComphubPages } from '../data';
import * as fromComphubMainReducer from '../reducers';

@Injectable()
export class DataCardEffects {

  @Effect()
  getQuickPriceMarketData$ = this.actions$
    .pipe(
      ofType(fromDataCardActions.GET_QUICK_PRICE_MARKET_DATA),
      withLatestFrom(
        this.store.select(fromComphubMainReducer.getActiveCountryDataSet),
        (action: fromDataCardActions.GetQuickPriceMarketData, dataSet) => ({ action, dataSet })
      ),
      switchMap((data) => {
          return this.comphubApiService.getQuickPriceData({
            JobTitleShort: data.action.payload.JobTitleShort,
            CompanyPaymarketId: data.action.payload.CompanyPayMarketId,
            PagingOptions: {
              Count: data.action.payload.Take,
              From: data.action.payload.Skip
            },
            Sort: DataCardEffects.getSortOption(data.action.payload),
            CountryCode: data.dataSet.CountryCode
          })
            .pipe(
              mergeMap((response) => {
                const gridDataResult = PayfactorsApiModelMapper.mapPriceDataToGridDataResult(response);

                return [
                  new fromDataCardActions.GetQuickPriceMarketDataSuccess(gridDataResult),
                  new fromComphubPageActions.SetJobPricingLimitInfo(response.PricingLimitInfo),
                  new fromSummaryCardActions.SetMinPaymarketMinimumWage(response.MinPaymarketMinimumWage),
                  new fromSummaryCardActions.SetMaxPaymarketMinimumWage(response.MaxPaymarketMinimumWage)
                ];
              }),
              catchError((error) => of(new fromDataCardActions.GetQuickPriceMarketDataError(),
                new fromComphubPageActions.HandleApiError(error)))
            );
        }
      ));

  @Effect()
  getPeerQuickPriceData$ = this.actions$
    .pipe(
      ofType(fromDataCardActions.GET_PEER_QUICK_PRICE_DATA),
      map((action: fromDataCardActions.GetPeerQuickPriceData) => action),
      withLatestFrom(
        this.exchangeExplorerContextService.selectFilterContext(),
        (action, exchangeExplorerFilterContext) => ({action, exchangeExplorerFilterContext})
      ),
      switchMap((latest) => {
        return this.comphubApiService.getPeerQuickPriceData(latest.exchangeExplorerFilterContext)
          .pipe(
            map((response) => new fromDataCardActions.GetPeerQuickPriceDataSuccess({jobData: response.JobData}),
              catchError(() => of(new fromDataCardActions.GetPeerQuickPriceDataError()))
            )
          );
      })
  );

  @Effect()
  setSelectedJobData$ = this.actions$
    .pipe(
      ofType(fromDataCardActions.SET_SELECTED_JOB_DATA),
      map((action: fromDataCardActions.SetSelectedJobData) => action.payload),
      mergeMap((jobData: JobData) => [
        new fromComphubPageActions.UpdateCardSubtitle({ cardId: ComphubPages.Data, subTitle: `Payfactors ${jobData.JobTitle}`}),
        new fromComphubPageActions.AddAccessiblePages([ComphubPages.Summary]),
        new fromSummaryCardActions.ResetCreateProjectStatus()
      ])
    );

  @Effect()
  clearSelectedJobData$ = this.actions$
    .pipe(
      ofType(fromDataCardActions.CLEAR_SELECTED_JOB_DATA),
      mergeMap(() => {
        return [
          new fromComphubPageActions.UpdateCardSubtitle({ cardId: ComphubPages.Data, subTitle: ''}),
          new fromComphubPageActions.RemoveAccessiblePages([ComphubPages.Summary]),
          new fromSummaryCardActions.ResetCreateProjectStatus()
        ];
      })
    );

  @Effect()
  setMarketDataChange$ = this.actions$
  .pipe(
    ofType(
      fromMarketsCardActions.SET_SELECTED_PAYMARKET,
      fromJobsCardActions.SET_SELECTED_JOB
    ),
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
    private exchangeExplorerContextService: ExchangeExplorerContextService
  ) {
  }
}
