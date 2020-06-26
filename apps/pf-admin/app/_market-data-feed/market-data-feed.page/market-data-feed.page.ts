import { Component, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { AsyncStateObj } from 'libs/models/state';

import * as fromMarketDataFeedPageActions from '../actions/market-data-feed-page.actions';
import * as fromMarketDataFeedPageReducer from '../reducers';
import { MarketDataFeedExport } from '../model';

@Component({
  selector: 'pf-market-data-feed-page',
  templateUrl: './market-data-feed.page.html',
  styleUrls: ['./market-data-feed.page.scss']
})
export class MarketDataFeedPageComponent implements OnInit {
  feeds$: Observable<AsyncStateObj<MarketDataFeedExport[]>>;
  generatingFeed$: Observable<boolean>;

  constructor(
    public store: Store<fromMarketDataFeedPageReducer.State>,
  ) {
    this.feeds$ = this.store.select(fromMarketDataFeedPageReducer.getFeeds);
    this.generatingFeed$ = this.store.select(fromMarketDataFeedPageReducer.getGeneratingFeed);
  }

  generateExport() {
    this.store.dispatch(new fromMarketDataFeedPageActions.GenerateFeed());
  }

  ngOnInit(): void {
    this.store.dispatch(new fromMarketDataFeedPageActions.GetFeeds());
  }
}

