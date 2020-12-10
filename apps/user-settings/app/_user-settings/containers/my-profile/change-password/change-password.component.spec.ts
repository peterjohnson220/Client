import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TestBed, ComponentFixture } from '@angular/core/testing';

import { StoreModule, Store, combineReducers } from '@ngrx/store';
import { of } from 'rxjs';
import spyOn = jest.spyOn;

import * as fromRootState from 'libs/state/state';

import * as fromChangePasswordActions from '../../../actions/change-password.actions';
import * as fromUserSettingsReducer from '../../../reducers';
import { ChangePasswordComponent } from './change-password.component';


describe('Auth - Reset Password', () => {
  let fixture: ComponentFixture<ChangePasswordComponent>;
  let instance: ChangePasswordComponent;
  let store: Store<fromUserSettingsReducer.State>;
  let route: ActivatedRoute;

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          userSettingsReducers: combineReducers(fromUserSettingsReducer.reducers)
        })
      ],
      providers: [
        {
          provide: ActivatedRoute,
        }
      ],
      declarations: [
        ChangePasswordComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.inject(Store);
    route = TestBed.inject(ActivatedRoute);

    spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(ChangePasswordComponent);
    instance = fixture.componentInstance;


  });

  it('should show reset password section when page is loaded', () => {

    instance.resetSuccess$ = of(false);
    instance.resetError$ = of(false);
    instance.minLength$ = of(8);
    instance.submitEnabled = false;

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should disable reset password button when submitting', () => {

    instance.resetSuccess$ = of(false);
    instance.resetError$ = of(false);
    instance.submitting$ = of(true);

    instance.submitEnabled = false;

    instance.minLength$ = of(8);

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();

  });

  it('should show password reset success section ', () => {
    instance.resetSuccess$ = of(true);
    instance.resetError$ = of(false);
    instance.submitting$ = of(true);

    instance.minLength$ = of(8);

    instance.submitEnabled = false;

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });


  it('should show error section on resetError', () => {
    instance.resetSuccess$ = of(false);
    instance.resetError$ = of(true);
    instance.submitting$ = of(false);

    instance.submitEnabled = false;

    instance.minLength$ = of(8);

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });


  it('should dispatch ChangePassword action when change password button is clicked', () => {

    instance.resetSuccess$ = of(false);
    instance.resetError$ = of(false);

    instance.currentPassword = 'test1234';
    instance.password = 'test123';

    instance.minLength$ = of(8);

    const action = new fromChangePasswordActions.ChangePassword({CurrentPassword: instance.currentPassword, NewPassword: instance.password});

    instance.changePassword();

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

});
