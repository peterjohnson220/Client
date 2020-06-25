import { async, TestBed } from '@angular/core/testing';

import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { getMockUserAssignedRoleWithPermissions } from 'libs/models/security';
import { RolesApiService } from 'libs/data/payfactors-api/company-admin';
import * as fromRootState from 'libs/state/state';

import { UserRoleFunctionTabComponent } from './user-role-function-tab.component';
import * as fromUserRoleViewReducer from '../../reducers';
import { VisiblePermissionsPipe } from '../../pipes/visible-permissions.pipe';

describe('UserRoleFunctionTabComponent', () => {
  let fixture, component;
  let store: Store<fromUserRoleViewReducer.State>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          companyAdminUserRoles: combineReducers(fromUserRoleViewReducer.reducers)
        }),
      ],
      providers: [RolesApiService],
      declarations: [UserRoleFunctionTabComponent, VisiblePermissionsPipe],
      schemas: [NO_ERRORS_SCHEMA]
    });
    store = TestBed.inject(Store);

    spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(UserRoleFunctionTabComponent);
    component = fixture.componentInstance;
    component.systemPermissions = getMockUserAssignedRoleWithPermissions().Permissions;
  }));

  it('Page load', () => {
    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
  });
  it('Check parents checkbox', () => {
    component.handleCheckBoxCheck(component.systemPermissions[0]);
    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
  });
});
