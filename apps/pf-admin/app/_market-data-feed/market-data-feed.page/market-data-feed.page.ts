import { Component } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromMarketDataFeedPageActions from '../actions/market-data-feed-page.actions';
import * as fromMarketDataFeedPageReducer from '../reducers';
import { generateMockMarketDataFeedExport } from '../model';

@Component({
  selector: 'pf-market-data-feed-page',
  templateUrl: './market-data-feed.page.html',
  styleUrls: ['./market-data-feed.page.scss']
})
export class MarketDataFeedPageComponent {

  marketDataFeedExportRecords = generateMockMarketDataFeedExport();

  constructor(
    public store: Store<fromMarketDataFeedPageReducer.State>,
  ) {}

  generateExport() {
    this.store.dispatch(new fromMarketDataFeedPageActions.GenerateFeed());
  }
}

