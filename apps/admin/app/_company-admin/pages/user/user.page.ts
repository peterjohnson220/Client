import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import * as fromUserReducer from '../../reducers';
import { Store } from '@ngrx/store';
import * as fromUserActions from '../../actions/user.actions';
import { UserAssignedRole } from 'libs/models';
import { UserManagementDto } from 'libs/models/payfactors-api/user';

@Component({
  selector: 'pf-user-page',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss']
})
export class UserPageComponent {

  loading$: Observable<boolean>;
  loaded$: Observable<boolean>;
  user$: Observable<UserManagementDto>;
  userRoles$: Observable<UserAssignedRole[]>;
  apiError$: Observable<string>;

  userId: number;
  companyId: number;

  constructor(public route: ActivatedRoute, private store: Store<fromUserReducer.State>) {

    this.companyId = route.snapshot.params.companyId;
    this.store.dispatch(new fromUserActions.LoadRoles(this.companyId));

    this.userId = route.snapshot.params.userId;
    if (this.userId) {
      this.store.dispatch(new fromUserActions.LoadUser(this.userId));
    } else {
      this.store.dispatch(new fromUserActions.ResetUser());
    }

    this.loading$ = this.store.select(fromUserReducer.getUserStateLoading);
    this.loaded$ = this.store.select(fromUserReducer.getUserStateLoaded);
    this.apiError$ = this.store.select(fromUserReducer.getUserStateApiError);

    this.user$ = this.store.select(fromUserReducer.getUserStateUser);
    this.userRoles$ = this.store.select(fromUserReducer.getUserStateRoles);
  }

  save(user: UserManagementDto) {
    this.store.dispatch(new fromUserActions.SaveUser(user));
  }

  reloadPage() {
    window.location.reload();
  }

}
