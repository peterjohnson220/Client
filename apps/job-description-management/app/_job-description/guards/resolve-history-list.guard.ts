import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';

import { Observable } from 'rxjs';

import { JobDescriptionApiService } from 'libs/data/payfactors-api/jdm';

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
