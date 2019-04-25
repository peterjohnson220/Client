import { Injectable } from '@angular/core';

import { Action } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';
import { switchMap, catchError, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { NavigationApiService } from 'libs/data/payfactors-api/navigation';

import * as fromNavigationActions from '../actions/navigation-links.actions';
import { PayfactorsApiModelMapper } from '../helpers/payfactors-api-model-mapper';
import { SiteAdminNavigationLinkResponse } from 'libs/models/payfactors-api/navigation';

@Injectable()
export class NavigationEffects {
    @Effect()
    loadNavigationLinks$: Observable<Action> = this.actions$
        .ofType(fromNavigationActions.LOAD_NAVIGATION_LINKS).pipe(
            switchMap((action: fromNavigationActions.LoadNavigationLinks) =>
                this.navigationApiService.getSiteAdminNavigationLinks().pipe(
                    map((response: SiteAdminNavigationLinkResponse[]) => {
                        const links  =
                            PayfactorsApiModelMapper.mapSiteAdminNavigationLinkResponseToNavigationLinkGroup(response);
                        return new fromNavigationActions.LoadNavigationLinksSuccess(links);
                }),
                catchError(error => of(new fromNavigationActions.LoadNavigationLinksError()))
            )
        )
    );

    constructor(
        private actions$: Actions,
        private navigationApiService: NavigationApiService
    ) {}
}
