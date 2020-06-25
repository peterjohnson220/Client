import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { combineReducers, Store, StoreModule } from '@ngrx/store';

import { PfFormsModule } from 'libs/forms';
import { generateMockUserAssignedRole } from 'libs/models/security';
import * as fromRootState from 'libs/state/state';

import { AddCompanyRoleModalComponent } from './add-company-role-modal.component';
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
          companyAdminUserRoles: combineReducers(fromUserRoleViewReducer.reducers)
        }),
        PfFormsModule
      ],
      declarations: [AddCompanyRoleModalComponent],
    })
      .compileComponents();

    store = TestBed.inject(Store);
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

