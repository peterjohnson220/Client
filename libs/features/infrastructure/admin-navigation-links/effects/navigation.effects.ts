import { Injectable } from '@angular/core';

import { Action } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { switchMap, catchError, map } from 'rxjs/operators';

import { NavigationApiService } from 'libs/data/payfactors-api/navigation';
import { NavigationLinkGroup } from 'libs/models';
import { AdminNavigationLinkResponse } from 'libs/models/payfactors-api/navigation';

import * as fromNavigationActions from '../actions/navigation.actions';

@Injectable()
export class NavigationEffects {
    @Effect()
    loadNavigationLinks$: Observable<Action> = this.actions$.pipe(
      ofType<fromNavigationActions.LoadNavigationLinks>(fromNavigationActions.LOAD_NAVIGATION_LINKS),
      switchMap((action: fromNavigationActions.LoadNavigationLinks) => {
        if (action.payload === 'company-admin') {
          return this.navigationApiService.getCompanyAdminNavigationLinks().pipe(
            map((response: AdminNavigationLinkResponse[]) => {
              const links  =
                this.mapResponseToNavigationLinkGroup(response);
              return new fromNavigationActions.LoadNavigationLinksSuccess({adminLinks: links});
            }),
            catchError(error => of(new fromNavigationActions.LoadNavigationLinksError())
          ));
        } else if (action.payload === 'site-admin') {
          return this.navigationApiService.getSiteAdminNavigationLinks().pipe(
            map((response: AdminNavigationLinkResponse[]) => {
              const links  =
                this.mapResponseToNavigationLinkGroup(response);
              return new fromNavigationActions.LoadNavigationLinksSuccess({adminLinks: links});
            }),
            catchError(error => of(new fromNavigationActions.LoadNavigationLinksError())
          ));
        }
      })
    );

    constructor(
        private actions$: Actions,
        private navigationApiService: NavigationApiService
    ) {}

    mapResponseToNavigationLinkGroup(response: any[])
    : NavigationLinkGroup[] {
      return response.map( ngl => {
          return {
            GroupName: ngl.NavigationLinkGroup,
            Links: ngl.Links
          };
      });
    }
}
