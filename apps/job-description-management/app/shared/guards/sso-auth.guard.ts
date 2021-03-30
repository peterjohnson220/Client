import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { take, filter } from 'rxjs/operators';
import * as fromRootState from 'libs/state/state';
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

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
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
          if (result.authResult.RequiresStandardLogin) {
            const currentURL = window.location.href;
            const id = currentURL.slice(0, currentURL.indexOf('?')).slice(currentURL.lastIndexOf('/') + 1);
            const ssoRedirectPath = `/client/job-description-management/job-descriptions/${id}?jwt-workflow=${this.jwtTokenId}`;
            const encodedUrl = encodeURIComponent(ssoRedirectPath);

            if (!!result.authResult.JwtSsoLoginUrl) {
              window.location.href = `${result.authResult.JwtSsoLoginUrl}${encodedUrl}`;
            } else {
              this.router.navigateByUrl(`/job-descriptions/${id}?jwt-workflow=${this.jwtTokenId}`).then(value => window.location.reload());
              return false;
            }

            return true;
          }
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
