import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, getTestBed, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';

import { combineReducers, Store, StoreModule } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';
import { UsersListPageComponent } from './users-list.page';
import * as fromUsersListReducer from '../reducers';
import * as fromUsersListAction from '../actions/users-list.actions';

describe('Admin - Company-Admin - Users List Page', () => {
  let instance: UsersListPageComponent;
  let fixture: ComponentFixture<UsersListPageComponent>;
  let store: Store<fromUsersListReducer.State>;
  let router: Router;
  let location: Location;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          companyAdminUserList: combineReducers(fromUsersListReducer.reducers),
        }),
        RouterTestingModule.withRoutes(
          [{path: '', component: UsersListPageComponent}]
        ),
      ],
      declarations: [
        UsersListPageComponent,
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });

    const injector = getTestBed();
    location = injector.get(Location);
    router = injector.get(Router);

    store = TestBed.get(Store);

    fixture = TestBed.createComponent(UsersListPageComponent);
    instance = fixture.componentInstance;

    spyOn(store, 'dispatch');

  });

  it('Should show the page with search bar', () => {
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('Should dispatch an updateUserSearchTerm action when updateUserSearchterm is triggered', () => {
    const mockSearchTerm = 'Mock 1';
    const expectedAction = new fromUsersListAction.UpdateUserSearchTerm(mockSearchTerm);

    instance.updateSearchTerm(mockSearchTerm);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  // TODO: Need a better activated route stub that can get also get us the snapshot data
  // it('Should navigate to the add user page when the add user button is clicked', () => {
  //   spyOn(router, 'navigate');
  //
  //   instance.companyId = 1;
  //   instance.handleAddButton();
  //
  //   expect(router.navigate).toHaveBeenCalledWith(['add'], { relativeTo: route });
  // });

});
