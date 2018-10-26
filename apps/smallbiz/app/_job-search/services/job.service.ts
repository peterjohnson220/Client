import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { Job } from '../models/job';
import { environment } from '../../../../../environments/environment';
import { JobSearchResult } from '../models/job-search-result';

const BASE_API_URL = environment.smallBusinessApiUrl;

@Injectable()
export class JobService {

  constructor(private httpClient: HttpClient) { }

  search(searchTerm = ''): Observable<JobSearchResult> {
    const url = `${BASE_API_URL}job?searchTerm=${searchTerm}`;
    return this.httpClient.get<JobSearchResult>(url);
  }

  getJob(id: number): Observable<Job> {
    const url = `${BASE_API_URL}job/${id}`;
    return this.httpClient.get<Job>(url);
  }

  getRelatedJobs(jobId: number): Observable<Job[]> {
    const url = `${BASE_API_URL}job/${jobId}/related-jobs`;
    return this.httpClient.get<Job[]>(url);
  }
}
