import { Injectable } from '@angular/core';
import {PayfactorsApiService} from '../payfactors-api.service';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class JobsApiService {
  private endpoint = 'jobs';
  constructor(private payfactorsApiService: PayfactorsApiService
  ) {}
  addJobsToProject(jobIds: number[]): Observable<any> {
    return this.payfactorsApiService.post<any>(`${this.endpoint}/AddToProject`, jobIds);
  }
}
