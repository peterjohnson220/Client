import { Component, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';

import * as fromUserContextActions from '../../../../libs/state/app-context/actions/user-context.actions';
import * as fromAppState from '../../../../libs/state/state';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'pf-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  gettingUserContext$: Observable<boolean>;

  constructor(
    private store: Store<fromAppState.AppState>
  ) {
    this.gettingUserContext$ = store.select(fromAppState.getGettingUserContext);
  }

  ngOnInit() {
    this.store.dispatch(new fromUserContextActions.GetUserContext());
  }
}
