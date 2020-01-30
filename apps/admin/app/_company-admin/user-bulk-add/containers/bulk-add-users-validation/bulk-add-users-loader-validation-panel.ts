import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { UserBulkAdd } from 'libs/models/admin/user-bulk-add.model';
import { ValidationError } from 'libs/models/admin/validation-error.model';

import { toggleStateAnimation } from '../../animations/toggle-animations';
import { BaseBulkAddUsersTogglePanelComponent } from '../base-bulk-add-users-toggle-panel';
import { PanelState } from '../base-toggle-panel';
import * as fromBulkAddUsersReducer from '../../reducers';
import * as fromUserBulkAddActions from '../../actions/user-bulk-add.action';

export enum ValidationState {
    Default,
    Running,
    Error,
    Success
}

@Component({
    selector: 'pf-bulk-add-users-loader-validation-panel',
    templateUrl: './bulk-add-users-loader-validation-panel.html',
    styleUrls: ['../bulk-add-users-loader-panel.css'],
    animations: [toggleStateAnimation],
})

export class BulkAddUsersLoaderValidationPanelComponent extends BaseBulkAddUsersTogglePanelComponent implements OnInit, OnDestroy {

  headers_ValidationState: ValidationState;
  fields_ValidationState: ValidationState;
  email_ValidationState: ValidationState;
  password_ValidationState: ValidationState;
  userrole_ValidationState: ValidationState;
  _validationState: typeof ValidationState = ValidationState;
  validationErrors: Array<ValidationError> = [];
  isServerError = false;
  isDownloadErrorsPressed = false;
  userBulkAdd: UserBulkAdd;

  validateHeadersSuccess$: Observable<any>;
  validateHeadersSuccessSubscription: Subscription;
  validateHeadersError$: Observable<boolean>;
  validateHeadersErrorSubscription: Subscription;

  validateRequiredFieldsSuccess$: Observable<any>;
  validateRequiredFieldsSuccessSubscription: Subscription;
  validateRequiredFieldsError$: Observable<boolean>;
  validateRequiredFieldsErrorSubscription: Subscription;

  validateEmailsSuccess$: Observable<any>;
  validateEmailsSuccessSubscription: Subscription;
  validateEmailsError$: Observable<boolean>;
  validateEmailsErrorSubscription: Subscription;

  validatePasswordsSuccess$: Observable<any>;
  validatePasswordsSuccessSubscription: Subscription;
  validatePasswordsError$: Observable<boolean>;
  validatePasswordsErrorSubscription: Subscription;

  validateUserRolesSuccess$: Observable<any>;
  validateUserRolesSuccessSubscription: Subscription;
  validateUserRolesError$: Observable<boolean>;
  validateUserRolesErrorSubscription: Subscription;

  downloadDataFileWithErrorsSuccess$: Observable<any>;
  downloadDataFileWithErrorsSuccessSubscription: Subscription;
  downloadDataFileWithErrorsError$: Observable<boolean>;
  downloadDataFileWithErrorsErrorSubscription: Subscription;

  @Input() fileName: string;
  @Input() companyId: number;
  @Input() userWorksheet: string;

  constructor(store: Store<fromBulkAddUsersReducer.State>, private location: Location) {
    super(store);
    this.validateHeadersSuccess$ = this.store.select(fromBulkAddUsersReducer.getValidateHeadersSuccess);
    this.validateHeadersError$ = this.store.select(fromBulkAddUsersReducer.getValidateHeadersError);

    this.validateRequiredFieldsSuccess$ = this.store.select(fromBulkAddUsersReducer.getValidateRequiredFieldsSuccess);
    this.validateRequiredFieldsError$ = this.store.select(fromBulkAddUsersReducer.getValidateRequiredFieldsError);

    this.validateEmailsSuccess$ = this.store.select(fromBulkAddUsersReducer.getValidateEmailsSuccess);
    this.validateEmailsError$ = this.store.select(fromBulkAddUsersReducer.getValidateEmailsError);

    this.validatePasswordsSuccess$ = this.store.select(fromBulkAddUsersReducer.getValidatePasswordsSuccess);
    this.validatePasswordsError$ = this.store.select(fromBulkAddUsersReducer.getValidatePasswordsError);

    this.validateUserRolesSuccess$ = this.store.select(fromBulkAddUsersReducer.getValidateUserRolesSuccess);
    this.validateUserRolesError$ = this.store.select(fromBulkAddUsersReducer.getValidateUserRolesError);

    this.downloadDataFileWithErrorsSuccess$ = this.store.select(fromBulkAddUsersReducer.getDownloadDataFileWithErrorsSuccess);
    this.downloadDataFileWithErrorsError$ = this.store.select(fromBulkAddUsersReducer.getDownloadDataFileWithErrorsError);
  }

