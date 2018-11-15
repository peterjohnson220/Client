import { Component, OnDestroy } from '@angular/core';

import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { UserRoleTabState } from '../../constants/user-role.constants';
import * as fromUserRoleViewReducer from '../../reducers';
import { UserRoleService } from '../../services';

@Component({
  selector: 'pf-user-role-page',
  templateUrl: './user-role.page.html',
  styleUrls: ['user-role.page.scss']
})
export class UserRolePageComponent implements OnDestroy {
  currentUserRoleTabState: UserRoleTabState = UserRoleTabState.FUNCTION;
  _UserRoleTabState: typeof UserRoleTabState = UserRoleTabState;
  currentTabStateSubscription: Subscription;

  constructor(private userRoleService: UserRoleService, private store: Store<fromUserRoleViewReducer.State>) {
    this.currentTabStateSubscription = this.store.select(fromUserRoleViewReducer.getUserRoleCurrentTabState).subscribe(tabState => {
      this.currentUserRoleTabState = tabState;
    });
  }

  handleRolesClick(userRoleViewTabState: UserRoleTabState) {
    this.userRoleService.updateCurrentUserRoleViewTabState(userRoleViewTabState);
  }

  ngOnDestroy() {
    this.currentTabStateSubscription.unsubscribe();
  }
}
