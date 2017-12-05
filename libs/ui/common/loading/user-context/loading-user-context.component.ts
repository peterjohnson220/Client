import { Component, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import * as fromUserContextActions from 'libs/state/app-context/actions/user-context.actions';
import * as fromRootState from 'libs/state/state';

@Component({
  selector: 'pf-loading-user-context',
  templateUrl: './loading-user-context.component.html'
})
export class LoadingUserContextComponent implements OnInit {
  gettingUserContext$: Observable<boolean>;

  constructor(
    private store: Store<fromRootState.State>
  ) {
    this.gettingUserContext$ = store.select(fromRootState.getGettingUserContext);
  }

  ngOnInit() {
    this.store.dispatch(new fromUserContextActions.GetUserContext());
  }
}
