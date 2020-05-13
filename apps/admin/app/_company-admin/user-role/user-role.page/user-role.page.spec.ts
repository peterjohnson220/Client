import { async, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { combineReducers, Store, StoreModule } from '@ngrx/store';

import { generateMockUserAssignedRole } from 'libs/models/security';
import { PfCommonModule } from 'libs/core';
import * as fromRootState from 'libs/state/state';

import { UserRolePageComponent } from './user-role.page';
import { UserRoleService } from '../services';
import { UserRoleTabState } from '../constants/user-role.constants';
import * as fromUserRoleViewReducer from '../reducers';
import * as fromUserRoleViewActions from '../actions';
import * as fromUserRoleActions from '../actions/user-role-view.action';

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
          companyAdminUserRoles: combineReducers(fromUserRoleViewReducer.reducers)
        }),

        // PF
        PfCommonModule
      ],
      providers: [UserRoleService],
      declarations: [UserRolePageComponent],
      schemas: [NO_ERRORS_SCHEMA]
    });
    store = TestBed.inject(Store);
    userRoleService = TestBed.inject(UserRoleService);

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

  it('should display user roles in role-list', () => {
    const mockUserAssignedRoles = [generateMockUserAssignedRole()];
    component.userAssignedRoles = [mockUserAssignedRoles];

    bindingElement = de.query(By.css('.left-side-menu-nav ')).nativeElement;

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

  it('should call UpdateUserTabCurrentUserRole and dispatch UpdateUserTabCurrentUserRole when click role', () => {
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
    const expectedAction = new fromUserRoleActions.UpdateUserRoleTabState(mockUserRoleTabState);

    fixture.detectChanges();
    component.handleTabClick(mockUserRoleTabState);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });
  it('should disable Save button when saveChanges is called', () => {
    const disableAction = new fromUserRoleActions.DisableSaveButton();
    fixture.detectChanges();
    component.saveChanges();
    expect(store.dispatch).toHaveBeenCalledWith(disableAction);
  });
  it('should cancel all changes when cancelChanges is called', () => {
    const cancelAction = new fromUserRoleActions.CancelAllChanges();
    fixture.detectChanges();
    component.cancelChanges();
    expect(store.dispatch).toHaveBeenCalledWith(cancelAction);
  });
  it('should delete role when deleteRole is called and user confirms', () => {
    const mockRole = generateMockUserAssignedRole();
    const deleteAction = new fromUserRoleActions.DeleteRole(mockRole.RoleId);
    component.currentRole = mockRole;
    spyOn(window, 'confirm').and.returnValue(true);
    fixture.detectChanges();
    component.deleteRole();
    expect(store.dispatch).toHaveBeenCalledWith(deleteAction);
  });
  it('should not delete role when user does not confirm', () => {
    const mockRole = generateMockUserAssignedRole();
    const deleteAction = new fromUserRoleActions.DeleteRole(mockRole.RoleId);
    component.currentRole = mockRole;
    spyOn(window, 'confirm').and.returnValue(false);
    fixture.detectChanges();
    component.deleteRole();
    expect(store.dispatch).not.toHaveBeenCalledWith(deleteAction);
  });
});
