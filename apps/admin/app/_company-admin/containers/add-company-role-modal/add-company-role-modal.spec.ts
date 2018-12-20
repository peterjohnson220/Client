import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';

import { combineReducers, Store, StoreModule } from '@ngrx/store';

import { PfFormsModule } from 'libs/forms';
import { generateMockUserAssignedRole } from 'libs/models/security';
import * as fromRootState from 'libs/state/state';

import { AddCompanyRoleModalComponent } from './add-company-role-modal.component';
import { ENTER_KEYCODE } from '../../constants/add-company-role-modal.constants';
import * as fromUserRoleViewReducer from '../../reducers';
import * as fromUserRoleActions from '../../actions/user-role-view.action';

describe('AddCompanyRoleModalComponent', () => {
  let component: AddCompanyRoleModalComponent;
  let fixture: ComponentFixture<AddCompanyRoleModalComponent>;
  let store: Store<fromUserRoleViewReducer.State>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          userRoleViewAdminMain: combineReducers(fromUserRoleViewReducer.reducers)
        }),
        PfFormsModule
      ],
      declarations: [AddCompanyRoleModalComponent],
    })
      .compileComponents();

    store = TestBed.get(Store);
    spyOn(store, 'dispatch');
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCompanyRoleModalComponent);
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

  it('should dispatch the CloseAddCompanyRoleModal action when the modal is dismissed', () => {
    component.onAddCompanyRoleDismiss();

    const dismissAction = new fromUserRoleActions.CloseAddCompanyRoleModal();
    expect(store.dispatch).toHaveBeenCalledWith(dismissAction);
  });

  it('should dispatch AddCompanyRole action when the modal is submitted', () => {
    const mockCompanyRole = generateMockUserAssignedRole();

    component.currentCompanyRoleName = mockCompanyRole.RoleName;
    component.onAddCompanyRoleSubmit();
    const submitAction = new fromUserRoleActions.AddCompanyRole(mockCompanyRole);
    expect(store.dispatch).toHaveBeenCalledWith(submitAction);
  });

  it('should not dispatch the submit action when enter is clicked and the form is invalid', () => {
    const enterKeyEvent = {keyCode: ENTER_KEYCODE};
    component.addCompanyRoleForm = {valid: false} as FormGroup;

    component.onKeyDown(enterKeyEvent);

    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('should dispatch the submit action when enter is clicked and the form is valid', () => {
    const mockCompanyRoleName = 'TEST_ROLE';
    const mockCompanyRole = {
      DerivedId: 0,
      RoleName: mockCompanyRoleName,
      RoleType: 'C',
      Assigned: false,
      Permissions: null
    };

    component.currentCompanyRoleName = mockCompanyRoleName;

    const enterKeyEvent = {keyCode: ENTER_KEYCODE};
    component.addCompanyRoleForm = {valid: true} as FormGroup;

    component.onKeyDown(enterKeyEvent);

    const submitAction = new fromUserRoleActions.AddCompanyRole(mockCompanyRole);
    expect(store.dispatch).toHaveBeenCalledWith(submitAction);
  });

  it('should trim entered text fields on blur', () => {
    const formControlNames = ['CompanyRoleName'];

    component.initForm();

    // set each form value to have a starting and trailing space
    formControlNames.forEach(controlName => {
      component.addCompanyRoleForm.controls[controlName].setValue(` ${controlName} `);
    });

    // call onFieldBlur for each control
    formControlNames.forEach(controlName => {
      component.onFieldBlur(controlName);
    });

    // loop through each of the controls, and assert the first and last values are not spaces
    formControlNames.forEach(controlName => {
      expect(component.addCompanyRoleForm.controls[controlName].value.charAt(0)).not.toMatch(' ');

      const lastCharacterIndex = component.addCompanyRoleForm.controls[controlName].value.length - 1;
      expect(component.addCompanyRoleForm.controls[controlName].value.charAt(lastCharacterIndex)).not.toMatch(' ');
    });
  });
});

