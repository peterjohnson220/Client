import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

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
  currentYear: number;

  // Loading/Errors
  gettingHeaderDropdownNavigationLinks$: Observable<boolean>;
  gettingHeaderDropdownNavigationLinksError$: Observable<boolean>;
  headerDropdownNavigationLinks$: Observable<NavigationLink[]>;
  getGettingHomePageLink$: Observable<boolean>;
  getGettingHomePageLinkError$: Observable<boolean>;
  homePageLink$: Observable<HomePageLink>;

  @Input() displayRightSideBar: boolean;
  @Input() rightSideBarFontAwesomeOpenIcon = 'fa-plus';
  @Input() rightSidebarShouldBeOpen = false;
  @Output() onRightSidebarToggle = new EventEmitter<boolean>();
  @Input() centerContentScroll: boolean;

  constructor(
    private store: Store<fromRootState.State>,
    private layoutStore: Store<fromLayoutReducer.LayoutWrapperState>
  ) {
    this.userContext$ = store.select(fromRootState.getUserContext);
    this.currentYear = new Date().getFullYear();
    // Loading / Errors
    this.getGettingHomePageLink$ = this.layoutStore.select(fromLayoutReducer.getGettingHomePageLink);
    this.getGettingHomePageLinkError$ = this.layoutStore.select(fromLayoutReducer.getGettingHomePageLinkError);
    this.homePageLink$ = this.layoutStore.select(fromLayoutReducer.getHomePageLink);

    // Header links
    this.gettingHeaderDropdownNavigationLinks$ = layoutStore.select(fromLayoutReducer.getGettingHeaderDropdownNavigationLinks);
    this.gettingHeaderDropdownNavigationLinksError$ = layoutStore.select(fromLayoutReducer.getGettingHeaderDropdownNavigationLinksError);
    this.headerDropdownNavigationLinks$ = layoutStore.select(fromLayoutReducer.getHeaderDropdownNavigationLinks);
  }

  ngOnInit() {
    this.userContext$.subscribe(userContext => {
      this.store.dispatch(new fromHeaderActions.GetHeaderUserHomePageLink({
        userId: userContext.UserId
      }));
    });
    this.store.dispatch(new fromHeaderActions.GetHeaderDropdownNavigationLinks());
  }

  rightSidebarToggle(isOpen: boolean) {
    this.onRightSidebarToggle.emit(isOpen);
  }
}
