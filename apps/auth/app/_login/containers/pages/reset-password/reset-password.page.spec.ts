import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TestBed, ComponentFixture } from '@angular/core/testing';

import { StoreModule, Store, combineReducers } from '@ngrx/store';
import { of } from 'rxjs';
import spyOn = jest.spyOn;

import * as fromRootState from 'libs/state/state';
import { ActivatedRouteStub } from 'libs/test/activated-route-stub';

import * as fromResetPasswordActions from '../../../actions/reset-password.actions';
import { ResetPasswordPageComponent } from '../reset-password/reset-password.page';
import * as fromReducers from '../../../reducers';


describe('Auth - Reset Password', () => {
  let fixture: ComponentFixture<ResetPasswordPageComponent>;
  let instance: ResetPasswordPageComponent;
  let store: Store<fromReducers.State>;
  let route: ActivatedRoute;
  const queryStringParams = { tk: 'testToken' };

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          forgotPasswordReducers: combineReducers(fromReducers.reducers)
        })
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { queryParamMap: { get: (key) => queryStringParams[key] } }
          }
        }
      ],
      declarations: [
        ResetPasswordPageComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.inject(Store);
    route = TestBed.inject(ActivatedRoute);

    spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(ResetPasswordPageComponent);
    instance = fixture.componentInstance;


  });

  it('should show reset password section when page is loaded', () => {

    instance.resetSuccess$ = of(false);
    instance.resetError$ = of(false);
    instance.resetTokenExpired$ = of(false);
    instance.tokenValid$ = of(true);
    instance.minLength$ = of(8);

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should disable reset password button and text when submitting', () => {

    instance.resetSuccess$ = of(false);
    instance.resetError$ = of(false);
    instance.resetTokenExpired$ = of(false);

    instance.submitEnabled = false;
    instance.submitting = true;

    instance.tokenValid$ = of(true);
    instance.minLength$ = of(8);

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();

  });

  it('should show password reset success section ', () => {
    instance.resetSuccess$ = of(true);
    instance.resetError$ = of(false);
    instance.resetTokenExpired$ = of(false);

    instance.tokenValid$ = of(true);
    instance.minLength$ = of(8);

    instance.submitEnabled = false;
    instance.submitting = true;

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });


  it('should show error section on resetError', () => {
    instance.resetSuccess$ = of(false);
    instance.resetError$ = of(true);
    instance.resetTokenExpired$ = of(false);

    instance.submitEnabled = false;
    instance.submitting = true;

    instance.tokenValid$ = of(true);
    instance.minLength$ = of(8);

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should show password used section on passwordAlreadyUsed', () => {
    instance.resetSuccess$ = of(false);
    instance.resetError$ = of(false);
    instance.resetTokenExpired$ = of(false);

    instance.submitEnabled = true;
    instance.submitting = false;

    instance.tokenValid$ = of(true);
    instance.passwordAlreadyUsed$ = of(true);
    instance.minLength$ = of(8);

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should dispatch ResetPassword action when reset password button is clicked', () => {

    instance.resetSuccess$ = of(false);
    instance.resetError$ = of(false);
    instance.resetTokenExpired$ = of(false);

    instance.password = 'test123';
    instance.token = 'testToken';

    instance.tokenValid$ = of(true);
    instance.minLength$ = of(8);

    const action = new fromResetPasswordActions.ResetPassword({token: instance.token, password: instance.password});

    instance.resetPassword();

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

});
