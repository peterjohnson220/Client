import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';

import * as leftSidebarActions from '../actions/left-sidebar.actions';
import { SidebarLink } from '../../../models';
import { PageRedirectUrl } from '../../../models/url-redirect/page-redirect-url';
import { UrlPage } from '../../../models/url-redirect/url-page';
import * as fromFeatureFlagRedirectReducer from '../../../state/state';
import { NavigationApiService } from '../../../data/payfactors-api';
import { UrlRedirectHelper } from '../../../core/helpers/url-redirect-helper';
import { GenericUrlPageMap } from '../../../core/helpers/models/generic-url-page-map';


@Injectable()
export class LeftSidebarEffects {

  @Effect()
  getLeftSidebarNavigationlinks$ = this.actions$
    .pipe(
      ofType(leftSidebarActions.GET_LEFT_SIDEBAR_NAVIGATION_LINKS),
      withLatestFrom(
        this.store.select(fromFeatureFlagRedirectReducer.getFeatureFlagUrls),
        (action: leftSidebarActions.GetLeftSidebarNavigationLinks, redirectUrls: PageRedirectUrl[]) => ({action, redirectUrls})
      ),
      switchMap((data: any) =>
        this.navigationApiService.getSideBarLinks().pipe(
          map((sidebarLinks: SidebarLink[]) =>
            UrlRedirectHelper.applyUrlOverrides<SidebarLink>(sidebarLinks, this.generateUrlRedirectMapper(), data.redirectUrls)),
          map((sidebarLinks: SidebarLink[]) => new leftSidebarActions.GetLeftSidebarNavigationLinksSuccess(sidebarLinks)),
          catchError(() => of(new leftSidebarActions.GetLeftSidebarNavigationLinksError()))
        )
      )
    );

  constructor(
    private actions$: Actions,
    private navigationApiService: NavigationApiService,
    private store: Store<fromFeatureFlagRedirectReducer.State>
  ) {}

  private generateUrlRedirectMapper(): GenericUrlPageMap[] {
    const mapper: GenericUrlPageMap[] = [
      { SourceKey: 'Name', SourceKeyValue: 'Pricing Projects', SourceUrlAttributeName: 'Url', TargetPage: UrlPage.ProjectList }
    ];

    return mapper;
  }
}
