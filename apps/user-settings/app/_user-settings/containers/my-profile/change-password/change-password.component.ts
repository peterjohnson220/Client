import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { ConfirmPasswordComponent } from 'libs/forms/components/confirm-password';
import { UserContext } from 'libs/models/security';
import { CompanySetting, LegacyCompanySettingDto } from 'libs/models/company';
import * as fromRootState from 'libs/state/state';

import * as fromChangePasswordActions from '../../../actions/change-password.actions';
import * as fromUserSettingsReducer from '../../../reducers';

@Component({
  selector: 'pf-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: [ './change-password.component.scss' ]
})
export class ChangePasswordComponent implements OnInit, OnDestroy {

  submitEnabled: boolean;
  currentPassword: string;
  password: string;
  emailAddress: string;
  minimumPasswordLength: string;

  resetSuccess$: Observable<boolean>;
  resetError$: Observable<boolean>;
  submitting$: Observable<boolean>;
  minLength$: Observable<number>;
  userContext$: Observable<UserContext>;
  legacyCompanySettings$: Observable<LegacyCompanySettingDto[]>;

  userContextSubscription: Subscription;
  legacyCompanySettingsSubscription: Subscription;

  @ViewChild('confirmPassword') confirmPassword: ConfirmPasswordComponent;

  constructor(public store: Store<fromUserSettingsReducer.State>, private route: ActivatedRoute) {
    this.submitEnabled = false;
    this.submitting$ = this.store.select(fromUserSettingsReducer.getChangingPassword);
    this.resetSuccess$ = this.store.select(fromUserSettingsReducer.getChangePasswordSuccess);
    this.resetError$ = this.store.select(fromUserSettingsReducer.getChangePasswordError);
    this.userContext$ = this.store.select(fromRootState.getUserContext);
    this.legacyCompanySettings$ = store.select(fromRootState.getLegacyCompanySettings);
  }

  ngOnInit() {

    this.userContextSubscription = this.userContext$.subscribe(userContext => {
      this.emailAddress = userContext.EmailAddress?.toLowerCase().substring(0, userContext.EmailAddress?.indexOf('@'));
    });

    this.legacyCompanySettingsSubscription = this.legacyCompanySettings$.subscribe(payload => {
      if (payload) {
        this.minimumPasswordLength = payload.find(function (el) {
          return el.Name === 'PasswordLengthRequirement';
        }).Value;
      }
    });
  }

  ngOnDestroy() {
    this.userContextSubscription.unsubscribe();
    this.legacyCompanySettingsSubscription.unsubscribe();
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
