import { Injectable } from '@angular/core';
import { PayfactorsApiService } from '../payfactors-api.service';
import { PricingInfo } from 'libs/models/payfactors-api';
import { Observable } from 'rxjs';
import { BaseUrlLocation } from 'libs/models/payfactors-api/common/base-url-location.enum';

@Injectable()
export class PricingLegacyApiService {

  constructor(private payfactorsApiService: PayfactorsApiService) { }

  getPricingInfo(pricingId: number): Observable<PricingInfo> {
    return this.payfactorsApiService.get<PricingInfo>(`Pricing/GetPricingInfo?pricingID=${pricingId}`,
      {}, this.payfactorsApiService.extractValueFromOdata, BaseUrlLocation.FrontEnd);
  }
}
