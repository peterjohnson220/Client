import { Injectable } from '@angular/core';

import { PayfactorsApiService } from '../payfactors-api.service';

import { Observable } from 'rxjs';


@Injectable()
export class PricingMatchApiService {
  private endpoint = 'PricingMatch';

  constructor(private payfactorsApiService: PayfactorsApiService) { }

  getMDJobPricingMatch(mdJobCode: string, pricingId: number): Observable<any> {
    return this.payfactorsApiService.get(`${this.endpoint}/GetMDJobPricingMatch?mdJobCode=${mdJobCode}&pricingId=${pricingId}`);
  }

  getSurveyPricingMatch(surveyDataId: number): Observable<any> {
    return this.payfactorsApiService.get(`${this.endpoint}/GetSurveyPricingMatch?surveyDataId=${surveyDataId}`);
  }

  getSlottedCompanyJobPricingMatch(companyJobId: number): Observable<any> {
    return this.payfactorsApiService.get(`${this.endpoint}/GetSlottedCompanyJobPricingMatch?companyJobId=${companyJobId}`);
  }
}
