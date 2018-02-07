import { Component, Input, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import * as fromRootState from '../../../../state/state';

import * as fromHeaderActions from '../../actions/header.actions';
import { UserContext, NavigationLink, HomePageLink } from '../../../../models';
import * as fromLayoutReducer from '../../reducers';

@Component({
  selector: 'pf-layout-wrapper',
  templateUrl: './layout-wrapper.html',
  styleUrls: ['./layout-wrapper.scss']
})
export class LayoutWrapperComponent implements OnInit {
  userContext$: Observable<UserContext>;
  displayRightSideBar$: Observable<boolean>;
  // Loading/Errors
  gettingHeaderDropdownNavigationLinks$: Observable<boolean>;
  gettingHeaderDropdownNavigationLinksError$: Observable<boolean>;
  headerDropdownNavigationLinks$: Observable<NavigationLink[]>;
  getGettingHomePageLink$: Observable<boolean>;
  getGettingHomePageLinkError$: Observable<boolean>;

  homePageLink$: Observable<HomePageLink>;

  @Input() displayRightSideBar: boolean;

  constructor(
    private store: Store<fromRootState.State>,
    private layoutStore: Store<fromLayoutReducer.LayoutWrapperState>

  ) {
    // Loading / Errors
    this.getGettingHomePageLink$ = this.layoutStore.select(fromLayoutReducer.getGettingHomePageLink);
    this.getGettingHomePageLinkError$ = this.layoutStore.select(fromLayoutReducer.getGettingHomePageLinkError);
    this.homePageLink$ = this.layoutStore.select(fromLayoutReducer.getHomePageLink);

    this.gettingHeaderDropdownNavigationLinks$ = layoutStore.select(fromLayoutReducer.getGettingHeaderDropdownNavigationLinks);
    this.gettingHeaderDropdownNavigationLinksError$ = layoutStore.select(fromLayoutReducer.getGettingHeaderDropdownNavigationLinksError);

    this.userContext$ = store.select(fromRootState.getUserContext);
    this.headerDropdownNavigationLinks$ = layoutStore.select(fromLayoutReducer.getHeaderDropdownNavigationLinks);
  }

  ngOnInit() {
    this.store.dispatch(new fromHeaderActions.GetHeaderDropdownNavigationLinks());
    this.userContext$.take(1).subscribe(i => {
      this.store.dispatch(new fromHeaderActions.GetHeaderUserHomePageLink({
        userId: i.UserId
      }));
    });
  }
}
