import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { PayfactorsApiService } from '../payfactors-api.service';
import { GenerateFeedRequest, MarketDataFeed } from 'libs/models/payfactors-api';

@Injectable()
export class MarketDataFeedApiService {
  private endpoint = 'MarketDataFeed';

  constructor(private payfactorsApiService: PayfactorsApiService) {
  }

  generateFeed(request: GenerateFeedRequest): Observable<MarketDataFeed> {
    return this.payfactorsApiService.post(`${this.endpoint}/GenerateFeed`, request);
  }

  getRecentExports(): Observable<MarketDataFeed[]> {
    return this.payfactorsApiService.get(`${this.endpoint}/GetRecentExports`);
  }
}
