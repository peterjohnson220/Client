import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { ConfirmPasswordComponent } from 'libs/forms/components/confirm-password';

import * as fromChangePasswordActions from '../../../actions/change-password.actions';
import * as fromUserSettingsReducer from '../../../reducers';

@Component({
  selector: 'pf-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: [ './change-password.component.scss' ]
})
export class ChangePasswordComponent {
  submitEnabled: boolean;
  currentPassword: string;
  password: string;
  resetSuccess$: Observable<boolean>;
  resetError$: Observable<boolean>;
  submitting$: Observable<boolean>;
  minLength$: Observable<number>;
  @ViewChild('confirmPassword') confirmPassword: ConfirmPasswordComponent;

  constructor(public store: Store<fromUserSettingsReducer.State>, private route: ActivatedRoute) {
    this.submitEnabled = false;
    this.submitting$ = this.store.select(fromUserSettingsReducer.getChangingPassword);
    this.resetSuccess$ = this.store.select(fromUserSettingsReducer.getChangePasswordSuccess);
    this.resetError$ = this.store.select(fromUserSettingsReducer.getChangePasswordError);
    this.minLength$ = this.store.select(fromUserSettingsReducer.getPasswordMinimumLength);
  }

  passwordValid(password: string) {
    this.password = password;
    if (this.currentPassword !== undefined && this.currentPassword !== '') {
      this.submitEnabled = true;
    } else {
      this.submitEnabled = false;
    }
  }

  passwordInvalid() {
    this.submitEnabled = false;
  }

  changePassword() {
    if (this.password !== undefined) {
      this.submitEnabled = false;
      this.store.dispatch(new fromChangePasswordActions.ChangePassword({CurrentPassword: this.currentPassword, NewPassword: this.password}));
    }
  }

  currentPasswordOnBlur(event: any) {
    this.currentPassword = event.target.value;
    this.confirmPassword.validate();
  }
}
