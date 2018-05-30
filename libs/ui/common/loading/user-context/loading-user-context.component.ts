import { Component, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/take';

import * as fromUserContextActions from 'libs/state/app-context/actions/user-context.actions';
import * as fromRootState from 'libs/state/state';

import { UserContext } from '../../../../models';

declare var initializePendo: any;

@Component({
  selector: 'pf-loading-user-context',
  templateUrl: './loading-user-context.component.html'
})
export class LoadingUserContextComponent implements OnInit {
  gettingUserContext$: Observable<boolean>;
  userContext$: Observable<UserContext>;

  constructor(
    private store: Store<fromRootState.State>
  ) {
    this.gettingUserContext$ = store.select(fromRootState.getGettingUserContext);
    this.userContext$ = store.select(fromRootState.getUserContext);
  }

  ngOnInit() {
    this.store.dispatch(new fromUserContextActions.GetUserContext());

    // TODO: this initialize pendo code should be moved to the app-wrapper component when the app wrappers are consolidated
    this.userContext$.take(1).subscribe(l => {
      if (typeof initializePendo !== 'undefined') {
        initializePendo(1);
      }
    });
  }
}
