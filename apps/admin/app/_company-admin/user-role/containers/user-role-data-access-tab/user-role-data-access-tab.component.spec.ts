import { async, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { combineReducers, Store, StoreModule } from '@ngrx/store';

import { Observable } from 'rxjs';
import 'rxjs/add/observable/of';

import * as fromRootState from 'libs/state/state';
import { DataTypeFilterPipe } from 'libs/core/pipes';
import { getMockDataTypes } from 'libs/models/security/roles/data-type.model';
import { getMockRoleDataRestrictions } from 'libs/models/security/roles/role-data-restriction.model';
import { generateMockSystemDefinedUserAssignedRole, generateMockUserAssignedRole } from 'libs/models/security/roles/user-assigned-roles.model';

import { UserRoleDataAccessTabComponent } from './user-role-data-access-tab.component';
import * as fromUserRoleViewReducer from '../../reducers';
import * as fromDataAccessTabActions from '../../reducers';
import { DataAccessService } from '../../services';

describe('UserRoleDataAccessTabComponent', () => {
  let fixture, component;
  let store: Store<fromUserRoleViewReducer.State>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          companyAdminUserRoles: combineReducers(fromDataAccessTabActions.reducers)
        }),
      ],
      providers: [DataAccessService],
      declarations: [UserRoleDataAccessTabComponent, DataTypeFilterPipe],
      schemas: [NO_ERRORS_SCHEMA]
    });
    store = TestBed.inject(Store);

    spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(UserRoleDataAccessTabComponent);
    component = fixture.componentInstance;  // to access properties and methods
    component.roleDataRestrictions$ = Observable.of(getMockRoleDataRestrictions());
    component.dataTypes$ = Observable.of(getMockDataTypes());
    component.currentRole$ = Observable.of(generateMockUserAssignedRole());
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show data access tab on company role', () => {
    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
  });

  it('should display message on system role', () => {
    component.currentRole$ = Observable.of(generateMockSystemDefinedUserAssignedRole());
    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
  });

});
