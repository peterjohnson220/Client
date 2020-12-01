import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PayfactorsApiService } from '../payfactors-api.service';

import { UpdatePricingMatchRequest, UpdatePricingRequest } from 'libs/models/payfactors-api/';


@Injectable({
  providedIn: 'root',
})
export class PricingApiService {
  private endpoint = 'pricing';

  constructor(private payfactorsApiService: PayfactorsApiService) { }

  updatePricing(updatePricingRequest: UpdatePricingRequest): Observable<any> {
    return this.payfactorsApiService.post(`${this.endpoint}/UpdatePricing`, updatePricingRequest);
  }

  deletePricingMatch(pricingMatchId: number): Observable<any> {
    return this.payfactorsApiService.delete(`${this.endpoint}/DeletePricingMatch?pricingMatchId=${pricingMatchId}`);
  }

  updatePricingMatch(updatePricingMatchRequest: UpdatePricingMatchRequest): Observable<any> {
    return this.payfactorsApiService.post(`${this.endpoint}/UpdatePricingMatch`, updatePricingMatchRequest);
  }

  savePricingMatches(savePricingMatchesRequest: any): Observable<any> {
    return this.payfactorsApiService.post(`${this.endpoint}/ModifyPricingMatches`, savePricingMatchesRequest );
  }

  getReScopeSurveyDataContext(pricingMatchId: number) {
    return this.payfactorsApiService.get(`${this.endpoint}/GetReScopeSurveyDataContext?pricingMatchId=${pricingMatchId}`);
  }
  deleteMatchAndPricing(pricingMatchId: number) {
    return this.payfactorsApiService.delete(`${this.endpoint}/DeleteMatchAndPricing?pricingMatchId=${pricingMatchId}`);
  }

  getPreviousPricingEffectiveDate(pricingMatchId: number) {
    return this.payfactorsApiService.get(`${this.endpoint}/GetPreviousPricingEffectiveDate?pricingMatchId=${pricingMatchId}`);
  }

}
