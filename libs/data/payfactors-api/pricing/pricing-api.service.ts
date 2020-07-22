import { Injectable } from '@angular/core';

import { PayfactorsApiService } from '../payfactors-api.service';

import { DeletePricingRequest } from 'libs/models/payfactors-api/pricings/request';
import { Observable } from 'rxjs';
import { PricingNote } from 'libs/models/payfactors-api';


@Injectable()
export class PricingApiService {
  private endpoint = 'pricing';

  constructor(private payfactorsApiService: PayfactorsApiService) { }

  deletePricingMatch(pricingMatchId: number): Observable<any> {
    return this.payfactorsApiService.delete(`${this.endpoint}/DeletePricingMatch?pricingMatchId=${pricingMatchId}`);
  }

}
