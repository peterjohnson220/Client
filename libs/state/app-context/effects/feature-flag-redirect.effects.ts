import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';

import { UrlRedirectApiService } from '../../../data/payfactors-api/url-redirect/url-redirect-api.service';
import * as fromFeatureFlagRedirectActions from '../actions/feature-flag-redirect.action';
import { PageRedirectUrl } from '../../../models/url-redirect/page-redirect-url';


@Injectable()
export class FeatureFlagRedirectEffects {

  constructor(private actions$: Actions, private urlRedirectApiService: UrlRedirectApiService) {
  }

  @Effect()
  getFeatureFlagRedirectUrls$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromFeatureFlagRedirectActions.GET_USER_REDIRECT_URLS),
      switchMap((action: fromFeatureFlagRedirectActions.GetUserRedirectUrls) =>
        this.urlRedirectApiService.getFeatureFlagUrls(action.payload).pipe(
          map((pageRedirectUrls: PageRedirectUrl[]) => new fromFeatureFlagRedirectActions.GetUserRedirectUrlsSuccess(pageRedirectUrls)),
          catchError(error => of(new fromFeatureFlagRedirectActions.GetUserRedirectUrlsError(error)))
        )
      )
    );

}
