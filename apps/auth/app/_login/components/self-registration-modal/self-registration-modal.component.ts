import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';

import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import * as fromLoginReducer from '../../reducers';
import * as fromLoginActions from '../../actions/login.actions';
import * as fromSelfRegistrationActions from '../../actions/self-registration.actions';

import { PfValidators, PfEmailValidators } from 'libs/forms/validators';
import { SelfRegistrationValidationService } from '../../services/self-registration-validation.service';

@Component({
  selector: 'pf-self-registration-modal',
  providers: [ SelfRegistrationValidationService ],
  templateUrl: './self-registration-modal.component.html',
  styleUrls: ['./self-registration-modal.component.scss']
})
export class SelfRegistrationModalComponent implements OnInit, OnDestroy {

  selfRegistrationForm: FormGroup;
  showSelfRegistrationModal$: Observable<boolean>;
  showSuccessMessage$: Observable<boolean>;
  isSubmitError$: Observable<boolean>;
  email: string;
  showSelfRegistrationModalSubscription: Subscription;
  formValueChangesSubscription: Subscription;
  @ViewChild('firstName') firstName: ElementRef;

  constructor(
    private formBuilder: FormBuilder,
    public validationService: SelfRegistrationValidationService,
    public loginStore: Store<fromLoginReducer.State>) {

    this.showSelfRegistrationModal$ = this.loginStore.select(fromLoginReducer.getShowSelfRegistrationForm);
    this.showSuccessMessage$ = this.loginStore.select(fromLoginReducer.getSelfRegistrationRequestSubmitSuccess);
    this.isSubmitError$ = this.loginStore.select(fromLoginReducer.getSelfRegistrationRequestSubmitError);

    this.initForm();
  }

  ngOnInit() {
    // setup a subscriber to send an action with the form contents every time a field is updated
    this.formValueChangesSubscription = this.selfRegistrationForm.valueChanges.subscribe(() => {
      this.loginStore.dispatch(new fromSelfRegistrationActions.FieldChange(this.selfRegistrationForm.value));
      this.email = this.emailControl.value;
    });

    this.showSelfRegistrationModalSubscription = this.showSelfRegistrationModal$.subscribe(showForm => {
      // when the modal is opened, focus on top field
      if (showForm) {
        setTimeout(() => { this.firstName.nativeElement.focus(); }, 0);
      } else {
        // when the modal is closed, reset form control markers if they are empty
        Object.keys(this.selfRegistrationForm.controls).forEach(controlName => {
          const control = this.selfRegistrationForm.get(controlName);
          if (!control.value) {
            control.markAsPristine();
            control.markAsUntouched();
          }
        });
      }
    });
  }

  ngOnDestroy() {
    this.showSelfRegistrationModalSubscription.unsubscribe();
    this.formValueChangesSubscription.unsubscribe();
  }

  onSelfRegistrationSubmit() {
    this.loginStore.dispatch(new fromSelfRegistrationActions.RequestSubmit());
  }

  onSelfRegistrationDismiss() {
    this.loginStore.dispatch(new fromLoginActions.LoginDismissSelfRegistration());
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
    if (event.keyCode === 13 && this.selfRegistrationForm.valid) {
      this.loginStore.dispatch(new fromSelfRegistrationActions.RequestSubmit());
    }
  }

  hideControlValidationError(control: AbstractControl): boolean {
    return !(control.invalid && control.touched && control.dirty);
  }

  initForm() {
    // set default/empty values for each form field, and compose appropriate validators for each
    const validator = this.validationService;
    this.selfRegistrationForm = this.formBuilder.group({
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

  get firstNameControl(): AbstractControl {
    return this.selfRegistrationForm.get('FirstName');
  }
  get lastNameControl(): AbstractControl {
    return this.selfRegistrationForm.get('LastName');
  }
  get emailControl(): AbstractControl {
    return this.selfRegistrationForm.get('Email');
  }
  get titleControl(): AbstractControl {
    return this.selfRegistrationForm.get('Title');
  }
  get companyNameControl(): AbstractControl {
    return this.selfRegistrationForm.get('CompanyName');
  }
  get websiteControl(): AbstractControl {
    return this.selfRegistrationForm.get('Website');
  }
  get numberEmployeesControl(): AbstractControl {
    return this.selfRegistrationForm.get('NumberEmployees');
  }
}
