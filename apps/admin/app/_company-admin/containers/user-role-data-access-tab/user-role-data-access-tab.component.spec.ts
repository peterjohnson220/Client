import { async, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { combineReducers, StoreModule } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';

import { UserRoleDataAccessTabComponent } from './user-role-data-access-tab.component';
import * as fromUserRoleViewReducer from '../../reducers';

describe('UserRoleDataAccessTabComponent', () => {
  let fixture, component;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          userRoleViewAdminMain: combineReducers(fromUserRoleViewReducer.reducers)
        }),
      ],
      declarations: [UserRoleDataAccessTabComponent],
      schemas: [NO_ERRORS_SCHEMA]
    });

    fixture = TestBed.createComponent(UserRoleDataAccessTabComponent);
    component = fixture.componentInstance;  // to access properties and methods
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should match snapshot', () => {
    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
  });

});
