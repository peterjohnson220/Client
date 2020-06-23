import { Injectable } from '@angular/core';

import { PayfactorsApiService } from '../payfactors-api.service';

import { DeletePricingRequest } from 'libs/models/payfactors-api/pricings/request';
import { Observable } from 'rxjs';
import { PricingNote } from 'libs/models/payfactors-api';


@Injectable()
export class PricingMatchApiService {
  private endpoint = 'PricingMatch';

  constructor(private payfactorsApiService: PayfactorsApiService) { }

  getMDJobPricingMatch(mdJobId: string, pricingId: number): Observable<any> {
    return this.payfactorsApiService.get(`${this.endpoint}/GetMDJobPricingMatch?mdJobId=${mdJobId}&pricingId=${pricingId}`);
  }

  getSurveyPricingMatch(surveyId: number): Observable<any> {
    return this.payfactorsApiService.get(`${this.endpoint}/GetSurveyPricingMatch?surveyId=${surveyId}`);
  }

  getSlottedCompanyJobPricingMatch(companyJobId: number): Observable<any> {
    return this.payfactorsApiService.get(`${this.endpoint}/GetSlottedCompanyJobPricingMatch?companyJobId=${companyJobId}`);
  }
}
