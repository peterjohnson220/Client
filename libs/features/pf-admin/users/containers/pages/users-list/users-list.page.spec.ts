import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { combineReducers, Store, StoreModule } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';
import { UsersListPageComponent } from './users-list.page';
import * as fromUsersListReducer from '../../../reducers';
import * as fromUsersListAction from '../../../actions/users-list.actions';


describe('Pf-Admin - Users - Users List Page', () => {
  let instance: UsersListPageComponent;
  let fixture: ComponentFixture<UsersListPageComponent>;
  let store: Store<fromUsersListReducer.State>;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          pf_admin: combineReducers(fromUsersListReducer.reducers),
        })
      ],
      declarations: [
        UsersListPageComponent,
      ],
      providers: [
        {
          provide: Router,
          useValue: { navigate: jest.fn() },
        }
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.get(Store);
    router = TestBed.get(Router);

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

  it('Should navigate to the add user page when the add user button is clicked', () => {
    spyOn(router, 'navigate');

    instance.companyId = 1;
    instance.parentRoute = '/companies';
    instance.handleAddButton();

    expect(router.navigate).toHaveBeenCalledWith(['/companies', 1, 'users', 'add']);
  });

});
