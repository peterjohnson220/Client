import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { PayfactorsApiService } from '../payfactors-api.service';
import {
  CompensableFactorsRequestModel,
  CompensableFactorsResponse,
  GetCrowdSourcedEducationTypesResponse,
  GetCrowdSourcedJobPricingRequest,
  GetCrowdSourcedJobPricingResponse,
  SaveExportDataRequest,
  SearchCrowdSourcedJobsResponse
} from '../../../models/payfactors-api';

@Injectable({
  providedIn: 'root',
})
export class ComphubCrowdSourcedApiService {
  private endpoint = 'CrowdSourcedData';

  constructor(private payfactorsApiService: PayfactorsApiService) {}

  getCompensableFactors(request: CompensableFactorsRequestModel): Observable<CompensableFactorsResponse[]> {
    return this.payfactorsApiService.post<CompensableFactorsResponse[]>(`${this.endpoint}/GetCompensableFactors`, request);
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

  saveExportData(request: SaveExportDataRequest): Observable<string> {
    return this.payfactorsApiService.post<string>(`${this.endpoint}/SaveExportData`, request);
  }
}
