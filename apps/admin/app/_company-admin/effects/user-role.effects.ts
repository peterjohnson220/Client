import { Injectable } from '@angular/core';

import { Actions, Effect } from '@ngrx/effects';
import {Action, Store} from '@ngrx/store';

import { Observable, of } from 'rxjs';
import {catchError, map, switchMap, mergeMap, delay} from 'rxjs/operators';

import { RolesApiService } from 'libs/data/payfactors-api/company-admin';
import { UserAssignedRole, UserAndRoleModel } from 'libs/models/security';
import {RolePermission} from 'libs/models/security';

import * as fromUserRoleActions from '../actions/user-role-view.action';
import * as fromUserRoleUserTabActions from '../actions/user-role-users-tab.action';
import {SaveButtonText} from '../constants/user-role.constants';
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
        [new fromUserRoleUserTabActions.CancelChanges(), new fromUserRoleUserTabActions.UpdateUserTabCurrentUserRole(action.payload)])
    );

  @Effect()
  saveChanges$: Observable<Action> = this.actions$
    .ofType(fromUserRoleUserTabActions.SAVE_CHANGES).pipe(
      switchMap((action: fromUserRoleUserTabActions.SaveChanges) => {
        this.store.dispatch(new fromUserRoleUserTabActions.SetUsersTabSaveButtonText(SaveButtonText.Saving));
        const result = this.adminRolesApi.assignUsersToRole(action.payload.userIds, action.payload.roleId, action.payload.isSystemRole).pipe(
          mergeMap(response => {
            const actions = [];
            actions.push(new fromUserRoleUserTabActions.GetUsersAndRolesSuccess(response));
            actions.push(new fromUserRoleUserTabActions.SetUsersTabSaveButtonText(SaveButtonText.Success));
            return actions;
          })
        );
        setTimeout(() => {
          this.store.dispatch(new fromUserRoleUserTabActions.SetUsersTabSaveButtonText(SaveButtonText.Save));
          }, 2000);

        return result;
      })
    );

  @Effect()
  loadCompanyRolePermissions$: Observable<Action> = this.actions$
    .ofType(fromUserRoleActions.LOAD_COMPANY_ROLE_PERMISSIONS).pipe(
      switchMap((action: fromUserRoleActions.LoadCompanyRolePermissions) => {
        return this.adminRolesApi.getRolePermissions(action.payload).pipe(
          map((permissions: RolePermission[]) => {
            const newPermissions: RolePermission[] = permissions.filter((f) => f.IsParent);
            newPermissions.forEach(p => p.ChildPermission = permissions.filter((f) => !f.IsParent && f.TileId === p.TileId));
            return newPermissions;
          }),
          map((permissions: RolePermission[]) => {
            return new fromUserRoleActions.LoadCompanyRolePermissionsSuccess(permissions);
          }),
        );
      })
    );

  @Effect()
  saveCompanyRolePermissions$: Observable<Action> = this.actions$
    .ofType(fromUserRoleActions.SAVE_COMPANY_ROLE_PERMISSIONS).pipe(
      switchMap((action: fromUserRoleActions.SaveCompanyRolePermissions) => {
        const permissionIds = [];
        action.payload.Permissions.filter( p => p.IsChecked)
          .map(p => {
            permissionIds.push(p.Id);
            p.ChildPermission.filter( cp => cp.IsChecked).map(cp => permissionIds.push(cp.Id)); } );
        return this.adminRolesApi.updateRolePermissions(action.payload.RoleId, permissionIds).pipe(
          delay(2000),
          map((role: UserAssignedRole ) => new fromUserRoleActions.SaveCompanyRolePermissionsSuccess(role))
        );
      })
    );

  constructor(private actions$: Actions,
              private adminRolesApi: RolesApiService,
              private store: Store<fromUserRoleViewReducer.State>) {
  }
}
