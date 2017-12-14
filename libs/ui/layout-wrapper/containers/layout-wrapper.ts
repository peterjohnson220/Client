import { Component, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import * as fromRootState from '../../../state/state';

import * as fromHeaderActions from '../actions/header.actions';
import * as fromLeftSidebarActions from '../actions/left-sidebar.actions';
import { UserContext, NavigationLink } from '../../../models';
import * as fromLayoutReducer from '../reducers';
import { SidebarLink } from '../../../models/navigation/sidebar-link.model';

@Component({
  selector: 'pf-layout-wrapper',
  templateUrl: './layout-wrapper.html',
  styleUrls: ['./layout-wrapper.scss']
})
export class LayoutWrapperComponent implements OnInit {
  // Loading/Errors
  gettingHeaderDropdownNavigationLinks$: Observable<boolean>;
  gettingHeaderDropdownNavigationLinksError$: Observable<boolean>;

  userContext$: Observable<UserContext>;
  headerDropdownNavigationLinks$: Observable<NavigationLink[]>;
  leftSidebarNavigationLinks$: Observable<SidebarLink[]>;

  constructor(
    private store: Store<fromRootState.State>,
    private layoutStore: Store<fromLayoutReducer.LayoutWrapperState>
  ) {
    // Loading / Errors
    this.gettingHeaderDropdownNavigationLinks$ = layoutStore.select(fromLayoutReducer.getGettingHeaderDropdownNavigationLinks);
    this.gettingHeaderDropdownNavigationLinksError$ = layoutStore.select(fromLayoutReducer.getGettingHeaderDropdownNavigationLinksError);

    this.userContext$ = store.select(fromRootState.getUserContext);
    this.headerDropdownNavigationLinks$ = layoutStore.select(fromLayoutReducer.getHeaderDropdownNavigationLinks);
    this.leftSidebarNavigationLinks$ = layoutStore.select(fromLayoutReducer.getLeftSidebarNavigationLinks);
  }

  ngOnInit() {
    this.store.dispatch(new fromHeaderActions.GetHeaderDropdownNavigationLinks());
    this.store.dispatch(new fromLeftSidebarActions.GetLeftSidebarNavigationLinks());
  }
}
