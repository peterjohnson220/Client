import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, async, getTestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';

import { combineReducers, Store, StoreModule } from '@ngrx/store';

import { Observable } from 'rxjs';
import 'rxjs/add/observable/of';

import * as fromRootState from 'libs/state/state';
import * as fromUserReducer from '../reducers';
import * as fromUserActions from '../actions/user-management.actions';

import { UserManagementPageComponent } from './user-management.page';
import { generateMockUserManagementDto } from 'libs/models/payfactors-api/user';
import { generateMockUserContext } from 'libs/models';
import { Permissions } from 'libs/constants';

describe('Admin - Company Admin - User Page', () => {
  let instance: UserManagementPageComponent;
  let fixture: ComponentFixture<UserManagementPageComponent>;
  let store: Store<fromUserReducer.State>;
  let router: Router;
  let location: Location;

  const mockCompanyId = 13;
  const mockUserId = 25;

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          companyAdminUserManagement: combineReducers(fromUserReducer.reducers),
        }),
        RouterTestingModule.withRoutes(
          [
            { path: ':companyId/users/add', component: UserManagementPageComponent },
            { path: ':companyId/users/:userId', component: UserManagementPageComponent },
          ]
        ),
      ],
      declarations: [
        UserManagementPageComponent,
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    const injector = getTestBed();
    location = injector.get(Location);
    router = injector.get(Router);

    store = TestBed.get(Store);
    spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(UserManagementPageComponent);

    const mockUserContext = generateMockUserContext();
    mockUserContext.Permissions.push(Permissions.ADD_USER);

    instance = fixture.componentInstance;
    instance.userContext$ = Observable.of(mockUserContext);

  }));

  it('Should show the add user page', () => {
    instance.userId = null;
    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
  });

  it('Should show the edit user page', () => {
    instance.userId = mockUserId;
    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
  });

  it('Should dispatch an LoadRoles action on initial load', () => {
    const expectedAction = new fromUserActions.LoadRoles(mockCompanyId);
    router.navigate([`${this.mockCompanyId}/users/${this.mockUserId}`]).then(() => {
      expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
    });
  });

  it('Should dispatch an LoadUser action for edits', () => {
    const expectedAction = new fromUserActions.LoadUser(mockUserId);
    router.navigate([`${this.mockCompanyId}/users/${this.mockUserId}`]).then(() => {
      expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
    });
  });

  it('Should dispatch an ResetUser action for adding new user', () => {
    const expectedAction = new fromUserActions.ResetUser();
    router.navigate([`${this.mockCompanyId}/users/add`]).then(() => {
      expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
    });
  });

  it('Should dispatch an SaveUser action on Save', () => {
    const mockUser = generateMockUserManagementDto();
    const expectedAction = new fromUserActions.SaveUser(mockUser);

    instance.save(mockUser);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('Should navigate to the user list page when the cancel button is clicked', () => {
    spyOn(location, 'back');
    instance.handleCancel();
    expect(location.back).toHaveBeenCalled();
  });

});
