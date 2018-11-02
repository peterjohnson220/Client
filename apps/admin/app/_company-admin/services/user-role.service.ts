import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromUserRoleViewReducer from '../reducers';
import * as fromUserRoleViewActions from '../actions';
import { UserRoleTabState } from '../constants/user-role.constants';

@Injectable()
export class UserRoleService {
  constructor(private store: Store<fromUserRoleViewReducer.State>) { }

  updateCurrentUserRoleViewTabState(userRoleViewTabState: UserRoleTabState) {
    this.store.dispatch(new fromUserRoleViewActions.UpdateUserRoleTabState(userRoleViewTabState));
  }
}
