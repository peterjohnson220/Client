import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';

import { StoreModule, Store, combineReducers } from '@ngrx/store';
import { of } from 'rxjs';
import spyOn = jest.spyOn;

import { environment } from 'environments/environment';
import * as fromRootState from 'libs/state/state';
import * as fromForgotPasswordActions from '../../../actions/forgot-password.actions';
import { ForgotPasswordPageComponent } from '../forgot-password/forgot-password.page';
import * as fromReducers from '../../../reducers';

import {
  ReactiveFormsModule,
  FormBuilder
} from '@angular/forms';

describe('Auth - Forgot Password', () => {
  let fixture: ComponentFixture<ForgotPasswordPageComponent>;
  let instance: ForgotPasswordPageComponent;
  let store: Store<fromReducers.State>;
  let formBuilder: FormBuilder;

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          forgotPasswordReducers: combineReducers(fromReducers.reducers)
        }),
        ReactiveFormsModule
      ],
      declarations: [
        ForgotPasswordPageComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });
    formBuilder = new FormBuilder();
    fixture = TestBed.createComponent(ForgotPasswordPageComponent);
    instance = fixture.componentInstance;
    instance.emailForm = formBuilder.group({
      'email': ['test@test.com']
    });

    store = TestBed.get(Store);
    spyOn(store, 'dispatch');
  });

  it('should show reset password section when page is loaded', () => {

   instance.submitting$ = of(false);
   instance.submitSuccess$ = of(false);
   instance.submitError$ = of(false);

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should disable reset password button and text when submitting', () => {

    instance.submitting$ = of(true);
    instance.submitSuccess$ = of(false);
    instance.submitError$ = of(false);

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should show email sent notification on submitSuccess', () => {

    instance.submitting$ = of(false);
    instance.submitSuccess$ = of(true);
    instance.submitError$ = of(false);

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });


  it('should show error notification on submitError', () => {

    instance.submitting$ = of(false);
    instance.submitSuccess$ = of(false);
    instance.submitError$ = of(true);

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });


  it('should dispatch SendingPasswordReset when reset password button is clicked', () => {

    const testEmail = 'test@test.com';

    instance.submitting$ = of(false);
    instance.submitSuccess$ = of(false);
    instance.submitError$ = of(false);

    const clientSettingRequest = {
      email: testEmail,
      clientCaptchaToken: '',
      clientCaptchaSiteKey: environment.reCaptchaV3SiteKey
    };

    const action = new fromForgotPasswordActions.SendingPasswordReset(clientSettingRequest);

    instance.submit();

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

});
