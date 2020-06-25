import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { StoreModule, Store, combineReducers } from '@ngrx/store';
import { of } from 'rxjs';
import spyOn = jest.spyOn;

import * as fromRootState from 'libs/state/state';

import * as fromReducers from '../../../reducers';
import * as fromValidateRegistrationActions from '../../../actions/validate-registration.actions';
import * as fromCompleteRegistrationActions from '../../../actions/complete-registration.actions';
import { ValidateRegistrationPageComponent } from './validate-registration.page';

const TEST_TOKEN = 'test_token';

describe('ValidateRegistrationPage', () => {
  let fixture: ComponentFixture<ValidateRegistrationPageComponent>;
  let instance: ValidateRegistrationPageComponent;
  let store: Store<fromReducers.State>;

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          registration: combineReducers(fromReducers.reducers)
        }),
        ReactiveFormsModule
      ],
      declarations: [
        ValidateRegistrationPageComponent
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { queryParamMap: { get : (param: string) => TEST_TOKEN } } }
        }
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });
    fixture = TestBed.createComponent(ValidateRegistrationPageComponent);
    instance = fixture.componentInstance;

    store = TestBed.inject(Store);
    spyOn(store, 'dispatch');
  });

  it('should show the loading message when the page is loading', () => {

    instance.validatingToken$ = of(true);

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should show an error message when page is loaded if the token is invalid', () => {

    instance.validatingToken$ = of(false);
    instance.validatingTokenError$ = of(true);

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should show an error message when page is loaded if the token is expired', () => {

    instance.validatingToken$ = of(false);
    instance.validatingTokenExpired$ = of(true);

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should show an error message when page is loaded if the account exists', () => {

    instance.validatingToken$ = of(false);
    instance.validatingTokenAccountExists$ = of(true);

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should show an error message when page is loaded if the company exists and is Enterprise', () => {

    instance.validatingToken$ = of(false);
    instance.validatingTokenExistingCompany$ = of({ name: 'Company', type: 'Enterprise' });

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should show an error message when page is loaded if the company exists and is Small Business', () => {

    instance.validatingToken$ = of(false);
    instance.validatingTokenExistingCompany$ = of({ name: 'Company', type: 'SmallBusiness' });

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should should allow choosing password when page is loaded successfully', () => {

    instance.validatingToken$ = of(false);
    instance.validatingTokenSuccess$ = of(true);

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should dispatch an action to validate the token', () => {

    instance.ngOnInit();

    const validateAction = new fromValidateRegistrationActions.ValidateToken({ token: TEST_TOKEN });
    expect(store.dispatch).toHaveBeenCalledWith(validateAction);
  });

  it('should show the spinner when resending token', () => {
    instance.validatingToken$ = of(false);
    instance.validatingTokenSuccess$ = of(true);
    instance.resendingToken$ = of(true);

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should show a message after resending successfully', () => {
    instance.validatingToken$ = of(false);
    instance.validatingTokenSuccess$ = of(true);
    instance.resendingToken$ = of(false);
    instance.resendingTokenSuccess$ = of(true);

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should show an error message after resending error', () => {
    instance.validatingToken$ = of(false);
    instance.validatingTokenSuccess$ = of(true);
    instance.resendingToken$ = of(false);
    instance.resendingTokenError$ = of(true);

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should dispatch the right action when the resend button is clicked', () => {
    instance.validatingToken$ = of(false);
    instance.validatingTokenSuccess$ = of(true);
    instance.token = 'token';
    instance.resendToken();

    fixture.detectChanges();

    const action = new fromValidateRegistrationActions.ResendToken({ token: 'token' });
    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  it('should disable Submit password button when password is not valid', () => {

    instance.validatingToken$ = of(false);
    instance.validatingTokenSuccess$ = of(true);

    instance.passwordInvalid();

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should enable Submit password button when password is valid', () => {

    instance.validatingToken$ = of(false);
    instance.validatingTokenSuccess$ = of(true);

    instance.passwordValid('valid_password');

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should disable the submit button when updatePassword is clicked', () => {
    instance.validatingToken$ = of(false);
    instance.validatingTokenSuccess$ = of(true);
    instance.password = 'password';
    instance.updatePassword();

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
    expect(fixture.nativeElement.querySelector('button.btn-default').disabled).toBeTruthy();
  });

  it('should not show the submit spinner when the form is not submitting', () => {
    instance.validatingToken$ = of(false);
    instance.validatingTokenSuccess$ = of(true);
    instance.isSubmitting$ = of(false);

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
    const spinnerContainerClasses = fixture.nativeElement.querySelector('.fa-spin').parentElement.classList;
    expect(spinnerContainerClasses.contains('no-opacity')).toBeTruthy();
  });

  it('should show the submit spinner when the form is submitting', () => {
    instance.validatingToken$ = of(false);
    instance.validatingTokenSuccess$ = of(true);
    instance.isSubmitting$ = of(true);

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should fade the form when the form is submitting', () => {
    instance.validatingToken$ = of(false);
    instance.validatingTokenSuccess$ = of(true);
    instance.isSubmitting$ = of(true);

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should hide the error message when there is no submit error', () => {
    instance.validatingToken$ = of(false);
    instance.validatingTokenSuccess$ = of(true);
    instance.password = 'password';
    instance.updatePassword();
    instance.submitError$ = of(false);

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
    expect(fixture.nativeElement.querySelector('#au-lbl-submit-error.invisible')).toBeTruthy();
  });

  it('should show the error message when there is a submit error', () => {
    instance.validatingToken$ = of(false);
    instance.validatingTokenSuccess$ = of(true);
    instance.password = 'password';
    instance.updatePassword();
    instance.submitError$ = of(true);

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
    expect(fixture.nativeElement.querySelector('#au-lbl-submit-error.visible')).toBeTruthy();
  });

  it('should dispatch the right action when the submit button is clicked', () => {
    instance.validatingToken$ = of(false);
    instance.validatingTokenSuccess$ = of(true);
    instance.password = 'password';
    instance.token = 'token';
    instance.updatePassword();

    fixture.detectChanges();

    const action = new fromCompleteRegistrationActions.Submit({ token: 'token', password: 'password' });
    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

});