  ngOnInit() {
    super.ngOnInit();
    this.validateHeadersSuccessSubscription = this.validateHeadersSuccess$.subscribe(response => {
      this.validateHeadersSuccess(response);
    });

    this.validateHeadersErrorSubscription = this.validateHeadersError$.subscribe(response => {
      if (response) {
        this.headers_ValidationState = ValidationState.Error;
        this.errorFound(true);
      }
    });


    this.validateRequiredFieldsSuccessSubscription = this.validateRequiredFieldsSuccess$.subscribe(response => {
      this.validateRequiredFieldsSuccess(response);
    });


    this.validateRequiredFieldsErrorSubscription = this.validateRequiredFieldsError$.subscribe(response => {
      if (response) {
        this.fields_ValidationState = ValidationState.Error;
        this.errorFound(true);
      }
    });


    this.validateEmailsSuccessSubscription = this.validateEmailsSuccess$.subscribe(response => {
      this.validateEmailsSuccess(response);
    });


    this.validateEmailsErrorSubscription = this.validateEmailsError$.subscribe(response => {
      if (response) {
        this.email_ValidationState = ValidationState.Error;
        this.errorFound(true);
      }
    });


    this.validatePasswordsSuccessSubscription = this.validatePasswordsSuccess$.subscribe(response => {
      this.validatePasswordsSuccess(response);
    });


    this.validatePasswordsErrorSubscription = this.validatePasswordsError$.subscribe(response => {
      if (response) {
        this.password_ValidationState = ValidationState.Error;
        this.errorFound(true);
      }
    });


    this.validateUserRolesSuccessSubscription = this.validateUserRolesSuccess$.subscribe(response => {
      this.validateUserRolesSuccess(response);
    });


    this.validateUserRolesErrorSubscription = this.validateUserRolesError$.subscribe(response => {
      if (response) {
        this.userrole_ValidationState = ValidationState.Error;
        this.errorFound(true);
      }
    });


    this.downloadDataFileWithErrorsSuccessSubscription = this.downloadDataFileWithErrorsSuccess$.subscribe(response => {
      this.downloadErrorsSuccess(response);
    });


    this.downloadDataFileWithErrorsErrorSubscription = this.downloadDataFileWithErrorsError$.subscribe(response => {
      if (response) {
        this.errorFound(true);
      }
    });
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    if (this.validateHeadersSuccessSubscription) {
      this.validateHeadersSuccessSubscription.unsubscribe();
    }

    if (this.validateHeadersErrorSubscription) {
      this.validateHeadersErrorSubscription.unsubscribe();
    }

    if (this.validateRequiredFieldsSuccessSubscription) {
      this.validateRequiredFieldsSuccessSubscription.unsubscribe();
    }

    if (this.validateRequiredFieldsErrorSubscription) {
      this.validateRequiredFieldsErrorSubscription.unsubscribe();
    }

    if (this.validateEmailsSuccessSubscription) {
      this.validateEmailsSuccessSubscription.unsubscribe();
    }

    if (this.validateEmailsErrorSubscription) {
      this.validateEmailsErrorSubscription.unsubscribe();
    }

    if (this.validatePasswordsSuccessSubscription) {
      this.validatePasswordsSuccessSubscription.unsubscribe();
    }

    if (this.validatePasswordsErrorSubscription) {
      this.validatePasswordsErrorSubscription.unsubscribe();
    }

    if (this.validateUserRolesSuccessSubscription) {
      this.validateUserRolesSuccessSubscription.unsubscribe();
    }

    if (this.validateUserRolesErrorSubscription) {
      this.validateUserRolesErrorSubscription.unsubscribe();
    }

    if (this.downloadDataFileWithErrorsSuccessSubscription) {
      this.downloadDataFileWithErrorsSuccessSubscription.unsubscribe();
    }

    if (this.downloadDataFileWithErrorsErrorSubscription) {
      this.downloadDataFileWithErrorsErrorSubscription.unsubscribe();
    }
  }

  init() {
    this.resetPanelState();
    this.clearValidationStates();
    this.clearErrors();
    this.runValidation();
  }

  private clearValidationStates() {
    this.headers_ValidationState = ValidationState.Default;
    this.fields_ValidationState = ValidationState.Default;
    this.email_ValidationState = ValidationState.Default;
    this.password_ValidationState = ValidationState.Default;
    this.userrole_ValidationState = ValidationState.Default;
  }

  private clearErrors() {
    this.validationErrors = [];
    this.isServerError = false;
  }

  private runValidation() {
    this.validateHeaders();
    this.validateRequiredFields();
    this.validateEmails();
    this.validatePasswords();
    this.validateUserRoles();
  }

  private cancel() {
    this.store.dispatch(new fromUserBulkAddActions.ResetAll());
    this.onCancel();
  }

