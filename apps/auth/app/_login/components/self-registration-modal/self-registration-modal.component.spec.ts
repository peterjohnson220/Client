import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';

import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { PfFormsModule } from 'libs/forms/forms.module';

import * as fromRootState from 'libs/state/state';
import * as fromLoginReducer from '../../reducers';
import * as fromLoginActions from '../../actions/login.actions';
import * as fromSelfRegistrationActions from '../../actions/self-registration.actions';

import { SelfRegistrationModalComponent } from './self-registration-modal.component';

describe('SelfRegistrationModalComponent', () => {
  let component: SelfRegistrationModalComponent;
  let fixture: ComponentFixture<SelfRegistrationModalComponent>;
  let store: Store<fromRootState.State>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          authMain: combineReducers(fromLoginReducer.reducers)
        }),
        PfFormsModule
      ],
      declarations: [SelfRegistrationModalComponent],
    })
    .compileComponents();

    store = TestBed.get(Store);
    spyOn(store, 'dispatch');
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelfRegistrationModalComponent);
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

  it('should dispatch the right action when the modal is dismissed', () => {
    component.onSelfRegistrationDismiss();

    const dismissAction = new fromLoginActions.LoginDismissSelfRegistration();
    expect(store.dispatch).toHaveBeenCalledWith(dismissAction);
  });

  it('should dispatch the right action when the modal is submitted', () => {
    component.onSelfRegistrationSubmit();

    const submitAction = new fromSelfRegistrationActions.Submit();
    expect(store.dispatch).toHaveBeenCalledWith(submitAction);
  });

  it('should not dispatch the submit action when enter is clicked and the form is invalid', () => {
    const enterKeyEvent = { keyCode: 13 };
    component.selfRegistrationForm = { valid: false } as FormGroup;

    component.onKeyDown(enterKeyEvent);

    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('should dispatch the submit action when enter is clicked and the form is valid', () => {
    const enterKeyEvent = { keyCode: 13 };
    component.selfRegistrationForm = { valid: true } as FormGroup;

    component.onKeyDown(enterKeyEvent);

    const submitAction = new fromSelfRegistrationActions.Submit();
    expect(store.dispatch).toHaveBeenCalledWith(submitAction);
  });

  it('should not auto populate website if the email is invalid', () => {
    component.initForm();
    component.selfRegistrationForm.controls.Email.setValue('');

    component.onEmailBlur();

    expect(component.selfRegistrationForm.controls.Website.value).toBeFalsy();
  });

  it('should auto populate website from email if the email is valid', () => {
    component.initForm();
    component.selfRegistrationForm.controls.Email.setValue('valid@email.com');

    component.onEmailBlur();

    expect(component.selfRegistrationForm.controls.Website.value).toBe('email.com');
  });

  it('should trim entered text fields on blur', () => {
    const formControlNames = ['FirstName', 'LastName', 'Email', 'Title', 'CompanyName', 'Website'];

    component.initForm();

    // set each form value to have a starting and trailing space
    formControlNames.forEach(controlName => {
      component.selfRegistrationForm.controls[controlName].setValue(` ${controlName} `);
    });

    // call onFieldBlur for each control
    formControlNames.forEach(controlName => {
      component.onFieldBlur(controlName);
    });

    // loop through each of the controls, and assert the first and last values are not spaces
    formControlNames.forEach(controlName => {
      expect(component.selfRegistrationForm.controls[controlName].value.charAt(0)).not.toMatch(' ');

      const lastCharacterIndex = component.selfRegistrationForm.controls[controlName].value.length - 1;
      expect(component.selfRegistrationForm.controls[controlName].value.charAt(lastCharacterIndex)).not.toMatch(' ');
    });
  });
});
