import { Injectable } from '@angular/core';

import { Action } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { switchMap, catchError, map } from 'rxjs/operators';

import { NavigationApiService } from 'libs/data/payfactors-api/navigation';

import * as fromNavigationActions from '../actions/navigation.actions';
import { SiteAdminNavigationLinkResponse } from 'libs/models/payfactors-api/navigation';
import { PayfactorsApiModelMapper } from '../helpers/payfactors-api-model-mapper';

@Injectable()
export class NavigationEffects {
    @Effect()
    loadNavigationLinks$: Observable<Action> = this.actions$
        .ofType(fromNavigationActions.LOAD_NAVIGATION_LINKS).pipe(
            switchMap((action: fromNavigationActions.LoadCompanyAdminNavigationLinks) =>
                this.navigationApiService.getCompanyAdminNavigationLinks().pipe(
                    map((response: SiteAdminNavigationLinkResponse[]) => {
                        const links  =
                            PayfactorsApiModelMapper.mapCompanyAdminNavigationLinkResponseToNavigationLinkGroup(response);
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
}
