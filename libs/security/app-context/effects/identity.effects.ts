import { Injectable } from '@angular/core';

import { Actions, Effect } from '@ngrx/effects';
import { of } from 'rxjs/observable/of';
// TODO: Investigate switching these to a "lettable operators"
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { CompanySecurityApiService } from '../../../data/payfactors-api';
import * as identityActions from '../actions/identity.actions';


@Injectable()
export class IdentityEffects {

  @Effect()
  getIdentity$ = this.actions$
    .ofType(identityActions.GET_IDENTITY)
    .switchMap(() =>
      this.companySecurityApiService
        .getIdentity()
        .map((identity: any) => new identityActions.GetIdentitySuccess(identity))
        .catch(error => of(new identityActions.GetIdentityError()))
    );

  constructor(
    private actions$: Actions,
    private companySecurityApiService: CompanySecurityApiService
  ) {}
}
