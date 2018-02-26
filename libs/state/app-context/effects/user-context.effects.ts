import { Injectable } from '@angular/core';

import { Actions, Effect } from '@ngrx/effects';
import { of } from 'rxjs/observable/of';
// TODO: Investigate switching these to a "lettable operators"
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { CompanySecurityApiService } from '../../../data/payfactors-api/index';
import * as userContextActions from '../actions/user-context.actions';


@Injectable()
export class UserContextEffects {

  @Effect()
  getUserContext$ = this.actions$
    .ofType(userContextActions.GET_USER_CONTEXT)
    .switchMap(() =>
      this.companySecurityApiService
        .getIdentity()
        .map((identity: any) => new userContextActions.GetUserContextSuccess(identity))
        .catch(error => {
          return of(new userContextActions.GetUserContextError(error));
        })
    );

  @Effect()
  getUserContextError$ = this.actions$
    .ofType(userContextActions.GET_USER_CONTEXT_ERROR)
    .map((action: userContextActions.GetUserContextError) => action.error)
    .switchMap(error => {
        if (error.status === 401) {
          return of(new userContextActions.GetUserContext401Error());
        }
      }
    );

  @Effect()
  getUserContext401Error$ = this.actions$
    .ofType(userContextActions.GET_USER_CONTEXT_401_ERROR)
    .switchMap(() => {
        window.location.href = `/login.asp?${window.location.pathname}`;
        return null;
      }
    );

  constructor(private actions$: Actions,
              private companySecurityApiService: CompanySecurityApiService) {
  }
}
