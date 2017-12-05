import { Injectable } from '@angular/core';

import { Actions, Effect } from '@ngrx/effects';
import { of } from 'rxjs/observable/of';
// TODO: Investigate switching these to a "lettable operators"
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { NavigationApiService } from '../../../data/payfactors-api';

import * as headerActions from '../actions/header.actions';
import { NavigationLink } from '../../../models';


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

  constructor(
    private actions$: Actions,
    private navigationApiService: NavigationApiService
  ) {}
}
