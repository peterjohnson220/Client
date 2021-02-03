import { Injectable } from '@angular/core';

import { Effect, Actions, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { switchMap, map, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { SiteAdminApiService } from 'libs/data/payfactors-api/site-admin';

import * as fromSiteAdminRouteActions from '../actions/site-admin-route.actions';


@Injectable()
export class SiteAdminRouteEffects {
  @Effect()
  getRepositoriesByRoute$ = this.actions$
    .pipe(
      ofType(fromSiteAdminRouteActions.GET_REPOSITORIES_BY_ROUTE),
      switchMap((action: fromSiteAdminRouteActions.GetRepositoriesByRoute) =>
        this.siteAdminApiService.getRepositoriesByRoute(action.payload).pipe(
          map((repositoriesList: number[]) => {
            return new fromSiteAdminRouteActions.GetRepositoriesByRouteSuccess(repositoriesList);
          }),
          catchError(error => of(new fromSiteAdminRouteActions.GetRepositoriesByRouteError()))
        )
      )
    );

  constructor(
    private actions$: Actions,
    private siteAdminApiService: SiteAdminApiService
  ) { }
}
