import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { StoreModule, Store, combineReducers } from '@ngrx/store';
import { of } from 'rxjs';
import spyOn = jest.spyOn;

import * as fromRootState from 'libs/state/state';

import * as fromReducers from '../../../reducers';
import * as fromSelfRegistrationActions from '../../../actions/self-registration.actions';
import { SelfRegistrationPageComponent } from './self-registration.page';

const TEST_TOKEN = 'test_token';

describe('SelfRegistrationPage', () => {
  let fixture: ComponentFixture<SelfRegistrationPageComponent>;
  let instance: SelfRegistrationPageComponent;
  let store: Store<fromReducers.State>;

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          authMain: combineReducers(fromReducers.reducers)
        }),
        ReactiveFormsModule
      ],
      declarations: [
        SelfRegistrationPageComponent
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
    fixture = TestBed.createComponent(SelfRegistrationPageComponent);
    instance = fixture.componentInstance;

    store = TestBed.get(Store);
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

    const validateAction = new fromSelfRegistrationActions.ValidateToken({ token: TEST_TOKEN });
    expect(store.dispatch).toHaveBeenCalledWith(validateAction);
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

});
