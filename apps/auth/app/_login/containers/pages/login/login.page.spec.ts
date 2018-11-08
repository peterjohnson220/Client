import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TestBed, ComponentFixture } from '@angular/core/testing';

import { StoreModule, Store, combineReducers } from '@ngrx/store';
import { of } from 'rxjs';
import spyOn = jest.spyOn;

import * as fromRootState from 'libs/state/state';
import * as fromLoginActions from '../../../actions/login.actions';
import { LoginPageComponent } from './login.page';
import * as fromReducers from '../../../reducers';

import {
  ReactiveFormsModule,
  FormBuilder
} from '@angular/forms';

describe('Auth - Login', () => {
  let fixture: ComponentFixture<LoginPageComponent>;
  let instance: LoginPageComponent;
  let store: Store<fromReducers.State>;
  let formBuilder: FormBuilder;
  const queryStringParams = { 'nextPage': '/thisisthenextpage' };
  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          loginReducers: combineReducers(fromReducers.reducers)
        }),
        ReactiveFormsModule
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { queryParamMap: { keys: queryStringParams } }
          }
        }
      ],
      declarations: [
        LoginPageComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });
    formBuilder = new FormBuilder();
    fixture = TestBed.createComponent(LoginPageComponent);
    instance = fixture.componentInstance;
    instance.loginForm = formBuilder.group({
      'email': ['test@test.com'],
      'password' : ['mypassword']
    });

    store = TestBed.get(Store);
    spyOn(store, 'dispatch');
  });

  it('should show login when page is loaded', () => {

    instance.login$ = of(false);
    instance.loginSuccess$ = of(false);
    instance.loginError$ = of(false);

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });
  it('should show error notification on submitError', () => {

    instance.login$ = of(false);
    instance.loginSuccess$ = of(false);
    instance.loginError$ = of(true);

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should disable and show correct login button text when logging in', () => {

    instance.login$ = of(true);
    instance.loginSuccess$ = of(true);
    instance.loginError$ = of(false);

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it ('should show the Request Access button when the feature is on', () => {
    instance.allowSelfRegistration = true;

    fixture.detectChanges();

    const selfRegistrationButtonHtml = fixture.nativeElement.querySelector('button#au-btn-self-registration').innerHTML;
    expect(selfRegistrationButtonHtml).toContain('Request Access');
  });

  it ('should hide the Request Access button when the feature is off', () => {
    instance.allowSelfRegistration = false;

    fixture.detectChanges();

    const selfRegistrationButton = fixture.nativeElement.querySelector('button#au-btn-self-registration');
    expect(selfRegistrationButton).toBeNull();
  });

  it ('should show the Request Access modal wrapper when the feature is on', () => {
    instance.allowSelfRegistration = true;

    fixture.detectChanges();

    const selfRegistrationButtonHtml = fixture.nativeElement.querySelector('pf-self-registration-modal');
    expect(selfRegistrationButtonHtml).toBeTruthy();
  });

  it ('should hide the Request Access modal wrapper when the feature is off', () => {
    instance.allowSelfRegistration = false;

    fixture.detectChanges();

    const selfRegistrationButton = fixture.nativeElement.querySelector('pf-self-registration-modal');
    expect(selfRegistrationButton).toBeNull();
  });

});
