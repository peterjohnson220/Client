import { async, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { combineReducers, Store, StoreModule } from '@ngrx/store';

import { generateMockUserAssignedRole } from 'libs/models/security';
import { CompanyAdminApiService } from 'libs/data/payfactors-api/company-admin';
import { PayfactorsApiService } from 'libs/data/payfactors-api/payfactors-api.service';
import { PfCommonModule } from 'libs/core';
import * as fromRootState from 'libs/state/state';

import { UserRolePageComponent } from './user-role.page';
import { UserRoleService } from '../../services';
import { UserRoleTabState } from '../../constants/user-role.constants';
import * as fromUserRoleViewReducer from '../../reducers';
import * as fromUserRoleViewActions from '../../actions';

describe('UserRolePageComponent', () => {
  let fixture, component, de;
  let store: Store<fromUserRoleViewReducer.State>;
  let userRoleService: UserRoleService;
  let bindingElement: HTMLUListElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          userRoleViewAdminMain: combineReducers(fromUserRoleViewReducer.reducers)
        }),

        // PF
        PfCommonModule
      ],
      providers: [UserRoleService, CompanyAdminApiService, PayfactorsApiService],
      declarations: [UserRolePageComponent],
      schemas: [NO_ERRORS_SCHEMA]
    });
    store = TestBed.get(Store);
    userRoleService = TestBed.get(UserRoleService);

    spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(UserRolePageComponent);
    component = fixture.componentInstance;  // to access properties and methods
    de = fixture.debugElement;            // test helper
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should match snapshot', () => {
    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
  });

  it('should display user roles in au-user-assigned-role-nav', () => {
    const mockUserAssignedRoles = [generateMockUserAssignedRole()];
    component.userAssignedRoles = [mockUserAssignedRoles];

    bindingElement = de.query(By.css('.au-user-assigned-role-nav')).nativeElement;

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
    expect(bindingElement.childElementCount).toBe(mockUserAssignedRoles.length);
  });

  it('should dispatch OpenAddCompanyRoleModal when create user clicked', () => {
    const openAddCompanyRoleModal = new fromUserRoleViewActions.OpenAddCompanyRoleModal();

    fixture.detectChanges();
    component.createUserRole();

    expect(store.dispatch).toHaveBeenCalledWith(openAddCompanyRoleModal);
  });

  it('should call UpdateCurrentUserRole and dispatch UpdateCurrentUserRole when click role', () => {
    spyOn(userRoleService, 'updateCurrentUserRole');
    const mockUserAssignedRole = generateMockUserAssignedRole();

    fixture.detectChanges();
    component.clickRole(mockUserAssignedRole);

    expect(userRoleService.updateCurrentUserRole).toHaveBeenCalledWith(mockUserAssignedRole);
    expect(store.dispatch).toHaveBeenCalled();
  });

  it('should call UpdateCurrentUserRoleViewTabState and dispatch UpdateUserRoleTabState when tab click', () => {
    spyOn(userRoleService, 'updateCurrentUserRoleViewTabState');
    const mockUserRoleTabState = UserRoleTabState.USERS;

    fixture.detectChanges();
    component.handleTabClick(mockUserRoleTabState);

    expect(userRoleService.updateCurrentUserRoleViewTabState).toHaveBeenCalledWith(mockUserRoleTabState);
  });
});
