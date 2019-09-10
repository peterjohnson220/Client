import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs/Observable';

import {JobDescriptionApiService} from 'libs/data/payfactors-api/jdm';


@Injectable()
export class JobDescriptionJobCompareListResolver implements Resolve<any> {
  constructor(
    private jobDescriptionApiService: JobDescriptionApiService
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any>|Promise<any>|any {
    return this.jobDescriptionApiService.getJobDescriptionJobCompareList(route.params.id);
  }
}
