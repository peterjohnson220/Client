import { Component, Input } from '@angular/core';
import { FeedStatus, MarketDataFeedExport } from '../../model';

@Component({
  selector: 'pf-market-data-feed-export-card',
  templateUrl: './market-data-feed-export-card.component.html',
  styleUrls: ['./market-data-feed-export-card.component.scss']
})
export class MarketDataFeedExportCardComponent {
  @Input() marketDataFeedExport: MarketDataFeedExport;

  feedStatus = FeedStatus;
  constructor() { }

}
