import { Injectable } from '@angular/core';

import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';

import { JobPricedHistorySummaryResponse } from 'libs/models/payfactors-api/comphub';
import * as fromExchangeExplorerMapActions from 'libs/features/peer/exchange-explorer/actions/map.actions';
import * as fromSearchFiltersActions from 'libs/features/search/search/actions/search-filters.actions';
import * as fromExchangeFilterContextActions from 'libs/features/peer/exchange-explorer/actions/exchange-filter-context.actions';
import { PayfactorsSearchApiModelMapper } from 'libs/features/search/search/helpers';
import { ComphubApiService } from 'libs/data/payfactors-api/comphub';
import { ComphubType } from 'libs/constants';

import * as fromComphubMainReducer from '../reducers';
import * as fromQuickPriceHistoryActions from '../actions/quick-price-history.actions';
import * as fromSummaryCardActions from '../actions/summary-card.actions';
import * as fromComphubPageActions from '../actions/comphub-page.actions';
import { MarketsCardHelper, PayfactorsApiModelMapper } from '../helpers';
import { ComphubPages } from '../data';

@Injectable()
export class QuickPriceHistoryEffects {
  @Effect()
  getJobPricedHistorySummary$ = this.actions$
    .pipe(
      ofType(fromQuickPriceHistoryActions.GET_JOB_PRICED_HISTORY_SUMMARY),
      withLatestFrom(
        this.store.select(fromComphubMainReducer.getComphubType),
        (action: fromQuickPriceHistoryActions.GetJobPricedHistorySummary, comphubType) =>
          ({action, comphubType: comphubType})
      ),
      switchMap((data) => {
        return this.comphubApiService.getJobPricedHistorySummary(data.action.payload)
          .pipe(
            mergeMap((response: JobPricedHistorySummaryResponse) => {
              if (!response) {
                return [
                  new fromQuickPriceHistoryActions.GetJobPricedHistorySummaryError('Selected job is no longer available.')
                ];
              }
              const actions = [];
              const jobData = PayfactorsApiModelMapper.mapQuickPriceMarketDataToJobData(response);
              const payMarket = !!response.PayMarketDto
                ? PayfactorsApiModelMapper.mapPaymarketToPricingPayMarket(response.PayMarketDto)
                : data.comphubType !== ComphubType.PEER
                  ? MarketsCardHelper.buildDefaultPricingPayMarket()
                  : MarketsCardHelper.buildEmptyPeerPricingPayMarket();
              jobData.PayMarket = payMarket;
              if (data.comphubType === ComphubType.PEER) {
                actions.push(new fromExchangeExplorerMapActions.SetPeerMapBounds({
                  TopLeft: response.ExchangeDataSearchFilterContext.TopLeft,
                  BottomRight: response.ExchangeDataSearchFilterContext.BottomRight,
                  Centroid: null
                }));
                actions.push(new fromExchangeFilterContextActions.SetFilterContext(response.ExchangeDataSearchFilterContext));
                actions.push(new fromExchangeExplorerMapActions.SetMapZoom(response.ExchangeDataSearchFilterContext.ZoomLevel));
                let filters = this.payfactorsSearchApiModelMapper.mapSearchFiltersToFilters(response.Filters, response.SearchFilterMappingData);
                filters = PayfactorsApiModelMapper.mapSelectedFilters(filters);
                actions.push(new fromSearchFiltersActions.RefreshFilters({
                  filters: filters,
                  keepFilteredOutOptions: false
                }));
              }
              actions.push(new fromComphubPageActions.SetSelectedJobData(jobData));
              actions.push(new fromComphubPageActions.SetQuickPriceHistoryModalOpen(false));
              actions.push(new fromSummaryCardActions.SetMinPaymarketMinimumWage(response.MinPaymarketMinimumWage));
              actions.push(new fromSummaryCardActions.SetMaxPaymarketMinimumWage(response.MaxPaymarketMinimumWage));
              actions.push(new fromSummaryCardActions.SetShowJobPricedHistorySummary(true));
              actions.push(new fromQuickPriceHistoryActions.GetJobPricedHistorySummarySuccess());
              actions.push(new fromComphubPageActions.NavigateToCard({ cardId: ComphubPages.Summary }));

              return actions;
            }),
            catchError(error => of(new fromQuickPriceHistoryActions.GetJobPricedHistorySummaryError('Error loading data.')))
          );
      })
    );
  constructor(
    private actions$: Actions,
    private store: Store<fromComphubMainReducer.State>,
    private comphubApiService: ComphubApiService,
    private payfactorsSearchApiModelMapper: PayfactorsSearchApiModelMapper
  ) {}
}
