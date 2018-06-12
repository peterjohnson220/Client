import { Injectable } from '@angular/core';

import { Action } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';

import { NavigationApiService, UserApiService } from '../../../data/payfactors-api';

import * as headerActions from '../actions/header.actions';
import { NavigationLink, HomePageLink } from '../../../models';


@Injectable()
export class HeaderEffects {

  @Effect()
  getHeaderDropdownNavigationLinks$ = this.actions$
    .ofType(headerActions.GET_HEADER_DROPDOWN_NAVIGATION_LINKS).pipe(
      switchMap(() =>
        this.navigationApiService.getHeaderDropdownNavigationLinks().pipe(
          map((navigationLinks: NavigationLink[]) => new headerActions.GetHeaderDropdownNavigationLinksSuccess(navigationLinks)),
          catchError(() => of(new headerActions.GetHeaderDropdownNavigationLinksError()))
        )
      )
    );

  @Effect()
  getHomePageLink$: Observable<Action> = this.actions$
    .ofType(headerActions.GET_HEADER_USER_HOMEPAGE_LINK).pipe(
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
