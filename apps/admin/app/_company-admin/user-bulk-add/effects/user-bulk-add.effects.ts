import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, select, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';

import { BulkAddUsersApiService } from 'libs/data/payfactors-api/company-admin';
import { CompanyApiService } from 'libs/data/payfactors-api/company';
import * as fromRootState from 'libs/state/state';
import { CompanyDto } from 'libs/models/company';

import * as fromUserBulkAddActions from '../actions/user-bulk-add.action';
import * as fromCompanyAdminReducer from '../reducers';



@Injectable()
export class UserBulkAddEffects {

  @Effect()
  storeFileNameInSession$: Observable<Action> = this.actions$
    .pipe(
      ofType<fromUserBulkAddActions.StoreFileNameInSession>(fromUserBulkAddActions.STORE_FILE_NAME_IN_SESSION),
      switchMap((action) => {
        return this.bulkAddUsersApiService.storeFileName(action.payload).pipe(
          map((data: string) => new fromUserBulkAddActions.StoreFileNameInSessionSuccess(data)),
          catchError(e => of(new fromUserBulkAddActions.StoreFileNameInSessionError()))
        );
      })
    );


  @Effect()
  storeAndMapBulkAddUsersInSession$: Observable<Action> = this.actions$
    .pipe(
      ofType<fromUserBulkAddActions.StoreAndMapBulkAddUsersInSession>(fromUserBulkAddActions.STORE_AND_MAP_BULK_ADD_USERS_IN_SESSION),
      switchMap((action) => {
        return this.bulkAddUsersApiService.storeAndMapBulkAddUsersInSession(action.payload).pipe(
          map((data: string) => new fromUserBulkAddActions.StoreAndMapBulkAddUsersInSessionSuccess(data)),
          catchError(e => of(new fromUserBulkAddActions.StoreAndMapBulkAddUsersInSessionError()))
        );
      })
    );

  @Effect()
  validateHeaders$: Observable<Action> = this.actions$
    .pipe(
      ofType<fromUserBulkAddActions.ValidateHeaders>(fromUserBulkAddActions.VALIDATE_HEADERS),
      switchMap((action) => {
        return this.bulkAddUsersApiService.validateHeaders(action.payload).pipe(
          map((data: string) => new fromUserBulkAddActions.ValidateHeadersSuccess(data)),
          catchError(e => of(new fromUserBulkAddActions.ValidateHeadersError()))
        );
      })
    );

  @Effect()
  validateRequiredFields$: Observable<Action> = this.actions$
    .pipe(
      ofType<fromUserBulkAddActions.ValidateRequiredFields>(fromUserBulkAddActions.VALIDATE_REQUIRED_FIELDS),
      switchMap((action) => {
        return this.bulkAddUsersApiService.validateRequiredFields(action.payload).pipe(
          map((data) => new fromUserBulkAddActions.ValidateRequiredFieldsSuccess(data)),
          catchError(e => of(new fromUserBulkAddActions.ValidateRequiredFieldsError()))
        );
      })
    );

  @Effect()
  validateEmails$: Observable<Action> = this.actions$
    .pipe(
      ofType<fromUserBulkAddActions.ValidateEmails>(fromUserBulkAddActions.VALIDATE_EMAILS),
      switchMap(() => {
        return this.bulkAddUsersApiService.validateEmails().pipe(
          map((data) => new fromUserBulkAddActions.ValidateEmailsSuccess(data)),
          catchError(e => of(new fromUserBulkAddActions.ValidateEmailsError()))
        );
      })
    );

  @Effect()
  validatePasswords$: Observable<Action> = this.actions$
    .pipe(
      ofType<fromUserBulkAddActions.ValidatePasswords>(fromUserBulkAddActions.VALIDATE_PASSWORDS),
      switchMap((action) => {
        return this.bulkAddUsersApiService.validatePasswords(action.payload).pipe(
          map((data) => new fromUserBulkAddActions.ValidatePasswordsSuccess(data)),
          catchError(e => of(new fromUserBulkAddActions.ValidatePasswordsError()))
        );
      })
    );

  @Effect()
  validateUserRoles$: Observable<Action> = this.actions$
    .pipe(
      ofType<fromUserBulkAddActions.ValidateUserRoles>(fromUserBulkAddActions.VALIDATE_USER_ROLES),
      switchMap((action) => {
        return this.bulkAddUsersApiService.validateUserRoles(action.payload).pipe(
          map((data) => new fromUserBulkAddActions.ValidateUserRolesSuccess(data)),
          catchError(e => of(new fromUserBulkAddActions.ValidateUserRolesError()))
        );
      })
    );

  @Effect()
  downloadDataFileWithErrors$: Observable<Action> = this.actions$
    .pipe(
      ofType<fromUserBulkAddActions.DownloadDataFileWithErrors>(fromUserBulkAddActions.DOWNLOAD_DATA_FILE_WITH_ERRORS),
      switchMap((action) => {
        return this.bulkAddUsersApiService.downloadDataFileWithErrors(action.payload.companyId,
          action.payload.bulkAddUsersValidationErrors)
          .pipe(map((data) => new fromUserBulkAddActions.DownloadDataFileWithErrorsSuccess()),
          catchError(e => of(new fromUserBulkAddActions.DownloadDataFileWithErrorsError()))
        );
      })
    );

  @Effect()
  getImportCount$: Observable<Action> = this.actions$
    .pipe(
      ofType<fromUserBulkAddActions.GetImportCount>(fromUserBulkAddActions.GET_IMPORT_COUNT),
      switchMap(() => {
        return this.bulkAddUsersApiService.getImportCount().pipe(
          map((data) => new fromUserBulkAddActions.GetImportCountSuccess(data)),
          catchError(e => of(new fromUserBulkAddActions.GetImportCountError()))
        );
      })
    );

  @Effect()
  saveBulkAddUsers$: Observable<Action> = this.actions$
    .pipe(
      ofType<fromUserBulkAddActions.SaveBulkAddUsers>(fromUserBulkAddActions.SAVE_BULK_ADD_USERS),
      switchMap((action) => {
        return this.bulkAddUsersApiService.saveBulkAddUsers(action.payload).pipe(
          map((data) => new fromUserBulkAddActions.SaveBulkAddUsersSuccess(data)),
          catchError(e => of(new fromUserBulkAddActions.SaveBulkAddUsersError()))
        );
      })
    );


  // chose to leave the fetch of userContext here in this one method, as it needs to know the companyId.
  // we could have subscribed as in the api service, but since its only used once it didn't seem to make much difference
  @Effect()
  loadCompanyPasswordLength$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromUserBulkAddActions.GET_COMPANY_PASSWORD_LENGTH),
      withLatestFrom(
        this.store.pipe(select(fromRootState.getUserContext)),
        (action, userContext) => {
          return {
            action,
            userContext
          };
        }
      ),
      switchMap((data) => {
        return this.companyApiService.get(data.userContext.CompanyId).pipe(
          map((company: CompanyDto) => new fromUserBulkAddActions.GetCompanyPasswordLengthSuccess(company.PasswordLengthRequirement)),
          catchError(error => {
            return of(new fromUserBulkAddActions.GetCompanyPasswordLengthError());
          })
        );
      })
    );

  constructor(
    private actions$: Actions,
    private store: Store<fromCompanyAdminReducer.State>,
    private bulkAddUsersApiService: BulkAddUsersApiService,
    private companyApiService: CompanyApiService
  ) { }

}
