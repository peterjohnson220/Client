import { Component, Input } from '@angular/core';
import { MarketDataFeedExport } from '../../model';

@Component({
  selector: 'pf-market-data-feed-export-card',
  templateUrl: './market-data-feed-export-card.component.html',
  styleUrls: ['./market-data-feed-export-card.component.scss']
})
export class MarketDataFeedExportCardComponent {
  @Input() marketDataFeedExport: MarketDataFeedExport;

  constructor() { }

}
