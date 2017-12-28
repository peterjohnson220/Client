import { Injectable } from '@angular/core';

import { Actions, Effect } from '@ngrx/effects';
import { of } from 'rxjs/observable/of';
// TODO: Investigate switching these to a "lettable operators"
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { NavigationApiService } from '../../../data/payfactors-api';

import * as leftSidebarActions from '../actions/left-sidebar.actions';
import { SidebarLink } from '../../../models';


@Injectable()
export class LeftSidebarEffects {

  @Effect()
  getLeftSidebarNavigationlinks$ = this.actions$
    .ofType(leftSidebarActions.GET_LEFT_SIDEBAR_NAVIGATION_LINKS)
    .switchMap(() =>
      this.navigationApiService
        .getSideBarLinks()
        .map((sidebarLinks: SidebarLink[]) => new leftSidebarActions.GetLeftSidebarNavigationLinksSuccess(sidebarLinks))
        .catch(() => of(new leftSidebarActions.GetLeftSidebarNavigationLinksError()))
    );

  constructor(
    private actions$: Actions,
    private navigationApiService: NavigationApiService
  ) {}
}
