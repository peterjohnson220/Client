import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { PfFormsModule } from 'libs/forms/forms.module';

import * as fromRootState from 'libs/state/state';
import * as fromRegistrationReducer from '../../../reducers';
import * as fromRegistrationFormActions from '../../../actions/registration-form.actions';

import { RegistrationFormPageComponent } from './registration-form.page';

describe('RegistrationFormPageComponent', () => {
  let component: RegistrationFormPageComponent;
  let fixture: ComponentFixture<RegistrationFormPageComponent>;
  let store: Store<fromRootState.State>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          registration: combineReducers(fromRegistrationReducer.reducers)
        }),
        PfFormsModule
      ],
      declarations: [RegistrationFormPageComponent],
      // Shallow Testing
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    store = TestBed.inject(Store);
    spyOn(store, 'dispatch');
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrationFormPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should match snapshot', () => {
    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
  });

  it('should dispatch the right action when the form is submitted', () => {
    component.submitRegistrationForm();

    const submitAction = new fromRegistrationFormActions.Submit();
    expect(store.dispatch).toHaveBeenCalledWith(submitAction);
  });

  it('should not dispatch the submit action when enter is clicked and the form is invalid', () => {
    const enterKeyEvent = { keyCode: 13 };
    component.registrationForm = { valid: false } as FormGroup;

    component.onKeyDown(enterKeyEvent);

    const submitAction = new fromRegistrationFormActions.Submit();
    expect(store.dispatch).not.toHaveBeenCalledWith(submitAction);
  });

  it('should dispatch the submit action when enter is clicked and the form is valid', () => {
    const enterKeyEvent = { keyCode: 13 };
    component.registrationForm = { valid: true } as FormGroup;

    component.onKeyDown(enterKeyEvent);

    const submitAction = new fromRegistrationFormActions.Submit();
    expect(store.dispatch).toHaveBeenCalledWith(submitAction);
  });

  it('should not auto populate website if the email is invalid', () => {
    component.initForm();
    component.registrationForm.controls.Email.setValue('');

    component.onEmailBlur();

    expect(component.registrationForm.controls.Website.value).toBeFalsy();
  });

  it('should auto populate website from email if the email is valid', () => {
    component.initForm();
    component.registrationForm.controls.Email.setValue('valid@test.com');

    component.onEmailBlur();

    expect(component.registrationForm.controls.Website.value).toBe('test.com');
  });

  it('should trim entered text fields on blur', () => {
    const formControls = [
      component.firstNameControl,
      component.lastNameControl,
      component.emailControl,
      component.titleControl,
      component.companyNameControl,
      component.websiteControl
    ];

    component.initForm();

    // set each form value to have a starting and trailing space
    formControls.forEach(control => {
      control.setValue(` test value `);
    });

    // call onFieldBlur for each control
    formControls.forEach(control => {
      component.onFieldBlur(control);
    });

    // loop through each of the controls, and assert the first and last values are not spaces
    formControls.forEach(control => {
      expect(control.value.charAt(0)).not.toMatch(' ');

      const lastCharacterIndex = control.value.length - 1;
      expect(control.value.charAt(lastCharacterIndex)).not.toMatch(' ');
    });
  });
});
