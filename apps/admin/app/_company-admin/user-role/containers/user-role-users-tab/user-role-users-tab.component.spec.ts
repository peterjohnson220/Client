import { TestBed } from '@angular/core/testing';

import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { getMockUserAssignedRoleWithPermissions, getMockUsersAndRoles } from 'libs/models/security';
import * as fromRootState from 'libs/state/state';

import { UserRoleUsersTabComponent } from './user-role-users-tab.component';
import { UserRoleService } from '../../services';
import * as fromUserRoleViewReducer from '../../reducers';
import * as fromUserRoleUserTabActions from '../../actions/user-role-users-tab.action';
import { ScrollingModule } from '@angular/cdk/scrolling';

describe('UserRoleUserTabComponent', () => {
  let fixture, component;
  let store: Store<fromUserRoleViewReducer.State>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ScrollingModule,
        StoreModule.forRoot({
          ...fromRootState.reducers,
          companyAdminMain: combineReducers(fromUserRoleViewReducer.reducers)
        }),
      ],
      providers: [UserRoleService],
      declarations: [UserRoleUsersTabComponent],
      schemas: [NO_ERRORS_SCHEMA]
    });
    store = TestBed.inject(Store);

    spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(UserRoleUsersTabComponent);
    component = fixture.componentInstance;
    component.currentRole = getMockUserAssignedRoleWithPermissions();
  });

  it('Page load', () => {
    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
  });

  it('Update search and dispatch update action', () => {
    const testFilterTerm = '1';
    component.updateSearchFilter(testFilterTerm);
    const expectedAction = (new fromUserRoleUserTabActions.FilterUsersCollection(testFilterTerm));
    fixture.detectChanges();
    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('Add a user to the current role', () => {
    const userToAdd = getMockUsersAndRoles()[1];
    const expectedAction = (new fromUserRoleUserTabActions.AddUserToRole(userToAdd));
    component.addUserToRole(userToAdd);
    fixture.detectChanges();
    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });
});
