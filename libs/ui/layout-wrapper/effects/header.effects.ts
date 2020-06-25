import { Injectable } from '@angular/core';

import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';

import { NavigationApiService, UserApiService } from '../../../data/payfactors-api';

import * as headerActions from '../actions/header.actions';
import { NavigationLink, HomePageLink } from '../../../models';


@Injectable()
export class HeaderEffects {

  @Effect()
  getHeaderDropdownNavigationLinks$ = this.actions$
    .pipe(
      ofType(headerActions.GET_HEADER_DROPDOWN_NAVIGATION_LINKS),
      switchMap(() =>
        this.navigationApiService.getHeaderDropdownNavigationLinks().pipe(
          map((navigationLinks: NavigationLink[]) => new headerActions.GetHeaderDropdownNavigationLinksSuccess(navigationLinks)),
          catchError(() => of(new headerActions.GetHeaderDropdownNavigationLinksError()))
        )
      )
    );

  @Effect()
  getSsoHeaderDropdownNavigationLinks$ = this.actions$
    .pipe(
      ofType(headerActions.GET_SSO_HEADER_DROPDOWN_NAVIGATION_LINKS),
      switchMap(() =>
        this.navigationApiService.getSsoHeaderDropdownNavigationLinks().pipe(
          map((navigationLinks: NavigationLink[]) => new headerActions.GetSsoHeaderDropdownNavigationLinksSuccess(navigationLinks)),
          catchError(() => of(new headerActions.GetSsoHeaderDropdownNavigationLinksError()))
        )
      )
    );

  @Effect()
  getHomePageLink$: Observable<Action> = this.actions$
    .pipe(
      ofType(headerActions.GET_HEADER_USER_HOMEPAGE_LINK),
      map((action: headerActions.GetHeaderUserHomePageLink) => action.payload),
      switchMap(payload =>
        this.userApiService.getUserHomePage(payload.userId).pipe(
          map((homePageLink: HomePageLink) => new headerActions.GetHeaderUserHomePageLinkSuccess(homePageLink)),
          catchError(() => of(new headerActions.GetHeaderUserHomePageLinkError()))
        )
      )
    );

  constructor(
    private actions$: Actions,
    private navigationApiService: NavigationApiService,
    private userApiService: UserApiService
  ) {}
}
