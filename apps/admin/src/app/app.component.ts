import { Component, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';

import * as fromUserContextActions from '../../../../libs/state/app-context/actions/user-context.actions';
import * as fromAppState from '../../../../libs/state/state';

@Component({
  selector: 'pf-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(
    private store: Store<fromAppState.AppState>
  ) {}

  ngOnInit() {
    this.store.dispatch(new fromUserContextActions.GetUserContext());
  }
}
