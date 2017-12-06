import { Component, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import * as fromRootState from 'libs/state/state';
import { UserContext, NavigationLink } from 'libs/models';

import * as fromHeaderActions from '../actions/header.actions';
import * as fromLayoutReducer from '../reducers';

@Component({
  selector: 'pf-layout-wrapper',
  templateUrl: './layout-wrapper.html',
  styleUrls: ['./layout-wrapper.scss']
})
export class LayoutWrapperComponent implements OnInit {
  userContext$: Observable<UserContext>;
  headerDropdownNaivgationLinks$: Observable<NavigationLink[]>;

  constructor(
    private store: Store<fromRootState.State>,
    private layoutStore: Store<fromLayoutReducer.State>
  ) {
    this.userContext$ = store.select(fromRootState.getUserContext);
    this.headerDropdownNaivgationLinks$ = layoutStore.select(fromLayoutReducer.getHeaderDropdownNavigationLinks);
  }

  ngOnInit() {
    this.store.dispatch(new fromHeaderActions.GetHeaderDropdownNavigationLinks());
  }
}
