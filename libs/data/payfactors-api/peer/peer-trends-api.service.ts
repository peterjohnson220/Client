import { Injectable } from '@angular/core';

import { PayfactorsApiService } from '../payfactors-api.service';
import { UpsertPeerTrendRequest } from '../../../models/peer/requests';

@Injectable({
  providedIn: 'root',
})
export class PeerTrendsApiService {
  endpoint = 'PeerTrends';

  constructor(private payfactorsApiService: PayfactorsApiService) {}

  upsertPeerTrend(request: UpsertPeerTrendRequest) {
    return this.payfactorsApiService.post(`${this.endpoint}/UpsertPeerTrend`, request);
  }

  checkPeerTrendNameUniqueness(peerTrendName: string) {
    return this.payfactorsApiService.get(`${this.endpoint}/IsUniquePeerTrendName`, { params: {peerTrendName: peerTrendName}});
  }

  deletePeerTrend(peerTrendName: string) {
    return this.payfactorsApiService.post(`${this.endpoint}/DeletePeerTrend`, {peerTrendName: peerTrendName});
  }

  getPeerTrendContext(peerTrendId: number) {
    return this.payfactorsApiService.post(`${this.endpoint}/GetPeerTrendContext`, peerTrendId);
  }
}
