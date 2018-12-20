import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as fromRegistrationReducer from '../../../reducers';
import * as fromValidateRegistrationActions from '../../../actions/validate-registration.actions';
import * as fromCompleteRegistrationActions from '../../../actions/complete-registration.actions';
import { SelfRegistrationExistingCompany } from '../../../models/self-registration-existing-company.model';

@Component({
  selector: 'pf-validate-registration-page',
  templateUrl: './validate-registration.page.html',
  styleUrls: [ './validate-registration.page.scss' ]
})
export class ValidateRegistrationPageComponent implements OnInit {
  validatingToken$: Observable<boolean>;
  validatingTokenError$: Observable<boolean>;
  validatingTokenExpired$: Observable<boolean>;
  validatingTokenSuccess$: Observable<boolean>;
  validatingTokenAccountExists$: Observable<boolean>;
  validatingTokenExistingCompany$: Observable<SelfRegistrationExistingCompany>;
  resendingToken$: Observable<boolean>;
  resendingTokenSuccess$: Observable<boolean>;
  resendingTokenError$: Observable<boolean>;
  accountEmail$: Observable<string>;
  submitError$: Observable<boolean>;
  isSubmitting$: Observable<boolean>;
  password: string;
  submitEnabled: boolean;
  token: string;

  constructor(
    private store: Store<fromRegistrationReducer.State>,
    private route: ActivatedRoute
  ) {
    this.validatingToken$ = store.select(fromRegistrationReducer.getValidatingToken);
    this.validatingTokenError$ = store.select(fromRegistrationReducer.getValidatingTokenError);
    this.validatingTokenExpired$ = store.select(fromRegistrationReducer.getValidatingTokenExpired);
    this.validatingTokenSuccess$ = store.select(fromRegistrationReducer.getValidatingTokenSuccess);
    this.validatingTokenAccountExists$ = store.select(fromRegistrationReducer.getValidatingTokenAccountExists);
    this.accountEmail$ = store.select(fromRegistrationReducer.getAccountEmail);
    this.validatingTokenExistingCompany$ = store.select(fromRegistrationReducer.getValidatingTokenExistingCompany);
    this.isSubmitting$ = store.select(fromRegistrationReducer.getCompleteRegistrationIsSubmitting);
    this.submitError$ = store.select(fromRegistrationReducer.getCompleteRegistrationSubmitError);
    this.resendingToken$ = store.select(fromRegistrationReducer.getResendingToken);
    this.resendingTokenSuccess$ = store.select(fromRegistrationReducer.getResendingTokenSuccess);
    this.resendingTokenError$ = store.select(fromRegistrationReducer.getResendingTokenError);
    this.submitEnabled = false;
  }

  ngOnInit(): void {
    const queryParamMap = this.route.snapshot.queryParamMap;
    this.token = queryParamMap.get('tk');
    this.store.dispatch(new fromValidateRegistrationActions.ValidateToken({ token: this.token }));
  }

  passwordValid(password: string) {
    this.password = password;
    this.submitEnabled = true;
  }

  passwordInvalid() {
    this.submitEnabled = false;
  }

  updatePassword() {
    if (this.password != null && typeof(this.password) !== 'undefined') {
      this.submitEnabled = false;
      this.store.dispatch(new fromCompleteRegistrationActions.Submit({ token: this.token, password: this.password }));
    }
  }

  resendToken() {
    this.store.dispatch(new fromValidateRegistrationActions.ResendToken({ token: this.token }));
  }

}
