import { Injectable, OnInit } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { combineLatest, Observable, Subscription } from 'rxjs';
import { map, take, tap, filter, switchMap, withLatestFrom } from 'rxjs/operators';
import { UserContext } from '../../../../../libs/models/security';
import * as fromRootState from '../../../../../libs/state/state';
import * as fromJobDescriptionActions from '../../_job-description/actions/job-description.actions';
import * as fromJobDescriptionReducers from '../../_job-description/reducers';

@Injectable()
export class SsoAuthGuard implements CanActivate {
  jwtTokenId: string;
  ssoTokenId: string;
  ssoAgentId: string;
  viewName: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userContextStore: Store<fromRootState.State>,
    private store: Store<fromJobDescriptionReducers.State>
  ) {

  }

  canActivate(route: ActivatedRouteSnapshot) {
    this.jwtTokenId = route.queryParams[ 'jwt' ];
    this.ssoTokenId = route.queryParams[ 'tokenid' ];
    this.ssoAgentId = route.queryParams[ 'agentid' ];
    this.viewName = route.queryParams[ 'viewName' ];

    if (this.jwtTokenId) {
      this.store.dispatch(new fromJobDescriptionActions.AuthenticateSSOParams({
        tokenId: this.ssoTokenId ?? '',
        agentId: this.ssoAgentId ?? ''
      }));

      return this.waitForSSOAuthResult().map(result => {
        if (result.authResult) {
          return true;
        } else if (result.authError) {

          if (!result.authError.error.JwtSsoLoginUrl) {
            this.router.navigate(['/forbidden']);
            return false;
          }

          const currentURL = window.location.href;
          let currentURLWithToken = `${currentURL.slice(0, currentURL.indexOf('?'))}?jwt=${this.jwtTokenId}`;

          if (this.viewName) {
            currentURLWithToken += `&viewName=${this.viewName}`;
          }

          const encodedUrl = encodeURIComponent(currentURLWithToken);

          window.location.href = `${result.authError.error.JwtSsoLoginUrl}&appurl=${encodedUrl}`;
        }
      });

    } else {
      return true;
    }
  }

  waitForSSOAuthResult() {
    return Observable.combineLatest(
      this.store.select(fromJobDescriptionReducers.getJobDescriptionSSOAuthResult),
      this.store.select(fromJobDescriptionReducers.getJobDescriptionSSOAuthError),
      (authResult, authError) => ({ authResult, authError })).pipe(filter(a => a.authError != null || a.authResult != null), take(1));
  }
}
