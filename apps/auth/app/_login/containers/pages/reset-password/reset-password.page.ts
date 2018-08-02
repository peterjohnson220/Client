import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import * as fromResetPasswordReducer from '../../../reducers';
import * as fromResetPasswordActions from '../../../actions/reset-password.actions';

@Component({
  selector: 'pf-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: [ './reset-password.page.scss' ]
})
export class ResetPasswordPageComponent implements OnInit {
  forgotPasswordLink = '/forgot-password';
  submitEnabled: boolean;
  updateError: boolean;
  password: string;
  token: string;
  resetSuccess$: Observable<boolean>;
  resetError$: Observable<boolean>;
  resetTokenExpired$: Observable<boolean>;
  checkingResetToken$: Observable<boolean>;
  submitting: boolean;
  minLength$: Observable<number>;
  tokenValid$: Observable<boolean>;

  constructor(public store: Store<fromResetPasswordReducer.State>, private route: ActivatedRoute) {
    this.submitEnabled = false;
    this.resetSuccess$ = this.store.select(fromResetPasswordReducer.getResetPasswordSuccess);
    this.resetError$ = this.store.select(fromResetPasswordReducer.getResetPasswordError);
    this.resetTokenExpired$ = this.store.select(fromResetPasswordReducer.getResetPasswordTokenExpired);
    this.checkingResetToken$ = this.store.select(fromResetPasswordReducer.getCheckingResetPasswordToken);
    this.minLength$ = this.store.select(fromResetPasswordReducer.getPasswordMinimumLength);
    this.tokenValid$ = this.store.select(fromResetPasswordReducer.getCheckingResetPasswordTokenSuccess);
  }

  ngOnInit() {
    const queryParamMap = this.route.snapshot.queryParamMap;
    this.token = queryParamMap.get('tk');
    this.store.dispatch(new fromResetPasswordActions.CheckResetPasswordToken(this.token));
  }

  passwordValid(password: string) {
    this.password = password;
    this.submitEnabled = true;
    this.updateError = false;
  }

  passwordInvalid() {
    this.submitEnabled = false;
    this.updateError = false;
  }

  resetPassword() {
    if (this.password !== undefined) {
      this.submitEnabled = false;
      this.submitting = true;
      this.store.dispatch(new fromResetPasswordActions.ResetPassword({token: this.token, password: this.password}));
    }
  }

}
