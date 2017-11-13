import { Component, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import * as fromUserContextActions from '../../../app-state/app-context/actions/user-context.actions';
import * as fromAppState from '../../../app-state/app-state';

import * as fromHeaderActions from '../actions/header.actions';

@Component({
  selector: 'pf-layout-wrapper',
  templateUrl: './layout-wrapper.html',
  styleUrls: ['./layout-wrapper.scss']
})
export class LayoutWrapperComponent implements OnInit {
  gettingUserContext$: Observable<boolean>;
  gettingUserContextError$: Observable<boolean>;

  constructor(
    private store: Store<fromAppState.AppState>
  ) {
    this.gettingUserContext$ = store.select(fromAppState.getGettingUserContext);
    this.gettingUserContextError$ = store.select(fromAppState.getGettingUserContextError);
  }

  ngOnInit() {
    this.store.dispatch(new fromUserContextActions.GetUserContext());
    this.store.dispatch(new fromHeaderActions.GetHeaderDropdownNavigationLinks());
  }
}