  private downloadErrorsSuccess(response) {
    if (response) {
      const blob = new Blob([response.blob()], {type: response.headers.get('Content-Type')});
      let fileName = response.headers.get('Content-Disposition').split(';')[1].trim().split('=')[1] + '.xlsx';
      fileName = fileName.replace(/"/g, ''); // Remove quotes to avoid underscores being added to the filename

      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(blob, fileName); // Fix for IE
      } else {
        const fileUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = fileUrl;
        a.download = fileName;

        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        window.URL.revokeObjectURL(fileUrl);
      }
    }
  }

  private downloadErrors() {
    this.startDownloadErrorsPressedTimeout();
    this.store.dispatch(new fromUserBulkAddActions.DownloadDataFileWithErrors(
      { companyId: this.companyId, bulkAddUsersValidationErrors: this.validationErrors}));
  }

  private startDownloadErrorsPressedTimeout() {
    this.isDownloadErrorsPressed = true;

    // after 3 seconds, set isDownloadErrorsPressed back to false
    setTimeout(() => { this.isDownloadErrorsPressed = false; }, 3000);
  }

  private loadDataFile() {
    this.onComplete();
  }

  private validateHeadersSuccess(response) {
    if (response) {
      if (response.length) {
        this.headers_ValidationState = ValidationState.Error;
        this.errorFound();
        (response as Array<ValidationError>).map(error => {
          this.validationErrors.push(error);
        });
      } else {
        this.headers_ValidationState = ValidationState.Success;
        this.checkComplete();
      }
    }
  }

  private validateHeaders() {
    if (!this.userWorksheet) {
        this.errorFound(true);
        return;
    }

    this.headers_ValidationState = ValidationState.Running;
    this.userBulkAdd = new UserBulkAdd(this.companyId, this.userWorksheet);
    this.store.dispatch(new fromUserBulkAddActions.ValidateHeaders(this.userBulkAdd));
  }

  private validateRequiredFieldsSuccess(response) {
    if (response) {
      if (response.length) {
        this.fields_ValidationState = ValidationState.Error;
        this.errorFound();
        (response as Array<ValidationError>).map(error => {
          this.validationErrors.push(error);
        });

      } else {
        this.fields_ValidationState = ValidationState.Success;
        this.checkComplete();
      }
    }
  }

  private validateRequiredFields() {
    this.fields_ValidationState = ValidationState.Running;
    this.store.dispatch(new fromUserBulkAddActions.ValidateRequiredFields(this.companyId));
  }

  private validateEmailsSuccess(response) {
    if (response) {
      if (response.length) {
        this.email_ValidationState = ValidationState.Error;
        this.errorFound();
        (response as Array<ValidationError>).map(error => {
          this.validationErrors.push(error);
        });
      } else {
        this.email_ValidationState = ValidationState.Success;
        this.checkComplete();
      }
    }
  }

  private validateEmails() {
    this.email_ValidationState = ValidationState.Running;
    this.store.dispatch(new fromUserBulkAddActions.ValidateEmails());
  }

  private validatePasswordsSuccess(response) {
    if (response) {
      if (response.length) {
        this.password_ValidationState = ValidationState.Error;
        this.errorFound();
        (response as Array<ValidationError>).map(error => {
          this.validationErrors.push(error);
        });
      } else {
        this.password_ValidationState = ValidationState.Success;
        this.checkComplete();
      }
    }
  }

  private validatePasswords() {
    this.password_ValidationState = ValidationState.Running;
    this.store.dispatch(new fromUserBulkAddActions.ValidatePasswords(this.companyId));
  }

  private validateUserRolesSuccess(response) {
    if (response) {
      if (response.length) {
        this.userrole_ValidationState = ValidationState.Error;
        this.errorFound();
        (response as Array<ValidationError>).map(error => {
          this.validationErrors.push(error);
        });
      } else {
        this.userrole_ValidationState = ValidationState.Success;
        this.checkComplete();
      }
    }
  }

  private validateUserRoles() {
    this.userrole_ValidationState = ValidationState.Running;
    this.store.dispatch(new fromUserBulkAddActions.ValidateUserRoles(this.companyId));
  }

  private checkComplete() {
    if (this.headers_ValidationState === ValidationState.Success &&
        this.fields_ValidationState === ValidationState.Success &&
        this.email_ValidationState === ValidationState.Success &&
        this.password_ValidationState === ValidationState.Success &&
        this.userrole_ValidationState === ValidationState.Success
    ) {
        this.panelState = PanelState.Complete;
    }
  }

  private errorFound(isException: boolean = false) {
    this.panelState = PanelState.Error;

    if (isException) {
      this.isServerError = true;
    }
  }

  exit() {
    this.store.dispatch(new fromUserBulkAddActions.ResetAll());
    this.location.back();
  }

}
