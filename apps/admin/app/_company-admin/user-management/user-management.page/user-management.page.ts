import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

import * as fromUserReducer from '../reducers';
import { Store } from '@ngrx/store';
import * as fromUserActions from '../actions/user-management.actions';
import { UserAssignedRole } from 'libs/models';
import { UserManagementDto } from 'libs/models/payfactors-api/user';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { UserContext } from 'libs/models';
import * as fromRootState from 'libs/state/state';
import { Permissions } from 'libs/constants';

@Component({
  selector: 'pf-user-management-page',
  templateUrl: './user-management.page.html',
  styleUrls: ['./user-management.page.scss']
})
export class UserManagementPageComponent implements OnInit {

  userId: number;
  companyId: number;
  permissions: string[];
  addUserFlag = false;

  loading$: Observable<boolean>;
  loaded$: Observable<boolean>;
  user$: Observable<UserManagementDto>;
  userRoles$: Observable<UserAssignedRole[]>;
  apiError$: Observable<string>;
  userContext$: Observable<UserContext>;

  constructor(public location: Location, public route: ActivatedRoute, private store: Store<fromUserReducer.State>) {
    this.userContext$ = store.select(fromRootState.getUserContext);
    this.loading$ = this.store.select(fromUserReducer.getUserStateLoading);
    this.loaded$ = this.store.select(fromUserReducer.getUserStateLoaded);
    this.apiError$ = this.store.select(fromUserReducer.getUserStateApiError);

    this.user$ = this.store.select(fromUserReducer.getUserStateUser);
    this.userRoles$ = this.store.select(fromUserReducer.getUserStateRoles);

  }

  ngOnInit() {
    this.userContext$.subscribe( uc => {
      this.permissions = uc.Permissions;
    });
    this.addUserFlag = this.permissions.indexOf(Permissions.ADD_USER) !== -1 ? true : false;
    this.userId = this.route.snapshot.params.userId;
    if (this.userId) {
      this.store.dispatch(new fromUserActions.LoadUser(this.userId));
    } else {
      this.store.dispatch(new fromUserActions.ResetUser());
    }

    this.companyId = this.route.snapshot.params.companyId;
    this.store.dispatch(new fromUserActions.LoadRoles(this.companyId));
  }

  save(user: UserManagementDto) {
    this.store.dispatch(new fromUserActions.SaveUser(user));
  }

  handleCancel() {
    this.location.back();
  }

  reloadPage() {
    window.location.reload();
  }

}
