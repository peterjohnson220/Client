import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, forkJoin, of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';

import * as fromUserManagementActions from '../actions/user-management.actions';

import { UserApiService, CompanyApiService } from 'libs/data/payfactors-api';
import { RolesApiService } from 'libs/data/payfactors-api/company-admin';
import { UserResponse } from 'libs/models/payfactors-api/user/response';
import { SubsidiaryInfo, UserAssignedRole, UserRole } from 'libs/models';
import { UserManagementDto } from 'libs/models/payfactors-api/user';

import { RouteTrackingService } from '../../../../core/services';

@Injectable()
export class UserEffects {
  @Effect()
  loadUser$: Observable<Action> = this.actions$
      .pipe(
          ofType(fromUserManagementActions.LOAD_USER),
          switchMap((action: fromUserManagementActions.LoadUser) =>
              forkJoin(this.userApiService.get(action.userId), this.rolesApi.getRoleforUser(action.userId)).pipe(
                  map((userData) => {
                      const user = this.materializeUserManagementDto(userData[0], userData[1]);
                      return new fromUserManagementActions.LoadUserSuccess(user);
                  }),
                  catchError(error => {
                      const msg = 'We encountered an error while loading the user form.';
                      return of(new fromUserManagementActions.HandleApiError(msg));
                  })
              )
          )
      );

  @Effect()
  loadCompanyRoles$: Observable<Action> = this.actions$
      .pipe(
          ofType(fromUserManagementActions.LOAD_ROLES),
          switchMap((action: fromUserManagementActions.LoadRoles) =>
              this.rolesApi.getRolesByCompanyId(action.companyId).pipe(
                  map((userRoles: UserAssignedRole[]) => new fromUserManagementActions.LoadRolesSuccess(userRoles)),
                  catchError(error => {
                      const msg = 'We encountered an error while loading the user form.';
                      return of(new fromUserManagementActions.HandleApiError(msg));
                  })
              )
          )
      );

  @Effect()
  saveUser$: Observable<Action> = this.actions$
      .pipe(
          ofType(fromUserManagementActions.SAVE_USER),
          switchMap((action: fromUserManagementActions.SaveUser) =>
              this.userApiService.saveUser(action.user).pipe(
                  map(() => {
                      this.routeTrackingService.goBack();
                      return new fromUserManagementActions.SaveUserSuccess();
                  }),
                  catchError(error => {
                      const msg = 'We encountered an error while saving the user information.';
                      return of(new fromUserManagementActions.HandleApiError(msg));
                  })
              )
          )
      );

  @Effect()
  loadCompanySubsidiaryInfo$: Observable<Action> = this.actions$.pipe(
    ofType(fromUserManagementActions.LOAD_COMPANY_SUBSIDIARY_INFO),
    switchMap((action: fromUserManagementActions.LoadCompanySubsidiaryInfo) => {
        return this.companyApiService.getCompanySubsidiaryInfo(action.payload.CompanyId).pipe(
          map((subsidiaryInfo: SubsidiaryInfo[]) =>
            new fromUserManagementActions.LoadCompanySubsidiaryInfoSuccess({SubsidiaryInfo: subsidiaryInfo})),
          catchError(error => of(new fromUserManagementActions.LoadCompanySubsidiaryInfoError()))
        );
      }
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
        RoleId: role ? role.Id : null,
        UserSubsidiaryIds: user.UserSubsidiaryIds
    };
  }

  constructor(private actions$: Actions,
              private rolesApi: RolesApiService,
              private userApiService: UserApiService,
              private companyApiService: CompanyApiService,
              private routeTrackingService: RouteTrackingService,
  ) { }
}
