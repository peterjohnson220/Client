import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';

import { Observable } from 'rxjs';

import {JobDescriptionApiService} from '../services/job-description-api.service';

@Injectable()
export class ResolveHistoryListGuard implements Resolve<any>  {
  constructor(
    private jobDescriptionApiService: JobDescriptionApiService
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any>|any {
    return this.jobDescriptionApiService.getHistoryList(route.params.id);
  }
}
