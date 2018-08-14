import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';

import { StoreModule, Store, combineReducers } from '@ngrx/store';
import { of } from 'rxjs/observable/of';
import spyOn = jest.spyOn;

import * as fromRootState from 'libs/state/state';
import { FirstLoginPageComponent } from '../first-login/first-login.page';
import * as fromReducers from '../../../reducers';

import {
  ReactiveFormsModule,
  FormBuilder
} from '@angular/forms';

describe('Auth - First Time Login', () => {
  let fixture: ComponentFixture<FirstLoginPageComponent>;
  let instance: FirstLoginPageComponent;
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
        FirstLoginPageComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });
    formBuilder = new FormBuilder();
    fixture = TestBed.createComponent(FirstLoginPageComponent);
    instance = fixture.componentInstance;

    store = TestBed.get(Store);
    spyOn(store, 'dispatch');
  });

  it('should show reset password section when page is loaded', () => {

    instance.companySettingsLoading$ = of(false);
    instance.userContextLoading$ = of(false);
    instance.validatingFirstLogin$ = of(false);
    instance.validatingFirstLoginSuccess$ = of(true);

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should show the loading message when the page is loading', () => {

    instance.companySettingsLoading$ = of(true);
    instance.userContextLoading$ = of(true);
    instance.validatingFirstLogin$ = of(true);

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should disable Submit password button when password is not valid', () => {

    instance.companySettingsLoading$ = of(false);
    instance.userContextLoading$ = of(false);
    instance.validatingFirstLogin$ = of(false);
    instance.validatingFirstLoginSuccess$ = of(true);

    instance.invalid();

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });


  it('should show error notification on updatingPasswordError', () => {
    instance.companySettingsLoading$ = of(false);
    instance.userContextLoading$ = of(false);
    instance.validatingFirstLogin$ = of(false);
    instance.validatingFirstLoginSuccess$ = of(true);

    instance.updatingPasswordError$ = of(true);

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

});
