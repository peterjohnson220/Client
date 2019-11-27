import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

import { UserContext } from 'libs/models/security';
import * as fromUserContextReducer from 'libs/state/app-context/reducers/user-context.reducer';
import * as fromRootState from 'libs/state/state';

@Component({
  selector: 'pf-public-view-header',
  templateUrl: './public-view-header.component.html'
})

export class PublicViewHeaderComponent {
  public identity$: Observable<UserContext>;

  constructor(
    private store: Store<fromUserContextReducer.State>) {
    this.identity$ = this.store.select(fromRootState.getUserContext);
  }
}
