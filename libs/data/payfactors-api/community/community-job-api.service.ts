import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PayfactorsApiService } from '../payfactors-api.service';
import { CommunityJob } from 'libs/models/community/community-job.model';

@Injectable()
export class CommunityJobApiService {
  private endpoint = 'CommunityJobs';

  constructor(private payfactorsApiService: PayfactorsApiService) {
  }

  // TODO: Get range of jobs (start index, number)
  getJobs(): Observable<CommunityJob[]> {
    return this.payfactorsApiService.get<CommunityJob[]>
    (`${this.endpoint}/GetJobs`);
  }

  submitCommunityJob(payload: any): Observable<CommunityJob> {
    return this.payfactorsApiService.post<any>(`${this.endpoint}/Post`, payload);
  }
}
