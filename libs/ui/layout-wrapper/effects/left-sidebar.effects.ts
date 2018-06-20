import { Injectable } from '@angular/core';

import { Actions, Effect } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { NavigationApiService } from '../../../data/payfactors-api';

import * as leftSidebarActions from '../actions/left-sidebar.actions';
import { SidebarLink } from '../../../models';


@Injectable()
export class LeftSidebarEffects {

  @Effect()
  getLeftSidebarNavigationlinks$ = this.actions$
    .ofType(leftSidebarActions.GET_LEFT_SIDEBAR_NAVIGATION_LINKS).pipe(
      switchMap(() =>
        this.navigationApiService.getSideBarLinks().pipe(
          map((sidebarLinks: SidebarLink[]) => new leftSidebarActions.GetLeftSidebarNavigationLinksSuccess(sidebarLinks)),
          catchError(() => of(new leftSidebarActions.GetLeftSidebarNavigationLinksError()))
        )
      )
    );

  constructor(
    private actions$: Actions,
    private navigationApiService: NavigationApiService
  ) {}
}
