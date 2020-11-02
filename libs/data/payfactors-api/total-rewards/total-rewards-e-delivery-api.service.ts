import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { PayfactorsApiService } from '../payfactors-api.service';
import { TrsConstants } from 'libs/features/total-rewards/total-rewards-statement/constants/trs-constants';
import {
  DeliverTokenRequest,
  TokenStatusResponse,
  DeliveryToken,
  DeliveryResponse,
  StatementDownloadResponse
} from '../../../models/payfactors-api/total-rewards';

@Injectable({
  providedIn: 'root',
})
export class TotalRewardsEDeliveryApiService {
  private endpoint = 'TotalRewardsDelivery';

  constructor(private payfactorsApiService: PayfactorsApiService) { }

  requestDeliveryToken(request: DeliverTokenRequest): Observable<TokenStatusResponse> {
    return this.payfactorsApiService.post(`${this.endpoint}/RequestDeliveryToken`, request);
  }

  deliverData(request: DeliveryToken): Observable<DeliveryResponse> {
    return this.payfactorsApiService.post(`${this.endpoint}/DeliverData`, request);
  }

  getStatementDownload(): Observable<StatementDownloadResponse> {
    return this.payfactorsApiService.post(`${this.endpoint}/GetStatementDownload`, {
      WaitForPdfSelector: TrsConstants.READY_FOR_PDF_GENERATION_SELECTOR
    });
  }
}
