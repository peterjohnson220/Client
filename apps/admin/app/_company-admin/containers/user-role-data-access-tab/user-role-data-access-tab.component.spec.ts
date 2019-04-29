import { async, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import {combineReducers, Store, StoreModule} from '@ngrx/store';

import * as fromRootState from 'libs/state/state';
import {DataTypeFilterPipe} from 'libs/core/pipes';
import {getMockDataTypes} from 'libs/models/security/roles/data-type.model';
import {getMockRoleDataRestrictions} from 'libs/models/security/roles/role-data-restriction.model';

import { UserRoleDataAccessTabComponent } from './user-role-data-access-tab.component';
import * as fromUserRoleViewReducer from '../../reducers';
import * as fromDataAccessTabActions from '../../reducers';




describe('UserRoleDataAccessTabComponent', () => {
  let fixture, component;
  let store: Store<fromUserRoleViewReducer.State>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          userRoleAdminMain: combineReducers(fromDataAccessTabActions.reducers)
        }),
      ],
      declarations: [UserRoleDataAccessTabComponent, DataTypeFilterPipe],
      schemas: [NO_ERRORS_SCHEMA]
    });
    store = TestBed.get(Store);

    spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(UserRoleDataAccessTabComponent);
    component = fixture.componentInstance;  // to access properties and methods
    component.roleDataRestrictions = getMockRoleDataRestrictions();
    component.dataTypes = getMockDataTypes();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should match snapshot', () => {
    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
  });

});
