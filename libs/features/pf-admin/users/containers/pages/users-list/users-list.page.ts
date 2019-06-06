import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import * as fromUsersListActions from '../../../actions/users-list.actions';
import * as fromUsersListReducer from '../../../reducers';
import { UserGridItem } from '../../../models';
import * as fromUsersActions from '../../../actions/users-list.actions';


@Component({
  selector: 'pf-users-list-page',
  templateUrl: './users-list.page.html',
  styleUrls: ['./users-list.page.scss']
})
export class UsersListPageComponent implements OnInit {
  @Input() companyId: number;
  @Input() addUrl: string;
  @Input() returnUrl: string;
  @Input() parentRoute: string;

  companyName$: Observable<string>;
  users$: Observable<UserGridItem[]>;
  usersLoading$: Observable<boolean>;
  usersLoadingError$: Observable<boolean>;
  searchTerm$: Observable<string>;

  constructor(private store: Store<fromUsersListReducer.UserManagementState>,
              private router: Router) {}

  ngOnInit() {
    this.users$ = this.store.pipe(select(fromUsersListReducer.getUsers));
    this.usersLoading$ = this.store.pipe(select(fromUsersListReducer.getUsersLoading));
    this.usersLoadingError$ = this.store.pipe(select(fromUsersListReducer.getUsersLoadingError));
    this.companyName$ = this.store.pipe(select(fromUsersListReducer.getCompany));
    this.searchTerm$ =  this.store.pipe(select(fromUsersListReducer.getUserSearchTerm));
    if (this.companyId > 0) {
      this.store.dispatch(new fromUsersListActions.LoadCompany(this.companyId));
      this.store.dispatch(new fromUsersListActions.LoadUsers(this.companyId));

    }
  }

  updateSearchTerm(newSearchTerm: string) {
    this.store.dispatch( new fromUsersActions.UpdateUserSearchTerm(newSearchTerm));
  }

  handleAddButton() {
    this.router.navigate([this.parentRoute, this.companyId, 'users', 'add']);
  }
}


