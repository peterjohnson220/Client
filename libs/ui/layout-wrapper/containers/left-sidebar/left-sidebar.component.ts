import { Component, OnInit, OnDestroy, EventEmitter, Input, Output } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { UserContext, SidebarLink } from 'libs/models';
import { AppConstants } from 'libs/constants';

import * as fromRootState from '../../../../state/state';
import * as fromLeftSidebarActions from '../../actions/left-sidebar.actions';
import * as fromLayoutReducer from '../../reducers';

@Component({
  selector: 'pf-layout-wrapper-left-sidebar',
  templateUrl: './left-sidebar.component.html',
  styleUrls: ['./left-sidebar.component.scss']
})
export class LeftSidebarComponent implements OnInit, OnDestroy {
  @Input() leftSidebarToggle = false;
  @Output() reload = new EventEmitter();

  clientAppRoot = '/' + AppConstants.HostPath + '/';
  leftSidebarNavigationLinks$: Observable<SidebarLink[]>;
  userContext$: Observable<UserContext>;
  userContextSubscription: Subscription;
  userId: number;
  companyName: string;

  constructor(
    private store: Store<fromRootState.State>,
    private layoutStore: Store<fromLayoutReducer.LayoutWrapperState>
  ) {
    this.leftSidebarNavigationLinks$ = layoutStore.select(fromLayoutReducer.getLeftSidebarNavigationLinks);
    this.userContext$ = store.select(fromRootState.getUserContext);
  }

  ngOnInit() {
    if (localStorage.getItem('leftSideBarToggleStatus')) {
      this.leftSidebarToggle = localStorage.getItem('leftSideBarToggleStatus') === 'true';
    } else {
      localStorage.setItem('leftSideBarToggleStatus', 'false');
      this.leftSidebarToggle = false;
    }
    this.userContextSubscription = this.userContext$.subscribe(userContext => {
        this.userId = userContext.UserId;
        this.companyName = userContext.CompanyName;
        if (!userContext.IsPublic && !userContext.WorkflowStepInfo) {
          this.store.dispatch(new fromLeftSidebarActions.GetLeftSidebarNavigationLinks());
        }
      }
    );
    this.dispatchToggleLeftSideBarAction();
  }

  ngOnDestroy() {
    if (this.userContextSubscription) {
      this.userContextSubscription.unsubscribe();
    }
  }

  getSidebarHref(sidebarLink: SidebarLink) {
    if (sidebarLink.Name === 'Job Descriptions') {
      return this.clientAppRoot + sidebarLink.Url;
    }

    return sidebarLink.Url;
  }

  handleSidebarNavigationLinksReload() {
    this.store.dispatch(new fromLeftSidebarActions.GetLeftSidebarNavigationLinks());
  }

  checkSidebarLinkAgainstURL(link) {

    if (window.location.pathname.indexOf(link.Url) > -1 && window.location.pathname.indexOf('client/dashboard/resources') < 0) {
      return true;
    }

    // TODO: check to see if there is a better way to handle highlighting left sidebar links
    if (window.location.pathname.indexOf('client/peer') > -1 && link.Url.indexOf('client/peer') > -1) {
      return true;
    }

    if (window.location.pathname.indexOf('client/dashboard/resources') > -1 && link.Url.indexOf('client/dashboard/resources') > -1) {
      return true;
    }
  }

  toggle() {
    this.leftSidebarToggle = !this.leftSidebarToggle;
    if (this.leftSidebarToggle) {
      localStorage.setItem('leftSideBarToggleStatus', 'true');
    } else {
      localStorage.setItem('leftSideBarToggleStatus', 'false');
    }
    this.dispatchToggleLeftSideBarAction();
  }

  private dispatchToggleLeftSideBarAction(): void {
    this.store.dispatch(new fromLeftSidebarActions.ToggleLeftSidebar(this.leftSidebarToggle));
  }
}
