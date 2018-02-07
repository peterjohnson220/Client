import { Injectable } from '@angular/core';

import { Action } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
// TODO: Investigate switching these to a "lettable operators"
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { NavigationApiService, UserApiService } from '../../../data/payfactors-api';

import * as headerActions from '../actions/header.actions';
import { NavigationLink, HomePageLink } from '../../../models';


@Injectable()
export class HeaderEffects {

  @Effect()
  getHeaderDropdownNavigationLinks$ = this.actions$
    .ofType(headerActions.GET_HEADER_DROPDOWN_NAVIGATION_LINKS)
    .switchMap(() =>
      this.navigationApiService
        .getHeaderDropdownNavigationLinks()
        .map((navigationLinks: NavigationLink[]) => new headerActions.GetHeaderDropdownNavigationLinksSuccess(navigationLinks))
        .catch(() => of(new headerActions.GetHeaderDropdownNavigationLinksError()))
    );

  @Effect()
  getHomePageLink$: Observable<Action> = this.actions$
    .ofType(headerActions.GET_HEADER_USER_HOMEPAGE_LINK)
    .map((action: headerActions.GetHeaderUserHomePageLink) => action.payload)
    .switchMap(payload =>
      this.userApiService
        .getUserHomePage(payload.userId)
        .map((homePageLink: HomePageLink) => new headerActions.GetHeaderUserHomePageLinkSuccess(homePageLink))
        .catch(() => of(new headerActions.GetHeaderUserHomePageLinkError()))
    );

  constructor(
    private actions$: Actions,
    private navigationApiService: NavigationApiService,
    private userApiService: UserApiService
  ) {}
}
