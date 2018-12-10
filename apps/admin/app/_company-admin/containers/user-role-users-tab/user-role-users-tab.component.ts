import {Component, OnDestroy} from '@angular/core';

import {Store} from '@ngrx/store';
import {Subscription} from 'rxjs';

import {UserAndRoleModel, UserAssignedRole} from 'libs/models/security';

import {UserRoleTabState} from '../../constants/user-role.constants';
import {UserRoleService} from '../../services';
import * as fromUserRoleViewReducer from '../../reducers';
import * as fromUserRoleUserTabActions from '../../actions/user-role-users-tab.action';


@Component({
  selector: 'pf-user-role-users-tab',
  templateUrl: './user-role-users-tab.component.html',
  styleUrls: ['user-role-users-tab.component.scss']
})
export class UserRoleUsersTabComponent implements OnDestroy {
  usersAndRoles: UserAndRoleModel[];
  usersInSelectedRole: UserAndRoleModel[];
  usersNotInCurrentRole: UserAndRoleModel[];
  currentRole: UserAssignedRole;
  searchTerm = '';
  saveButtonText = 'Save';
  usersInActiveRoleSubscription: Subscription;
  usersNotInActiveRoleSubscription: Subscription;
  currentRoleSubscription: Subscription;
  saveButtonTextSubscription: Subscription;

  constructor(private store: Store<fromUserRoleViewReducer.State>, private userRoleService: UserRoleService) {
    this.usersInActiveRoleSubscription = this.store.select(fromUserRoleViewReducer.getUsersInActiveRole).subscribe(u => {
      this.usersInSelectedRole = u;
    });

    this.usersNotInActiveRoleSubscription = this.store.select(fromUserRoleViewReducer.getUsersNotInActiveRole).subscribe(u => {
      this.usersNotInCurrentRole = u;
    });

    this.currentRoleSubscription = this.store.select(fromUserRoleViewReducer.getCurrentUserRole).subscribe(ur => {
      this.currentRole = ur;
    });

    this.saveButtonTextSubscription = this.store.select(fromUserRoleViewReducer.getUsersTabSaveButtonText).subscribe(s => {
      this.saveButtonText = s;
    });
  }

  ngOnDestroy() {
    this.usersInActiveRoleSubscription.unsubscribe();
    this.usersNotInActiveRoleSubscription.unsubscribe();
    this.currentRoleSubscription.unsubscribe();
    this.saveButtonTextSubscription.unsubscribe();
  }

  updateSearchFilter(term: string): void {
    this.searchTerm = term.toLowerCase();
    this.store.dispatch(new fromUserRoleUserTabActions.FilterUsersCollection(this.searchTerm));
  }

  addUserToRole(userToBeAdded: UserAndRoleModel): void {
    this.store.dispatch(new fromUserRoleUserTabActions.AddUserToRole(userToBeAdded));
  }

  cancelChanges(): void {
    this.store.dispatch(new fromUserRoleUserTabActions.CancelChanges());
  }

  saveChanges(): void {
    const userIdsToSave = this.usersInSelectedRole.filter(u => {
      return u.Dirty;
    }).map(u => u.UserId);

    const payload: any = {
      userIds: userIdsToSave,
      roleId: this.currentRole.DerivedId,
      roleType: this.currentRole.RoleType
    };

    this.store.dispatch(new fromUserRoleUserTabActions.SaveChanges(payload));
  }
}
