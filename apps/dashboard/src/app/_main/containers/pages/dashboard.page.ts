import { Component } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';
import { UserContext } from 'libs/models';

import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'pf-dashboard-page',
  templateUrl: './dashboard.page.html',
  styleUrls: [ './dashboard.page.scss' ]
})
export class DashboardPageComponent {
  userContext$: Observable<UserContext>;

  constructor(private store: Store<fromRootState.State>) {
    this.userContext$ = store.select(fromRootState.getUserContext);
  }
}
