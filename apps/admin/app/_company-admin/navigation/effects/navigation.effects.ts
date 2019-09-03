import { Injectable } from '@angular/core';

import { Action } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { switchMap, catchError, map } from 'rxjs/operators';

import { NavigationApiService } from 'libs/data/payfactors-api/navigation';

import * as fromNavigationActions from '../actions/navigation.actions';
import { SiteAdminNavigationLinkResponse, CompanyAdminNavigationLinkResponse } from 'libs/models/payfactors-api/navigation';
import { NavigationLinkGroup } from 'libs/models';

@Injectable()
export class NavigationEffects {
    @Effect()
    loadNavigationLinks$: Observable<Action> = this.actions$
        .pipe(
            ofType(fromNavigationActions.LOAD_NAVIGATION_LINKS),
            switchMap((action: fromNavigationActions.LoadCompanyAdminNavigationLinks) =>
                this.navigationApiService.getCompanyAdminNavigationLinks().pipe(
                    map((response: SiteAdminNavigationLinkResponse[]) => {
                        const links  =
                            this.mapCompanyAdminNavigationLinkResponseToNavigationLinkGroup(response);
                        return new fromNavigationActions.LoadCompanyAdminNavigationLinksSuccess(links);
                }),
                catchError(error => of(new fromNavigationActions.LoadCompanyAdminNavigationLinksError()))
            )
        )
    );

    constructor(
        private actions$: Actions,
        private navigationApiService: NavigationApiService
    ) {}

    mapCompanyAdminNavigationLinkResponseToNavigationLinkGroup(response: CompanyAdminNavigationLinkResponse[])
    : NavigationLinkGroup[] {
    return response.map(canlr => {
      return {
        GroupName: canlr.NavigationLinkGroup,
        Links: canlr.Links
      };
    });
  }
}
