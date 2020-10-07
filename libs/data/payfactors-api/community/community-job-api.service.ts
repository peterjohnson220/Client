import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PayfactorsApiService } from '../payfactors-api.service';
import { CommunityJob } from 'libs/models/community/community-job.model';
import { CommunityJobSearchResponse } from 'libs/models/community/community-job-search-response.model';

@Injectable({
  providedIn: 'root',
})
export class CommunityJobApiService {
  private endpoint = 'CommunityJobs';

  constructor(private payfactorsApiService: PayfactorsApiService) {
  }

  getJobs(jobSearchRequest: any): Observable<any> {
    return this.payfactorsApiService.post(`${this.endpoint}/GetJobs`, jobSearchRequest);
  }

  submitCommunityJob(payload: any): Observable<CommunityJob> {
    return this.payfactorsApiService.post<any>(`${this.endpoint}/Post`, payload);
  }

  updateJobDeletedFlag(payload: any): Observable<CommunityJob> {
    return this.payfactorsApiService.put<any>(`${this.endpoint}/DeleteJob`, payload);
  }
}
