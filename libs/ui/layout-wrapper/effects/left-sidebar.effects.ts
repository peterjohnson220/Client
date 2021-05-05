import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';

import * as leftSidebarActions from '../actions/left-sidebar.actions';
import * as leftSidebarReducer from '../reducers/index';
import * as fromFeatureFlagRedirectActions from '../../../state/app-context/actions/feature-flag-redirect.action';
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
          map((sidebarLinks: SidebarLink[]) => new leftSidebarActions.GetLeftSidebarNavigationLinksSuccess(sidebarLinks)),
          catchError(() => of(new leftSidebarActions.GetLeftSidebarNavigationLinksError()))
        )
      )
    );

  // Due to the nature of async, GET_LEFT_SIDEBAR_NAVIGATION_LINKS sometimes triggers before the feature flag redirects are populated.
  // This function will apply the redirects after everything has been loaded.
  @Effect()
  redirectLinksPopulated: Observable<Action> = this.actions$
    .pipe(
      ofType(fromFeatureFlagRedirectActions.GET_USER_REDIRECT_URLS_SUCCESS, leftSidebarActions.GET_LEFT_SIDEBAR_NAVIGATION_LINKS_SUCCESS),
      withLatestFrom(
        this.store.select(fromFeatureFlagRedirectReducer.getFeatureFlagUrls),
        this.store.select(leftSidebarReducer.getLeftSidebarNavigationLinks),
        (action: fromFeatureFlagRedirectActions.GetUserRedirectUrlsSuccess | leftSidebarActions.GetLeftSidebarNavigationLinksSuccess,
         redirectUrls: PageRedirectUrl[], navigationUrls: SidebarLink[]) => ({action, redirectUrls, navigationUrls})
      ),
      switchMap((data: any) => {
        const redirectUrls = data.redirectUrls;
        let navigationUrls = data.navigationUrls;

        if ( redirectUrls.length === 0 || navigationUrls === null) {
          // left sidebar has not fully loaded
          return [];
        }

        navigationUrls = UrlRedirectHelper.applyUrlOverrides<SidebarLink>(data.navigationUrls, this.generateUrlRedirectMapper(), data.redirectUrls);

        return [new leftSidebarActions.UrlRedirectApplicationSuccess(navigationUrls)];
      })
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
