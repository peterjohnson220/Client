import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';

import { select, Store } from '@ngrx/store';
import { filter, map, switchMap, take } from 'rxjs/operators';

import { JobDescriptionTemplateApiService } from 'libs/data/payfactors-api/jdm';

import * as fromTemplateListReducer from 'libs/features/jobs/job-description-management/reducers';
import * as fromTemplateListActions from 'libs/features/jobs/job-description-management/actions/template-list.actions';

@Injectable()
export class LoadJobDescriptionLoaderGuard implements CanActivate {

    constructor(
        private store: Store<fromTemplateListReducer.State>,
        private jobDescriptionTemplateApiService: JobDescriptionTemplateApiService,
        private router: Router
    ) { }

    loadJobDescriptionLoader(companyId: number) {
      this.store.dispatch(new fromTemplateListActions.LoadTemplateListByCompanyId({companyId: companyId, publishedOnly: true }));

      return this.waitForTemplateList().pipe(
        switchMap(() =>
        this.store.pipe(
          select(fromTemplateListReducer.getTemplateListLoadingError),
          map(error => {
            if (!error) {
              return true;
            } else {
              this.router.navigate(['/not-found']);
              return false;
            }
          })
        )));
    }

    canActivate(route: ActivatedRouteSnapshot) {
        return this.loadJobDescriptionLoader(parseInt(route.params['id'], 10));
    }

  // This will not emit any values until a attempt to get the template list from the API has completed with either
  // a Success or Error.
  waitForTemplateList() {
      return this.store.pipe(
        select(fromTemplateListReducer.getTemplateListLoading),
        filter((isLoading) => !isLoading),
        take(1)
      );
  }
}
