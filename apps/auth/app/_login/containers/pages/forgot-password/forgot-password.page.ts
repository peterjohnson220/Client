import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import * as fromForgotPasswordReducer from '../../../reducers';
import * as fromForgotPasswordActions from '../../../actions/forgot-password.actions';
import * as fromLoginActions from '../../../actions/login.actions';

declare var grecaptcha: any;
declare var initializeRecaptcha: any;

@Component({
  selector: 'pf-forgot-password-page',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss']
})
export class ForgotPasswordPageComponent implements OnInit {

  loadingSubscription: Subscription;
  errorSubscription: Subscription;
  successSubscription: Subscription;

  submitting$: Observable<boolean>;
  submitError$: Observable<boolean>;
  submitSuccess$: Observable<boolean>;
  loginSettings$: Observable<any>;

  submissionError = false;
  formSubmitting = false;

  formControlEmail = '';
  attemptedFormSubmit = false;
  formSubmitSuccess = false;
  emailForm: FormGroup;
  emailRegex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  reCaptchaV3SiteKey: string;
  settingsSuccess = false;


  constructor(public store: Store<fromForgotPasswordReducer.State>) {

    this.submitting$ = this.store.select(fromForgotPasswordReducer.getForgotPasswordSending);
    this.submitError$ = this.store.select(fromForgotPasswordReducer.getForgotPasswordError);
    this.submitSuccess$ = this.store.select(fromForgotPasswordReducer.getForgotPasswordSuccess);
    this.loginSettings$ = this.store.select(fromForgotPasswordReducer.getLoginSettings);
  }

  ngOnInit(): void {
    this.store.dispatch(new fromLoginActions.GetLoginSettings());

    this.emailForm = new FormGroup({
      'email': new FormControl(this.formControlEmail, [
        Validators.required,
        Validators.pattern(this.emailRegex)
      ])
    });

    this.loadingSubscription = this.submitting$.subscribe(value => {
      if (value) {
        this.formSubmitting = true;
      }
    });

    this.errorSubscription = this.submitError$.subscribe(error => {
      if (error) {
        this.submissionError = true;
      }
    });

    this.successSubscription = this.submitSuccess$.subscribe(value => {
      if (value) {
        this.formSubmitSuccess = true;
      }
    });

    this.loginSettings$.subscribe(settings => {
      if (settings) {
        this.reCaptchaV3SiteKey = settings.ReCaptchaV3SiteKey;

        if (typeof initializeRecaptcha !== 'undefined') {
          initializeRecaptcha(this.reCaptchaV3SiteKey);
        }

        this.settingsSuccess = true;
      }
    });
  }

  submit() {
   this.attemptedFormSubmit = true;
    if (!this.emailForm.invalid) {
      try {
        grecaptcha.ready(() => {
          grecaptcha.execute(this.reCaptchaV3SiteKey, { action: 'forgot_password' }).then((token) => {
            this.sendPasswordResetEmail(token);
          }, executeErr => {
            console.error(`grecaptcha.execute error: ${executeErr}`);
           this.sendPasswordResetEmail();
          });
        });
      } catch (readyErr) {
        console.error(`grecaptcha.ready error: ${readyErr}`);
        this.sendPasswordResetEmail();
      }
    }
  }

  sendPasswordResetEmail(token = '') {
    this.store.dispatch(new fromForgotPasswordActions.SendingPasswordReset({email: this.email.value.toString(),
      clientCaptchaToken: token, clientCaptchaSiteKey: this.reCaptchaV3SiteKey}));
  }

  get email() {
    return this.emailForm.get('email');
  }
}
