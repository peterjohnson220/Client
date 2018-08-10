import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';

import { StoreModule, Store } from '@ngrx/store';
import { of } from 'rxjs/observable/of';

import * as fromRootState from 'libs/state/state';
import * as fromUserAssignedRoleActions from 'libs/state/app-context/actions/user-assigned-roles.actions';

import { UserAssignedRolesComponent} from './user-assigned-roles.component';


describe('Loading User Context', () => {
  let fixture: ComponentFixture<UserAssignedRolesComponent>;
  let instance: UserAssignedRolesComponent;
  let store: Store<fromRootState.State>;

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers
        }),
      ],
      declarations: [
        UserAssignedRolesComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.get(Store);

    spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(UserAssignedRolesComponent);
    instance = fixture.componentInstance;
  });

  it('should dispatch a GetUserAssignedRoles action upon Init', () => {
    const action = new fromUserAssignedRoleActions.GetUserAssignedRoles();

    fixture.detectChanges();

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  it('should show a centered loading indicator, when we are getting the user assigned roles', () => {
    instance.gettingUserAssignedRoles$ = of(true);

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should show a router outlet, when we are not getting the user assigned roles', () => {
    instance.gettingUserAssignedRoles$ = of(false);

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

});
