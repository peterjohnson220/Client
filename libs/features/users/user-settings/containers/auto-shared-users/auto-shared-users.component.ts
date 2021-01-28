import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import * as fromUserSettingsMainReducer from '../../reducers';
import * as fromAutoShareActions from '../../actions/auto-share.actions';
import { AutoShareUser } from '../../../../../models/user-settings';

@Component({
  selector: 'pf-auto-shared-users',
  templateUrl: './auto-shared-users.component.html',
  styleUrls: ['./auto-shared-users.component.scss']
})
export class AutoSharedUsersComponent implements OnInit {
  selectedUsers$: Observable<AutoShareUser[]>;

  constructor(
    private store: Store<fromUserSettingsMainReducer.State>
  ) {
    this.selectedUsers$ = this.store.select(fromUserSettingsMainReducer.getSelectedUsers);
  }

  ngOnInit(): void {
    this.store.dispatch(new fromAutoShareActions.GetShareableUsers());
  }

  removeSharedUser(userIdToDelete: number) {
    this.store.dispatch(new fromAutoShareActions.RemoveAutoSharedUser(userIdToDelete));
  }

  trackByFn(index: any, user: AutoShareUser) {
    return user.UserId;
  }

}
