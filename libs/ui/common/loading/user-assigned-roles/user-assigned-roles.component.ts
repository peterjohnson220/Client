import { Component, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as fromUserAssignedRoleActions from 'libs/state/app-context/actions/user-assigned-roles.actions';
import * as fromRootState from 'libs/state/state';

import {UserAssignedRole} from '../../../../models';

@Component({
  selector: 'pf-loading-user-assigned-roles',
  templateUrl: './user-assigned-roles.component.html'
})

export class UserAssignedRolesComponent implements OnInit {
  gettingUserAssignedRoles$: Observable<boolean>;
  userAssignedRoles$: Observable<UserAssignedRole[]>;

  constructor(
    private store: Store<fromRootState.State>
  ) {
    this.gettingUserAssignedRoles$ = store.select(fromRootState.getUserAssignedRolesLoading);
    this.userAssignedRoles$ = store.select(fromRootState.getUserAssignedRoles);
  }
  ngOnInit() {
    this.store.dispatch(new fromUserAssignedRoleActions.GetUserAssignedRoles());
  }
}

