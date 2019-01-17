import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {combineReducers, Store, StoreModule} from '@ngrx/store';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {HttpClient, HttpHandler} from '@angular/common/http';

import {getMockUserAssignedRoleWithPermissions} from 'libs/models/security';
import { RolesApiService } from 'libs/data/payfactors-api/company-admin';
import {PayfactorsApiService} from 'libs/data/payfactors-api/payfactors-api.service';
import * as fromRootState from 'libs/state/state';

import {UserRoleFunctionTabComponent} from './user-role-function-tab.component';
import * as fromUserRoleViewReducer from '../../reducers';

describe('UserRoleFunctionTabComponent', () => {
  let fixture, component;
  let store: Store<fromUserRoleViewReducer.State>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          userRoleAdminMain: combineReducers(fromUserRoleViewReducer.reducers)
        }),
      ],
      providers: [ RolesApiService ],
      declarations: [UserRoleFunctionTabComponent],
      schemas: [NO_ERRORS_SCHEMA]
    });
    store = TestBed.get(Store);

    spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(UserRoleFunctionTabComponent);
    component = fixture.componentInstance;
    component.currentRole = getMockUserAssignedRoleWithPermissions();
  }));

  it('Page load', () => {
    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
  });
  it('Check parents checkbox', () => {
    component.handleCheckBoxCheck(component.currentRole.Permissions[0]);
    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
  });
  it('Change Company Role', () => {
    const newRole = getMockUserAssignedRoleWithPermissions();
    // any number beside 1
    const newRoleDerivedId = 2;
    newRole.RoleId = newRoleDerivedId;
    component.currentRole = newRole;
    fixture.detectChanges();
    expect(fixture).toBeTruthy();
  });
  it('Save Changes', () => {
    component.handleSaveClicked();
    expect(fixture).toMatchSnapshot();
  });
});
