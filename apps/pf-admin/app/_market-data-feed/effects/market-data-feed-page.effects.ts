import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

import { MarketDataFeedApiService } from 'libs/data/payfactors-api/market-data-feed';

import * as fromMarketDataFeedActions from '../actions/market-data-feed-page.actions';
import * as fromMarketDataFeedPageReducer from '../reducers';
import { FeedApiModelMapper } from '../helpers/feed-api-model-mapper.helper';

@Injectable()
export class MarketDataFeedPageEffects {

  constructor(
    private actions$: Actions,
    private store: Store<fromMarketDataFeedPageReducer.State>,
    private marketDataFeedApiService: MarketDataFeedApiService
  ) {}

  @Effect()
  generateFeed$ = this.actions$
    .pipe(
      ofType(fromMarketDataFeedActions.GENERATE_FEED),
      switchMap((action: fromMarketDataFeedActions.GenerateFeed) => {
        const request = {};
        return this.marketDataFeedApiService.generateFeed(request)
          .pipe(
            map((response) => {
              return new fromMarketDataFeedActions.GenerateFeedSuccess(FeedApiModelMapper.mapFeedResponseToFeed(response));
            }),
            catchError(() => {
              return of(new fromMarketDataFeedActions.GenerateFeedError());
            })
          );
      })
    );

  @Effect()
  getFeeds$ = this.actions$
    .pipe(
      ofType(fromMarketDataFeedActions.GET_FEEDS),
      switchMap((action: fromMarketDataFeedActions.GetFeeds) => {
        const request = {};
        return this.marketDataFeedApiService.getRecentExports()
          .pipe(
            map((response) => {
              return new fromMarketDataFeedActions.GetFeedsSuccess(FeedApiModelMapper.mapFeedListRepsonseToFeed(response));
            }),
            catchError(() => {
              return of(new fromMarketDataFeedActions.GetFeedsError());
            })
          );
      })
    );
}

