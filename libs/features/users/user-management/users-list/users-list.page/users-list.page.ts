import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import * as fromRootState from 'libs/state/state';
import * as fromUsersListActions from '../actions/users-list.actions';
import * as fromUsersListReducer from '../reducers';

import { UserGridItem } from '../models';
import { UserContext } from 'libs/models';
import { Permissions } from 'libs/constants';

@Component({
  selector: 'pf-users-list-page',
  templateUrl: './users-list.page.html',
  styleUrls: ['./users-list.page.scss']
})
export class UsersListPageComponent implements OnInit {
  companyId: number;
  _Permissions = null;
  returnUrl: string;

  companyName$: Observable<string>;
  users$: Observable<UserGridItem[]>;
  usersLoading$: Observable<boolean>;
  usersLoadingError$: Observable<boolean>;
  searchTerm$: Observable<string>;
  userContext$: Observable<UserContext>;

  constructor(
    private store: Store<fromUsersListReducer.State>,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.users$ = this.store.pipe(select(fromUsersListReducer.getUsers));
    this.usersLoading$ = this.store.pipe(select(fromUsersListReducer.getUsersLoading));
    this.usersLoadingError$ = this.store.pipe(select(fromUsersListReducer.getUsersLoadingError));
    this.companyName$ = this.store.pipe(select(fromUsersListReducer.getCompany));
    this.searchTerm$ = this.store.pipe(select(fromUsersListReducer.getUserSearchTerm));

    this.userContext$ = this.store.pipe(select(fromRootState.getUserContext));
    this._Permissions = Permissions;
    this.returnUrl = this.route.snapshot.data.ReturnUrl;
  }

  ngOnInit() {
    this.companyId = this.route.snapshot.params.companyId;
    if (this.companyId) {
      this.store.dispatch(new fromUsersListActions.LoadCompany(this.companyId));
      this.store.dispatch(new fromUsersListActions.LoadUsers(this.companyId));
    }
  }

  updateSearchTerm(newSearchTerm: string) {
    this.store.dispatch(new fromUsersListActions.UpdateUserSearchTerm(newSearchTerm));
  }

  handleAddButton() {
    this.router.navigate(['add'], { relativeTo: this.route });
  }
}
