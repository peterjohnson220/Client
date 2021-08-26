import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { PayfactorsApiService } from '../payfactors-api.service';
import {
  CompensableFactorsRequestModel,
  CompensableFactorsResponseModel,
  GetCrowdSourcedEducationTypesResponse,
  GetCrowdSourcedJobPricingResponse,
  SearchCrowdSourcedJobsResponse
} from '../../../models/payfactors-api';
import { GetCrowdSourcedJobPricingRequest } from '../../../models/comphub/get-crowd-sourced-job-pricing';

@Injectable({
  providedIn: 'root',
})
export class ComphubCrowdSourcedApiService {
  private endpoint = 'CrowdSourcedData';

  constructor(private payfactorsApiService: PayfactorsApiService) {}

  getCompensableFactors(request: CompensableFactorsRequestModel): Observable<CompensableFactorsResponseModel[]> {
    return this.payfactorsApiService.post<CompensableFactorsResponseModel[]>(`${this.endpoint}/GetCompensableFactors`, request);
  }

  searchCrowdSourcedJobs(jobTitle: string): Observable<SearchCrowdSourcedJobsResponse> {
    return this.payfactorsApiService.get<SearchCrowdSourcedJobsResponse>(`${this.endpoint}/SearchCrowdSourcedJobs`,
      { params: { jobTitle: jobTitle } });
  }

  getCrowdSourcedJobPricing(request: GetCrowdSourcedJobPricingRequest): Observable<GetCrowdSourcedJobPricingResponse> {
    return this.payfactorsApiService.post<GetCrowdSourcedJobPricingResponse>(`${this.endpoint}/GetCrowdSourcedJobPricing`, request);
  }

  getCrowdSourcedEducationTypes(): Observable<GetCrowdSourcedEducationTypesResponse[]> {
    return this.payfactorsApiService.get<GetCrowdSourcedEducationTypesResponse[]>(`${this.endpoint}/GetCrowdSourcedEducationTypes`);
  }
}
