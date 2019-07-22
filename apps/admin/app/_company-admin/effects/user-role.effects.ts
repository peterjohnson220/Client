import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';

import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, mergeMap } from 'rxjs/operators';

import { DataType } from 'libs/models/security/roles/data-type.model';
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
    .pipe(
      ofType(fromUserRoleActions.LOAD_COMPANY_ROLES),
      switchMap(() =>
        this.adminRolesApi.getRoles().pipe(
          map((userRoles: UserAssignedRole[]) => new fromUserRoleActions.UpdateCompanyRoles(userRoles)),
          catchError(error => of(new fromUserRoleActions.LoadCompanyRolesError(error)))
        ))
    );

  @Effect()
  addCompanyRole$ = this.actions$
    .pipe(
      ofType(fromUserRoleActions.ADD_COMPANY_ROLE),
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
    .pipe(
      ofType(fromUserRoleUserTabActions.GET_USERS_AND_ROLES),
      mergeMap(() =>
        this.adminRolesApi.getUsersAndRoles().pipe(
          map((usersAndRoles: UserAndRoleModel[]) => new fromUserRoleUserTabActions.GetUsersAndRolesSuccess(usersAndRoles))
        )
      )
    );

  @Effect()
  changeActiveRole$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromUserRoleActions.UPDATE_CURRENT_USER_ROLE),
      mergeMap((action: fromUserRoleActions.UpdateCurrentUserRole) =>
        [new fromUserRoleUserTabActions.CancelChanges(),
          new fromUserRoleUserTabActions.UpdateUserTabCurrentUserRole(action.payload),
          new fromDataAccessActions.UpdateCurrentRole(action.payload),
        new fromUserRoleFunctionTabActions.UpdateCurrentRoleFunctionTab(action.payload)])
    );

  @Effect()
  saveAllChanges$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromUserRoleActions.SAVE_ALL_CHANGES),
      switchMap((action: fromUserRoleActions.SaveAllChanges) => {
        return this.adminRolesApi.saveRole(action.payload.PermissionIdsToSave,
          action.payload.UserIdsToAssign, action.payload.DataRestrictions,
          action.payload.CurrentRole.RoleId, action.payload.CurrentRole.IsSystemRole).pipe(
          mergeMap(response => {
            const actions = [];
            actions.push(new fromUserRoleUserTabActions.GetUsersAndRolesSuccess(response.UpdatedUsers));
            actions.push(new fromUserRoleActions.UpdateCompanyRoles(response.UpdatedRoleList));
            actions.push(new fromUserRoleActions.UpdateCurrentUserRole(response.UpdatedRole));
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
    .pipe(
      ofType(fromUserRoleActions.CANCEL_ALL_CHANGES),
      mergeMap((action: fromUserRoleActions.CancelAllChanges) =>
        [new fromUserRoleUserTabActions.CancelChanges(),
          new fromDataAccessActions.CancelRoleDataRestrictionChanges(),
          new fromUserRoleFunctionTabActions.CancelPermissionChanges()])
    );

    @Effect()
    loadDataTypes$: Observable<Action> = this.actions$
      .pipe(
        ofType(fromDataAccessActions.LOAD_DATA_TYPES),
        switchMap((action: fromDataAccessActions.LoadDataTypes) => this.adminRolesApi.getDataTypes().pipe(
          map((dataTypes: DataType[]) => {
            return new fromDataAccessActions.LoadedDataTypes(dataTypes); })
        ))
      );

  @Effect()
  editRoleName$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromUserRoleActions.EDIT_ROLE_NAME),
      switchMap((action: fromUserRoleActions.EditRoleName) =>
        this.adminRolesApi.updateRoleName(action.payload.NewRoleName, action.payload.RoleId).pipe(
          mergeMap(response => {
            return [new fromUserRoleActions.LoadCompanyRoles()];
          }),
          catchError(error => of(new fromUserRoleActions
            .SaveRoleError(RoleApiResponse.Error)))
      )));

  @Effect()
  deleteRole$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromUserRoleActions.DELETE_ROLE),
      switchMap((action: fromUserRoleActions.DeleteRole) =>
        this.adminRolesApi.deleteRole(action.payload).pipe(
          mergeMap(response => {
            return [new fromUserRoleActions.UpdateCurrentUserRole(undefined),
              new fromUserRoleActions.DeleteRoleSuccess(action.payload)];
          }),
          catchError(error => of(new fromUserRoleActions.DeleteRoleError(RoleApiResponse.DeleteError)))
        )
      )
    );

  constructor(private actions$: Actions,
              private adminRolesApi: RolesApiService,
              private store: Store<fromUserRoleViewReducer.State>) {
  }
}
