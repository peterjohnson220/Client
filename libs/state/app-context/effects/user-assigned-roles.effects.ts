import {Inject, Injectable, PLATFORM_ID} from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';

import { UserApiService } from '../../../data/payfactors-api';
import * as userAssignedRoleActions from '../actions/user-assigned-roles.actions';

@Injectable()
export class UserAssignedRoleEffects {
  @Effect()
  getUserAssignedRoles$ = this.actions$
    .pipe(
      ofType(userAssignedRoleActions.GET_USER_ASSIGNED_ROLES),
      switchMap(() =>
        this.userApiService.getUserAssignedRoles().pipe(
          map((userAssignedRoles: any) => new userAssignedRoleActions.GetUserAssignedRolesSuccess(userAssignedRoles)),
          catchError(error => {
              return of(new userAssignedRoleActions.GetUserAssignedRolesError(error));
            }
          )
        )
      )
    );

  constructor(private actions$: Actions,
              private userApiService: UserApiService,
              @Inject(PLATFORM_ID) private platformId: Object) {
  }
}
