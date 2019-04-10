import { Injectable } from '@angular/core';

import { Actions, Effect } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';

import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, mergeMap } from 'rxjs/operators';

import { DataType } from 'libs/models/security/roles/data-type';
import { RolesApiService } from 'libs/data/payfactors-api/company-admin';
import { UserAssignedRole, UserAndRoleModel } from 'libs/models/security/roles';
import { RoleApiResponse } from '../constants/user-role.constants';

import * as fromUserRoleActions from '../actions/user-role-view.action';
import * as fromDataAccessActions from '../actions/data-access-tab.action';
import * as fromUserRoleUserTabActions from '../actions/user-role-users-tab.action';
import * as fromUserRoleFunctionTabActions from '../actions/user-role-functions-tab.action';
import * as fromUserRoleViewReducer from '../reducers';




@Injectable()
export class UserRoleEffects {
  @Effect()
  loadCompanyRoles$: Observable<Action> = this.actions$
    .ofType(fromUserRoleActions.LOAD_COMPANY_ROLES).pipe(
      switchMap(() =>
        this.adminRolesApi.getRoles().pipe(
          map((userRoles: UserAssignedRole[]) => new fromUserRoleActions.UpdateCompanyRoles(userRoles)),
          catchError(error => of(new fromUserRoleActions.LoadCompanyRolesError(error)))
        ))
    );

  @Effect()
  addCompanyRole$ = this.actions$
    .ofType(fromUserRoleActions.ADD_COMPANY_ROLE).pipe(
      switchMap((action: fromUserRoleActions.AddCompanyRole) =>
        this.adminRolesApi.addRole(action.payload).pipe(
          mergeMap(() => [new fromUserRoleActions.CloseAddCompanyRoleModal(),
                                  new fromUserRoleActions.LoadCompanyRoles()]),
          catchError(error => of(new fromUserRoleActions.AddCompanyRoleError(error)))
        )
      )
    );

  @Effect()
  getUsersAndRoles$: Observable<Action> = this.actions$
    .ofType(fromUserRoleUserTabActions.GET_USERS_AND_ROLES).pipe(
      mergeMap(() =>
        this.adminRolesApi.getUsersAndRoles().pipe(
          map((usersAndRoles: UserAndRoleModel[]) => new fromUserRoleUserTabActions.GetUsersAndRolesSuccess(usersAndRoles))
        )
      )
    );

  @Effect()
  changeActiveRole$: Observable<Action> = this.actions$
    .ofType(fromUserRoleActions.UPDATE_CURRENT_USER_ROLE).pipe(
      mergeMap((action: fromUserRoleActions.UpdateCurrentUserRole) =>
        [new fromUserRoleUserTabActions.CancelChanges(),
          new fromUserRoleUserTabActions.UpdateUserTabCurrentUserRole(action.payload.RoleId),
        new fromUserRoleFunctionTabActions.UpdateCurrentRoleFunctionTab(action.payload)])
    );

  @Effect()
  saveAllChanges$: Observable<Action> = this.actions$
    .ofType(fromUserRoleActions.SAVE_ALL_CHANGES).pipe(
      switchMap((action: fromUserRoleActions.SaveAllChanges) => {
        return this.adminRolesApi.saveRole(action.payload.PermissionIdsToSave, action.payload.UserIdsToAssign,
          action.payload.CurrentRole.RoleId, action.payload.CurrentRole.IsSystemRole).pipe(
          mergeMap(response => {
            const actions = [];
            actions.push(new fromUserRoleUserTabActions.GetUsersAndRolesSuccess(response.UpdatedUsers));
            actions.push(new fromUserRoleActions.UpdateCurrentUserRole(response.UpdatedRole));
            actions.push(new fromUserRoleActions.UpdateCompanyRoles(response.UpdatedRoleList));
            actions.push(new fromUserRoleActions.SaveRoleSuccess(RoleApiResponse.Success));
            return actions;
          }),
          catchError(error => of(new fromUserRoleActions
            .SaveRoleError(RoleApiResponse.Error)))
        );
      })
    );

  @Effect()
  cancelAllChanges$: Observable<Action> = this.actions$
    .ofType(fromUserRoleActions.CANCEL_ALL_CHANGES).pipe(
      mergeMap((action: fromUserRoleActions.CancelAllChanges) =>
        [new fromUserRoleUserTabActions.CancelChanges(), new fromUserRoleFunctionTabActions.CancelPermissionChanges()])
    );

    @Effect()
    loadDataTypes$: Observable<Action> = this.actions$
      .ofType(fromDataAccessActions.LOAD_DATA_TYPES).pipe(
        switchMap((action: fromDataAccessActions.LoadDataTypes) => this.adminRolesApi.getDataTypes().pipe(
          map((dataTypes: DataType[]) => {
            return new fromDataAccessActions.LoadedDataTypes(dataTypes); })
        ))
      );

  constructor(private actions$: Actions,
              private adminRolesApi: RolesApiService,
              private store: Store<fromUserRoleViewReducer.State>) {
  }
}
