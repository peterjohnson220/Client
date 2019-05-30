import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';

import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import * as fromRegistrationReducer from '../../../reducers';
import * as fromRegistrationFormActions from '../../../actions/registration-form.actions';

import { PfValidators, PfEmailValidators } from 'libs/forms/validators';
import { RegistrationFormValidationService } from '../../../services/registration-form-validation.service';

import { environment } from 'environments/environment';

@Component({
  selector: 'pf-registration-form-page',
  providers: [ RegistrationFormValidationService ],
  templateUrl: './registration-form.page.html',
  styleUrls: [ './registration-form.page.scss' ]
})
export class RegistrationFormPageComponent implements OnInit, OnDestroy {

  registrationForm: FormGroup;
  showSuccessMessage$: Observable<boolean>;
  isSubmitError$: Observable<boolean>;
  isSubmitting$: Observable<boolean>;
  email: string;
  formValueChangesSubscription: Subscription;
  formSubmittingSubscription: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    public validationService: RegistrationFormValidationService,
    public registrationStore: Store<fromRegistrationReducer.State>) {

    if (environment.allowHubspotRegistration && window.location) {
      window.location.href = environment.hubspotRegistrationUrl;
    }

    this.showSuccessMessage$ = this.registrationStore.select(fromRegistrationReducer.getRegistrationFormSubmitSuccess);
    this.isSubmitError$ = this.registrationStore.select(fromRegistrationReducer.getRegistrationFormSubmitError);
    this.isSubmitting$ = this.registrationStore.select(fromRegistrationReducer.getRegistrationFormIsSubmitting);

    this.initForm();
  }

  ngOnInit() {
    // setup a subscriber to send an action with the form contents every time a field is updated
    this.formValueChangesSubscription = this.registrationForm.valueChanges.subscribe(() => {
      this.registrationStore.dispatch(new fromRegistrationFormActions.FieldChange(this.registrationForm.value));
      this.email = this.emailControl.value;
    });
    // disable the form while submitting
    this.formSubmittingSubscription = this.isSubmitting$.subscribe(isSubmitting => {
      if (isSubmitting) {
        this.registrationForm.disable();
      } else {
        this.registrationForm.enable();
      }
    });
  }

  ngOnDestroy() {
    this.formValueChangesSubscription.unsubscribe();
    this.formSubmittingSubscription.unsubscribe();
    this.registrationStore.dispatch(new fromRegistrationFormActions.ClearForm());
  }

  submitRegistrationForm() {
    this.registrationStore.dispatch(new fromRegistrationFormActions.Submit());
  }

  onFieldBlur(formControl: AbstractControl) {
    // when a text field is blurred trim it's contents
    formControl.setValue(formControl.value.trim());
  }

  onEmailBlur() {
    // if the email is valid auto fill the website on blur, but only if website is untouched
    if (this.emailControl.valid && !this.websiteControl.touched) {
      const indexOfStrudel = this.emailControl.value.indexOf('@');
      this.websiteControl.setValue(this.emailControl.value.substring(indexOfStrudel + 1));
    }
  }

  onKeyDown(event) {
    // submit the form if the enter key is clicked and form is valid
    if (event.keyCode === 13 && this.registrationForm.valid) {
      this.registrationStore.dispatch(new fromRegistrationFormActions.Submit());
    }
  }

  hideControlValidationError(control: AbstractControl): boolean {
    return !(control.invalid && control.touched && control.dirty);
  }

  initForm() {
    // set default/empty values for each form field, and compose appropriate validators for each
    const validator = this.validationService;
    this.registrationForm = this.formBuilder.group({
      FirstName: [
        '',
        [
          PfValidators.required,
          Validators.minLength(validator.NAME_LENGTH.min),
          Validators.maxLength(validator.NAME_LENGTH.max),
          validator.validateSpecialChars
        ]
      ],
      LastName: [
        '',
        [
          PfValidators.required,
          Validators.minLength(validator.NAME_LENGTH.min),
          Validators.maxLength(validator.NAME_LENGTH.max),
          validator.validateSpecialChars
        ]
      ],
      Email: [
        '',
        [
          PfValidators.required,
          PfEmailValidators.emailFormat,
          PfEmailValidators.workEmail
        ]
      ],
      Title: [
        '',
        [
          PfValidators.required,
          Validators.minLength(validator.TITLE_LENGTH.min),
          Validators.maxLength(validator.TITLE_LENGTH.max),
          validator.validateSpecialChars
        ]
      ],
      CompanyName: [
        '',
        [
          PfValidators.required,
          Validators.minLength(validator.COMPANY_LENGTH.min),
          Validators.maxLength(validator.COMPANY_LENGTH.max)
        ]
      ],
      Website: [
        '',
        [
          PfValidators.required,
          Validators.minLength(validator.WEBSITE_LENGTH.min),
          Validators.maxLength(validator.WEBSITE_LENGTH.max),
          validator.validateCharsInWebsite
        ]
      ],
      NumberEmployees: [
        0,
        [
          validator.validateNumberEmployees
        ]
      ],
      TermsAndConditions: [
        false,
        [
          Validators.requiredTrue
        ]
      ]
    });
  }

  get submitDisabled$(): Observable<boolean> {
    return this.isSubmitting$.pipe(
      map(isSubmitting => {
        return isSubmitting || !this.registrationForm.valid || this.registrationForm.pristine && this.registrationForm.untouched;
      })
    );
  }

  get firstNameControl(): AbstractControl {
    return this.registrationForm.get('FirstName');
  }

  get lastNameControl(): AbstractControl {
    return this.registrationForm.get('LastName');
  }

  get emailControl(): AbstractControl {
    return this.registrationForm.get('Email');
  }

  get titleControl(): AbstractControl {
    return this.registrationForm.get('Title');
  }

  get companyNameControl(): AbstractControl {
    return this.registrationForm.get('CompanyName');
  }

  get websiteControl(): AbstractControl {
    return this.registrationForm.get('Website');
  }

  get numberEmployeesControl(): AbstractControl {
    return this.registrationForm.get('NumberEmployees');
  }
}
