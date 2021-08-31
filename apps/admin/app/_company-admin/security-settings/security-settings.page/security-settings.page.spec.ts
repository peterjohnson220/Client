import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';

import { Store, StoreModule } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';
import * as fromPasswordSettingsReducer from '../reducers';
import { SecuritySettingsPageComponent } from './security-settings.page';
import { SecurityManagementSettingsComponent } from '../containers';
import { AbstractFeatureFlagService } from 'libs/core/services/feature-flags';

describe('SecuritySettingsComponent', () => {
  let abstractFeatureFlagService: AbstractFeatureFlagService;
  let component: SecuritySettingsPageComponent;
  let fixture: ComponentFixture<SecuritySettingsPageComponent>;
  let childComponent: SecurityManagementSettingsComponent;
  let childFixture: ComponentFixture<SecurityManagementSettingsComponent>;
  let store: Store<fromPasswordSettingsReducer.State>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SecuritySettingsPageComponent, SecurityManagementSettingsComponent ],
      providers: [ FormBuilder, {
        provide: AbstractFeatureFlagService,
        useValue: { enabled: jest.fn(), bindEnabled: jest.fn() }
      } ],
      schemas: [ NO_ERRORS_SCHEMA ],
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers
        }),
        StoreModule.forFeature('companyAdminPasswordSettings', fromPasswordSettingsReducer.reducers)
      ]
    })
    .compileComponents();

    abstractFeatureFlagService = TestBed.inject(AbstractFeatureFlagService);
  }));

  beforeEach(() => {
    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(SecuritySettingsPageComponent);
    component = fixture.componentInstance;
    childFixture = TestBed.createComponent(SecurityManagementSettingsComponent);
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
    const spy = jest.spyOn(component.settingsComponent, 'trySubmit');
    component.save();
    expect(spy).toHaveBeenCalled();
  });

  it('PasswordManagementComponent - cancel() should call resetForm on child', () => {
    const spy = jest.spyOn(component.settingsComponent, 'resetForm');
    component.cancel();
    expect(spy).toHaveBeenCalled();
  });

});
