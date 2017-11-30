import { Component, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import * as fromRootState from '../../../state/state';
import { environment } from 'environments/environment';

import * as fromHeaderActions from '../actions/header.actions';
import { UserContext, NavigationLink } from '../../../models';
import * as fromLayoutReducer from '../reducers';

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
  headerDropdownNaivgationLinks$: Observable<NavigationLink[]>;

  avatarSource: string = environment.avatarSource;
  pageContainerBackgroundImage = `url('./assets/images/Elegant_Background-8.jpg')`;
  companyLogoSource: string = environment.companyLogoSource;

  constructor(
    private store: Store<fromRootState.State>,
    private layoutStore: Store<fromLayoutReducer.LayoutWrapperState>
  ) {
    // Loading / Errors
    this.gettingHeaderDropdownNavigationLinks$ = layoutStore.select(fromLayoutReducer.getGettingHeaderDropdownNavigationLinks);
    this.gettingHeaderDropdownNavigationLinksError$ = layoutStore.select(fromLayoutReducer.getGettingHeaderDropdownNavigationLinksError);

    this.userContext$ = store.select(fromRootState.getUserContext);
    this.headerDropdownNaivgationLinks$ = layoutStore.select(fromLayoutReducer.getHeaderDropdownNavigationLinks);
  }

  ngOnInit() {
    this.store.dispatch(new fromHeaderActions.GetHeaderDropdownNavigationLinks());
  }
}
