import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { switchMap, map, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';

import { SsoConfigApiService } from 'libs/data/payfactors-api/sso/sso-config-api.service';
import * as fromSsoConfigActions from '../actions/sso-config.actions';


@Injectable()
export class SsoConfigEffects {

  @Effect()
  ssoConfig$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromSsoConfigActions.SSO_CONFIGURE),
      switchMap((action: fromSsoConfigActions.SsoConfigure) =>
        this.ssoConfigApiService.createCustomerSsoConnection(action.payload).pipe(
          map((response: any) => {
            return new fromSsoConfigActions.SsoConfigureSuccess(response);
          }),
          catchError( error => of(new fromSsoConfigActions.SsoConfigureError(error)))
        )
      )
    );

  constructor(
    private actions$: Actions,
    private ssoConfigApiService: SsoConfigApiService
  ) {}

}
