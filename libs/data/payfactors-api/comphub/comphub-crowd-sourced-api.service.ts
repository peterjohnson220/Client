import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { PayfactorsApiService } from '../payfactors-api.service';
import { CompensableFactorsRequestModel } from '../../../models/payfactors-api/comphub/request/compensable-factors-request.model';
import {
  CompensableFactorsResponseModel,
  GetCrowdSourcedJobPricingResponse,
  SearchCrowdSourcedJobsResponse
} from '../../../models/payfactors-api/comphub/response';

@Injectable({
  providedIn: 'root',
})
export class ComphubCrowdSourcedApiService {
  private endpoint = 'CrowdSourcedData';

  constructor(private payfactorsApiService: PayfactorsApiService) {}

  getCompensableFactors(request: CompensableFactorsRequestModel): Observable<CompensableFactorsResponseModel[]> {
    return this.payfactorsApiService.post<CompensableFactorsResponseModel[]>(`${this.endpoint}/GetCompensableFactors`, request);
  }

  searchCrowdSourcedJobs(jobTitle: string): Observable<SearchCrowdSourcedJobsResponse>  {
    return this.payfactorsApiService.get<SearchCrowdSourcedJobsResponse>(`${this.endpoint}/SearchCrowdSourcedJobs`,
      { params: { jobTitle: jobTitle } });
  }

  getCrowdSourcedJobPricing(jobTitle: string, country: string, paymarketId): Observable<GetCrowdSourcedJobPricingResponse>  {
    const params = !!paymarketId ? { jobTitle: jobTitle, country: country, paymarketId: paymarketId } : { jobTitle: jobTitle, country: country };
    return this.payfactorsApiService.get<GetCrowdSourcedJobPricingResponse>(`${this.endpoint}/GetCrowdSourcedJobPricing`,
      { params: params });
  }
}
