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
        .catch(() => of(new userContextActions.GetUserContextError()))
    );

  constructor(
    private actions$: Actions,
    private companySecurityApiService: CompanySecurityApiService
  ) {}
}
