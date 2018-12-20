import { Injectable } from '@angular/core';

import { Actions, Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';

import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, mergeMap } from 'rxjs/operators';

import { CompanyAdminApiService } from 'libs/data/payfactors-api/company-admin';
import { UserRoleDto } from 'libs/models/admin';
import { UserAssignedRole, UserAndRoleModel } from 'libs/models/security';

import { UserRoleDtoToUserAssignedRoleMapper } from '../mappers';
import * as fromUserRoleActions from '../actions/user-role-view.action';

@Injectable()
export class UserRoleEffects {
  @Effect()
  loadCompanyRoles$: Observable<Action> = this.actions$
    .ofType(fromUserRoleActions.LOAD_COMPANY_ROLES).pipe(
      switchMap(() =>
        this.companyAdminApi.getCompanyRoles().pipe(
          map((companyRoles: UserRoleDto[]) => {
            return companyRoles.map(UserRoleDtoToUserAssignedRoleMapper.mapUserRoleDtoToUserAssignedRole);
          }),
          map((userRoles: UserAssignedRole[]) => new fromUserRoleActions.UpdateCompanyRoles(userRoles)),
          catchError(error => of(new fromUserRoleActions.LoadCompanyRolesError(error)))
        ))
    );

  @Effect()
  addCompanyRole$ = this.actions$
    .ofType(fromUserRoleActions.ADD_COMPANY_ROLE).pipe(
      switchMap((action: fromUserRoleActions.AddCompanyRole) =>
        this.companyAdminApi.addCompanyRole(UserRoleDtoToUserAssignedRoleMapper.mapUserAssignedRoleToUserRoleDto(action.payload)).pipe(
          mergeMap(() => [new fromUserRoleActions.CloseAddCompanyRoleModal(),
                                  new fromUserRoleActions.LoadCompanyRoles()]),
          catchError(error => of(new fromUserRoleActions.AddCompanyRoleError(error)))
        )
      )
    );

  @Effect()
  getUsersAndRoles$: Observable<Action> = this.actions$
    .ofType(fromUserRoleActions.GET_USERS_AND_ROLES).pipe(
      mergeMap(() =>
        this.companyAdminApi.getUsersAndRoles().pipe(
          map((usersAndRoles: UserAndRoleModel[]) => new fromUserRoleActions.GetUsersAndRolesSuccess(usersAndRoles))
        )
      )
    );

  constructor(private actions$: Actions,
              private companyAdminApi: CompanyAdminApiService) {
  }
}
