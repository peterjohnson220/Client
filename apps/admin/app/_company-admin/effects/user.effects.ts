import { Injectable } from '@angular/core';
import { Observable, forkJoin, of } from 'rxjs';
import { NotificationService } from '@progress/kendo-angular-notification';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { map, switchMap, catchError } from 'rxjs/operators';

import * as fromUserActions from '../actions/user.actions';
import { UserApiService } from 'libs/data/payfactors-api';
import { RolesApiService } from 'libs/data/payfactors-api/company-admin';
import { UserResponse } from 'libs/models/payfactors-api/user/response';
import { UserAssignedRole, UserRole } from 'libs/models';
import { UserManagementDto } from 'libs/models/payfactors-api/user';
import { DefaultNotificationSettings } from 'libs/constants';

import { Router } from '@angular/router';

@Injectable()
export class UserEffects {
    constructor(private actions$: Actions,
        private rolesApi: RolesApiService,
        private userApiService: UserApiService,
        private notificationService: NotificationService,
        private router: Router,
    ) { }

    @Effect()
    loadUser$: Observable<Action> = this.actions$
        .pipe(
            ofType(fromUserActions.LOAD_USER),
            switchMap((action: fromUserActions.LoadUser) =>
                forkJoin(this.userApiService.get(action.userId), this.rolesApi.getRoleforUser(action.userId)).pipe(
                    map((userData) => {
                        const user = this.materializeUserManagementDto(userData[0], userData[1]);
                        return new fromUserActions.LoadUserSuccess(user);
                    }),
                    catchError(error => {
                        const msg = 'We encountered an error while loading the user form.';
                        return of(new fromUserActions.HandleApiError(msg));
                    })
                )
            )
        );

    @Effect()
    loadCompanyRoles$: Observable<Action> = this.actions$
        .pipe(
            ofType(fromUserActions.LOAD_ROLES),
            switchMap((action: fromUserActions.LoadRoles) =>
                this.rolesApi.getRolesByCompanyId(action.companyId).pipe(
                    map((userRoles: UserAssignedRole[]) => new fromUserActions.LoadRolesSuccess(userRoles)),
                    catchError(error => {
                        const msg = 'We encountered an error while loading the user form.';
                        return of(new fromUserActions.HandleApiError(msg));
                    })
                )
            )
        );

    @Effect()
    saveUser$: Observable<Action> = this.actions$
        .pipe(
            ofType(fromUserActions.SAVE_USER),
            switchMap((action: fromUserActions.SaveUser) =>
                this.userApiService.saveUser(action.user).pipe(
                    map(() => {
                        this.router.navigate(['company-admin', action.user.CompanyId, 'users']);
                        return new fromUserActions.SaveUserSuccess();
                    }),
                    catchError(error => {
                        const msg = 'We encountered an error while saving the user information.';
                        return of(new fromUserActions.HandleApiError(msg));
                    })
                )
            )
        );

    materializeUserManagementDto(user: UserResponse, role: UserRole): UserManagementDto {
        return {
            UserId: user.UserId,
            CompanyId: user.CompanyId,
            FirstName: user.FirstName,
            LastName: user.LastName,
            EmailAddress: user.EmailAddress,
            Password: null,
            Title: user.Title,
            Active: user.Active,
            PhoneNumber: user.PhoneNumber,
            LastLogin: user.LastLogin,
            SsoId: user.SsoId,
            SendWelcomeEmail: null,
            RoleId: role ? role.Id : null
        };
    }
}
