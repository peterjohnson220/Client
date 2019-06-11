import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';

import { Observable, Subscription } from 'rxjs';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';

import * as fromCommunitySearchActions from '../../actions/community-search.actions';
import * as fromCommunitySearchReducer from '../../reducers';

import { CommunityPost } from 'libs/models/community';

import { ScrollDirectionEnum } from '../../models/scroll-direction.enum';
import { CommunitySearchResultTypeEnum } from 'libs/models/community/community-constants.model';

@Component({
  selector: 'pf-community-search-results',
  templateUrl: './community-search-results.component.html',
  styleUrls: [ './community-search-results.component.scss' ]
})
export class CommunitySearchResultsComponent implements OnInit, OnDestroy {
  @ViewChild('SearchResults', { static: true }) public searchResultsScrollContainer: ElementRef;
  @ViewChild(InfiniteScrollDirective, { static: true }) infiniteScroll: InfiniteScrollDirective;

  loadingSearchResults$: Observable<boolean>;
  loadingSearchResultsError$: Observable<boolean>;
  loadingMoreSearchResults$: Observable<boolean>;
  communitySearchResults$: Observable<CommunityPost[]>;
  hasMoreSearchResultsOnServer$: Observable<boolean>;
  hasMoreSearchResultsOnServerSubscription: Subscription;
  loadingMoreSearchResultsSubscription: Subscription;
  query: string;
  hasMoreResultsOnServer: boolean;
  loadingMoreSearchResults: boolean;
  isNavigationVisible = false;
  scrollTimerId: number;
  scrollerTimeout = 1000;
  sendBackToTop = false;
  scrollDirection = ScrollDirectionEnum.Down;
  currentScrollTop: number;
  lastScrollTop = 0;

  pollType = CommunitySearchResultTypeEnum.Poll;
  discussionType = CommunitySearchResultTypeEnum.Discussion;
  discussionReplyType = CommunitySearchResultTypeEnum.Reply;
  podcastType = CommunitySearchResultTypeEnum.Podcast;

  constructor(public store: Store<fromCommunitySearchReducer.State>) {

    this.loadingSearchResults$ = this.store.select(fromCommunitySearchReducer.getLoadingSearchResults);
    this.loadingSearchResultsError$ = this.store.select(fromCommunitySearchReducer.getLoadingSearchResultsError);
    this.loadingMoreSearchResults$ = this.store.select(fromCommunitySearchReducer.getCommunityLoadingMoreSearchResults);
    this.communitySearchResults$ = this.store.select(fromCommunitySearchReducer.getCommunitySearchResults);
    this.hasMoreSearchResultsOnServer$ = this.store.select(fromCommunitySearchReducer.getHasMoreSearchResultsOnServer);
  }

  ngOnInit() {
  this.hasMoreSearchResultsOnServerSubscription = this.hasMoreSearchResultsOnServer$.subscribe(result =>
    this.hasMoreResultsOnServer = result);

  this.loadingMoreSearchResultsSubscription = this.loadingMoreSearchResults$.subscribe(result =>
  this.loadingMoreSearchResults = result);
  }

  ngOnDestroy() {
    if (this.hasMoreSearchResultsOnServerSubscription) {
      this.hasMoreSearchResultsOnServerSubscription.unsubscribe();
    }

    if (this.loadingMoreSearchResultsSubscription) {
      this.loadingMoreSearchResultsSubscription.unsubscribe();
    }
  }

  executeSearch(query) {
    this.query = query;
    this.store.dispatch(new fromCommunitySearchActions.SearchingCommunity(query));

    this.scrollToTop();
  }
  scrollToTop() {
    try {
      this.searchResultsScrollContainer.nativeElement.scrollTop = 0;
    } catch (err) { }
  }

  openDetailsModal(result) {
      this.store.dispatch(new fromCommunitySearchActions.OpenSearchResultModal(result.Details.CommunityPostId));
  }

  trackByFn(index, item) {
    return item.Id;
  }

  onScrollDown() {
    if (this.query.length > 0 && this.hasMoreResultsOnServer && !this.loadingMoreSearchResults) {
      this.store.dispatch(new fromCommunitySearchActions.GettingMoreCommunitySearchResults(this.query));
    }
  }

  setTimer() {
    if (this.scrollTimerId !== undefined) {
      this.clearTimeout();
    }
    this.setScrollTimer();
  }

  clearTimeout() {
    clearTimeout(this.scrollTimerId);
  }

  setScrollTimer() {
    this.scrollTimerId = window.setTimeout(() => {
      this.isNavigationVisible = true;
    }, this.scrollerTimeout);
  }

  onScroll(event: any) {
    this.setScrollDirection(event);

    if (this.scrollDirection === ScrollDirectionEnum.Up) {
      if (!this.sendBackToTop) {
        this.isNavigationVisible = true;
      } else {
        this.sendBackToTop = false;
      }
    } else {
      this.setTimer();
    }
  }
  setScrollDirection(event: any) {
    this.currentScrollTop = event.srcElement.scrollTop;
    if (this.currentScrollTop > 0 && this.lastScrollTop <= this.currentScrollTop) {
      this.scrollDirection = ScrollDirectionEnum.Down;
    } else {
      this.scrollDirection = ScrollDirectionEnum.Up;
    }
    this.lastScrollTop = this.currentScrollTop;
  }
  resetInfiniteScroll() {
    // work around for this issue where ngx scrolling events stopped
    // working when going back to top after second or third time
    // https://github.com/orizens/ngx-infinite-scroll/issues/294
    this.infiniteScroll.ngOnDestroy();
    this.infiniteScroll.setup();
  }

  backToTop() {
    this.isNavigationVisible = false;
    this.clearTimeout();
    this.sendBackToTop = true;
    this.scrollToTop();
    this.resetInfiniteScroll();
  }
}
