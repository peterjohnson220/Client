import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable, Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import * as fromRootState from '../../../../state/state';
import * as fromHeaderActions from '../../actions/header.actions';
import { UserContext, NavigationLink, HomePageLink } from '../../../../models';
import * as fromLayoutReducer from '../../reducers';

@Component({
  selector: 'pf-layout-wrapper',
  templateUrl: './layout-wrapper.html',
  styleUrls: [ './layout-wrapper.scss' ]
})
export class LayoutWrapperComponent implements OnInit, OnDestroy {
  userContext$: Observable<UserContext>;
  currentYear: number;

  // Loading/Errors
  gettingHeaderDropdownNavigationLinks$: Observable<boolean>;
  gettingHeaderDropdownNavigationLinksError$: Observable<boolean>;
  headerDropdownNavigationLinks$: Observable<NavigationLink[]>;
  getGettingHomePageLink$: Observable<boolean>;
  getGettingHomePageLinkError$: Observable<boolean>;
  homePageLink$: Observable<HomePageLink>;

  userContextSubscription: Subscription;

  @Input() displayRightSideBar: boolean;
  @Input() rightSideBarFontAwesomeOpenIcon = 'fa-plus';
  @Input() rightSidebarShouldBeOpen = false;
  @Output() onRightSidebarToggle = new EventEmitter<boolean>();
  @Input() centerContentScroll: boolean;
  leftSidebarToggle: boolean;
  leftSidebarToggleChangedSubject: Subject<boolean> = new Subject<boolean>();

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

    this.leftSidebarToggleChangedSubject.pipe(debounceTime(400), distinctUntilChanged()).subscribe(value => {
        this.leftSidebarToggle = value;
        this.updateUserVoicePosition(value);
      });
  }

  ngOnInit() {
    this.userContextSubscription = this.userContext$.subscribe(userContext => {
      this.store.dispatch(new fromHeaderActions.GetHeaderUserHomePageLink({
        userId: userContext.UserId
      }));
      if (!userContext.IsPublic && !userContext.WorkflowStepInfo) {
        this.store.dispatch(new fromHeaderActions.GetHeaderDropdownNavigationLinks());
      }
    });
  }

  ngOnDestroy(): void {
    if (this.userContextSubscription) {
      this.userContextSubscription.unsubscribe();
    }
  }

  rightSidebarToggle(isOpen: boolean) {
    this.onRightSidebarToggle.emit(isOpen);
  }

  leftSidebarToggleChanged(value: boolean) {
    this.leftSidebarToggleChangedSubject.next(value);
  }

  updateUserVoicePosition(expanded: boolean) {
    const userVoiceIcon = <HTMLElement>document.getElementsByClassName('uv-icon')[0];
    if (!userVoiceIcon) {
      return;
    }
    if (expanded) {
      userVoiceIcon.classList.remove('uv-bottom-left');
      userVoiceIcon.classList.add('uv-bottom-left-expanded');
    } else {
      userVoiceIcon.classList.remove('uv-bottom-left-expanded');
      userVoiceIcon.classList.add('uv-bottom-left');
    }
  }
}
