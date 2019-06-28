import {Component, OnDestroy} from '@angular/core';

import {Store} from '@ngrx/store';
import {Observable} from 'rxjs';

import {UserAndRoleModel, UserAssignedRole} from 'libs/models/security';

import * as fromUserRoleViewReducer from '../../reducers';
import * as fromUserRoleUserTabActions from '../../actions/user-role-users-tab.action';


@Component({
  selector: 'pf-user-role-users-tab',
  templateUrl: './user-role-users-tab.component.html',
  styleUrls: ['user-role-users-tab.component.scss']
})
export class UserRoleUsersTabComponent implements OnDestroy {
  searchTerm = '';
  usersInRole$: Observable<UserAndRoleModel[]>;
  usersNotInRole$: Observable<UserAndRoleModel[]>;
  currentRole$: Observable<UserAssignedRole>;

  constructor(private store: Store<fromUserRoleViewReducer.State>) {
    this.usersInRole$ = this.store.select(fromUserRoleViewReducer.getUsersInActiveRole);
    this.usersNotInRole$ = this.store.select(fromUserRoleViewReducer.getUsersNotInActiveRole);
    this.currentRole$ = this.store.select(fromUserRoleViewReducer.getCurrentUserRole);
  }

  ngOnDestroy() {
    this.updateSearchFilter('');
  }

  updateSearchFilter(term: string): void {
    this.searchTerm = term.toLowerCase();
    this.store.dispatch(new fromUserRoleUserTabActions.FilterUsersCollection(this.searchTerm));
  }

  addUserToRole(userToBeAdded: UserAndRoleModel): void {
    this.store.dispatch(new fromUserRoleUserTabActions.AddUserToRole(userToBeAdded));
  }
}
