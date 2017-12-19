import { Component, OnInit, EventEmitter, Output } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { environment } from 'environments/environment';

import * as fromRootState from '../../../../state/state';
import * as fromLeftSidebarActions from '../../actions/left-sidebar.actions';
import { SidebarLink } from 'libs/models';
import * as fromLayoutReducer from '../../reducers';

@Component({
  selector: 'pf-layout-wrapper-left-sidebar',
  templateUrl: './left-sidebar.component.html',
  styleUrls: [ './left-sidebar.component.scss' ]
})
export class LeftSidebarComponent implements OnInit {
  @Output() reload = new EventEmitter();

  leftSidebarToggle = false;
  ngAppRoot = environment.ngAppRoot;
  leftSidebarNavigationLinks$: Observable<SidebarLink[]>;
  gettingSidebarNavigationLinks$: Observable<boolean>;
  gettingSidebarNavigationLinksError$: Observable<boolean>;

  constructor(
    private store: Store<fromRootState.State>,
    private layoutStore: Store<fromLayoutReducer.LayoutWrapperState>
  ) {
    this.leftSidebarNavigationLinks$ = layoutStore.select(fromLayoutReducer.getLeftSidebarNavigationLinks);
    this.gettingSidebarNavigationLinksError$ = layoutStore.select(fromLayoutReducer.getGettingLeftSidebarNavigationLinksError);
    this.gettingSidebarNavigationLinks$ = layoutStore.select(fromLayoutReducer.getGettingLeftSidebarNavigationLinks);
  }

  ngOnInit() {
    this.store.dispatch(new fromLeftSidebarActions.GetLeftSidebarNavigationLinks());
  }

  getSidebarHref(sidebarLink: SidebarLink) {
    return sidebarLink.NgAppLink ? this.ngAppRoot + sidebarLink.Url : sidebarLink.Url;
  }

  handleSidebarNavigationLinksReload() {
    this.store.dispatch(new fromLeftSidebarActions.GetLeftSidebarNavigationLinks());
  }
}
