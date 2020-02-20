import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';

import { Store, StoreModule } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';
import { SecurityManagementSettingsComponent } from './security-management-settings.component';
import * as fromPasswordSettingsReducer from '../../reducers';
import * as fromPasswordSettingActions from '../../actions/security-settings.action';

describe('PasswordManagementSettingsComponent', () => {
  let component: SecurityManagementSettingsComponent;
  let fixture: ComponentFixture<SecurityManagementSettingsComponent>;
  let store: Store<fromPasswordSettingsReducer.State>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        SecurityManagementSettingsComponent
      ],
      providers: [
        FormBuilder
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ],
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers
        }),
        StoreModule.forFeature('companyAdminPasswordSettings', fromPasswordSettingsReducer.reducers)
      ]
    }).compileComponents();

    store = TestBed.get(Store);
    fixture = TestBed.createComponent(SecurityManagementSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch LoadCompanyAdminPasswordSettings', () => {
    const spy = spyOn(store, 'dispatch');

    component.ngOnInit();
    const expectedAction = new fromPasswordSettingActions.LoadCompanyAdminPasswordSettings();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(expectedAction);
  });
});
