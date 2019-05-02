import {Component, OnDestroy} from '@angular/core';

import {Store} from '@ngrx/store';
import {Subscription} from 'rxjs';

import {UserAndRoleModel} from 'libs/models/security';

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
  currentRoleId: number;
  currentRoleIsSystemRole: boolean;
  searchTerm = '';
  saveButtonText = 'Save';
  usersInActiveRoleSubscription: Subscription;
  usersNotInActiveRoleSubscription: Subscription;
  currentRoleSubscription: Subscription;

  constructor(private store: Store<fromUserRoleViewReducer.State>) {
    this.usersInActiveRoleSubscription = this.store.select(fromUserRoleViewReducer.getUsersInActiveRole).subscribe(u => {
      this.usersInSelectedRole = u;
    });

    this.usersNotInActiveRoleSubscription = this.store.select(fromUserRoleViewReducer.getUsersNotInActiveRole).subscribe(u => {
      this.usersNotInCurrentRole = u;
    });

    this.currentRoleSubscription = this.store.select(fromUserRoleViewReducer.getCurrentUserRole).subscribe(ur => {
      if (ur) {
        this.currentRoleId = ur.RoleId;
        this.currentRoleIsSystemRole = ur.IsSystemRole;
      }
    });
  }

  ngOnDestroy() {
    this.usersInActiveRoleSubscription.unsubscribe();
    this.usersNotInActiveRoleSubscription.unsubscribe();
    this.currentRoleSubscription.unsubscribe();
  }

  updateSearchFilter(term: string): void {
    this.searchTerm = term.toLowerCase();
    this.store.dispatch(new fromUserRoleUserTabActions.FilterUsersCollection(this.searchTerm));
  }

  addUserToRole(userToBeAdded: UserAndRoleModel): void {
    this.store.dispatch(new fromUserRoleUserTabActions.AddUserToRole(userToBeAdded));
  }
}
