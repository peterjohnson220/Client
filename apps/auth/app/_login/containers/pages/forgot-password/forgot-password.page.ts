import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators} from '@angular/forms';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import * as fromForgotPasswordReducer from '../../../reducers';
import * as fromForgotPasswordActions from '../../../actions/forgot-password.actions';

@Component({
  selector: 'pf-forgot-password-page',
  templateUrl: './forgot-password.page.html',
  styleUrls: [ './forgot-password.page.scss' ]
})
export class ForgotPasswordPageComponent implements OnInit {

  loadingSubscription: Subscription;
  errorSubscription: Subscription;
  successSubscription: Subscription;

  submitting$: Observable<boolean>;
  submitError$: Observable<boolean>;
  submitSuccess$: Observable<boolean>;

  submissionError = false;
  formSubmitting = false;

  formControlEmail = '';
  attemptedFormSubmit = false;
  formSubmitSuccess = false;
  emailForm: FormGroup;
  emailRegex = /^\w+([\-\.+]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  constructor(public store: Store<fromForgotPasswordReducer.State>) {

    this.submitting$ = this.store.select(fromForgotPasswordReducer.getForgotPasswordSending);
    this.submitError$ = this.store.select(fromForgotPasswordReducer.getForgotPasswordError);
    this.submitSuccess$ = this.store.select(fromForgotPasswordReducer.getForgotPasswordSuccess);
  }

  ngOnInit(): void {
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
  }

  submit() {

    this.attemptedFormSubmit = true;
    if (!this.emailForm.invalid) {
       this.store.dispatch(new fromForgotPasswordActions.SendingPasswordReset({ email: this.email.value.toString() }));
    }
  }

  get email() {
    return this.emailForm.get('email');
  }
}
