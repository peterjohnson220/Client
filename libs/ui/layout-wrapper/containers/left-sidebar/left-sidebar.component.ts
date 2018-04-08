import { Component, OnInit, OnDestroy, EventEmitter, Output } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { UserContext } from 'libs/models';

import { environment } from 'environments/environment';

import * as fromRootState from '../../../../state/state';
import * as fromLeftSidebarActions from '../../actions/left-sidebar.actions';
import { SidebarLink } from 'libs/models';
import * as fromLayoutReducer from '../../reducers';
import { userVoiceUrl } from 'libs/core/functions';

@Component({
  selector: 'pf-layout-wrapper-left-sidebar',
  templateUrl: './left-sidebar.component.html',
  styleUrls: [ './left-sidebar.component.scss' ]
})
export class LeftSidebarComponent implements OnInit, OnDestroy {
  @Output() reload = new EventEmitter();

  leftSidebarToggle = false;
  ngAppRoot = environment.ngAppRoot;
  leftSidebarNavigationLinks$: Observable<SidebarLink[]>;
  gettingSidebarNavigationLinks$: Observable<boolean>;
  gettingSidebarNavigationLinksError$: Observable<boolean>;
  userContext$: Observable<UserContext>;
  userContextSubscription: Subscription;
  userId: number;
  companyName: string;

  constructor(
    private store: Store<fromRootState.State>,
    private layoutStore: Store<fromLayoutReducer.LayoutWrapperState>
  ) {
    this.leftSidebarNavigationLinks$ = layoutStore.select(fromLayoutReducer.getLeftSidebarNavigationLinks);
    this.gettingSidebarNavigationLinksError$ = layoutStore.select(fromLayoutReducer.getGettingLeftSidebarNavigationLinksError);
    this.gettingSidebarNavigationLinks$ = layoutStore.select(fromLayoutReducer.getGettingLeftSidebarNavigationLinks);
    this.userContext$ = store.select(fromRootState.getUserContext);
  }

  ngOnInit() {
    this.store.dispatch(new fromLeftSidebarActions.GetLeftSidebarNavigationLinks());
    this.userContextSubscription = this.userContext$.subscribe(userContext => {
        this.userId = userContext.UserId;
        this.companyName = userContext.CompanyName;
      }
    );
  }

  ngOnDestroy() {
    this.userContextSubscription.unsubscribe();
  }

  getSidebarHref(sidebarLink: SidebarLink) {
    if (sidebarLink.Name === 'Ideas') {
      return userVoiceUrl(sidebarLink.Url, this.userId);
    }
    return sidebarLink.NgAppLink ? this.ngAppRoot + sidebarLink.Url : sidebarLink.Url;
  }

  handleSidebarNavigationLinksReload() {
    this.store.dispatch(new fromLeftSidebarActions.GetLeftSidebarNavigationLinks());
  }
}
