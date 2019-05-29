import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';

import { Store, StoreModule } from '@ngrx/store';

import { PasswordManagementPageComponent } from './password-management.page';
import { PasswordManagementSettingsComponent } from '../../password-management-settings';
import * as fromRootState from '../../../../../../../libs/state/state';
import * as fromAdminReducer from '../../../reducers';

describe('PasswordManagementComponent', () => {
  let component: PasswordManagementPageComponent;
  let fixture: ComponentFixture<PasswordManagementPageComponent>;
  let childComponent: PasswordManagementSettingsComponent;
  let childFixture: ComponentFixture<PasswordManagementSettingsComponent>;
  let store: Store<fromAdminReducer.State>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PasswordManagementPageComponent, PasswordManagementSettingsComponent ],
      providers: [ FormBuilder ],
      schemas: [ NO_ERRORS_SCHEMA ],
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers
        }),
        StoreModule.forFeature('userRoleAdminMain', fromAdminReducer.reducers)
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    store = TestBed.get(Store);
    fixture = TestBed.createComponent(PasswordManagementPageComponent);
    component = fixture.componentInstance;
    childFixture = TestBed.createComponent(PasswordManagementSettingsComponent);
    childComponent = childFixture.componentInstance;

    component.settingsComponent = childComponent;
    component.settingsComponent.createForm();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.settingsComponent).toBeTruthy();
  });

  it('PasswordManagementComponent - save() should call trySubmit on child', () => {
    const spy = spyOn(component.settingsComponent, 'trySubmit');
    component.save();
    expect(spy).toHaveBeenCalled();
  });

  it('PasswordManagementComponent - cancel() should call resetForm on child', () => {
    const spy = spyOn(component.settingsComponent, 'resetForm');
    component.cancel();
    expect(spy).toHaveBeenCalled();
  });

});
