import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';

import { Observable, Subscription } from 'rxjs';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';

import * as fromCommunitySearchActions from '../../actions/community-search.actions';
import * as fromCommunitySearchReducer from '../../reducers';

import { CommunityPost } from 'libs/models/community';

import { ScrollDirectionEnum } from '../../models/scroll-direction.enum';
import { CommunitySearchResultTypeEnum, CommunitySearchDurationEnum } from 'libs/models/community/community-constants.model';
import { CommunitySearchSortByEnum } from 'libs/models/community/community-constants.model';
import { CommunitySearchQuery } from 'libs/models/community/community-search-query.model';

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
  totalSearchResults$: Observable<number>;
  hasMoreSearchResultsOnServer$: Observable<boolean>;
  hasMoreSearchResultsOnServerSubscription: Subscription;
  loadingMoreSearchResultsSubscription: Subscription;
  totalSearchResultsSubscription: Subscription;

  query: string;
  searchSort = CommunitySearchSortByEnum.Relevance;
  searchDuration = CommunitySearchDurationEnum.AllTime;

  hasMoreResultsOnServer: boolean;
  loadingMoreSearchResults: boolean;
  totalSearchResults: number;
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
    this.totalSearchResults$ = this.store.select(fromCommunitySearchReducer.getTotalSearchResultsOnServer);
  }

  ngOnInit() {
  this.hasMoreSearchResultsOnServerSubscription = this.hasMoreSearchResultsOnServer$.subscribe(result =>
    this.hasMoreResultsOnServer = result);

  this.loadingMoreSearchResultsSubscription = this.loadingMoreSearchResults$.subscribe(result =>
  this.loadingMoreSearchResults = result);

  this.totalSearchResultsSubscription = this.totalSearchResults$.subscribe(result =>
    this.totalSearchResults = result);
  }

  ngOnDestroy() {
    if (this.hasMoreSearchResultsOnServerSubscription) {
      this.hasMoreSearchResultsOnServerSubscription.unsubscribe();
    }

    if (this.loadingMoreSearchResultsSubscription) {
      this.loadingMoreSearchResultsSubscription.unsubscribe();
    }

    if (this.totalSearchResultsSubscription) {
      this.totalSearchResultsSubscription.unsubscribe();
    }
  }

  executeSearch(searchQuery: CommunitySearchQuery) {
    this.query = searchQuery.searchTerm;
    this.searchSort = searchQuery.searchSort;
    this.searchDuration = searchQuery.searchDuration;
    this.store.dispatch(new fromCommunitySearchActions.SearchingCommunity(searchQuery));

    this.scrollToTop();
  }
  scrollToTop() {
    try {
      this.searchResultsScrollContainer.nativeElement.scrollTop = 0;
    } catch (err) { }
  }

  openDetailsModal(result) {

    if (result.Type === this.podcastType) {
      window.open(result.Details.Link, '_blank');
    } else {
      this.store.dispatch(new fromCommunitySearchActions.OpenSearchResultModal(result.Details.CommunityPostId));
    }
  }

  trackByFn(index, item) {
    return item.Id;
  }

  onScrollDown() {
    if (this.query.length > 0 && this.hasMoreResultsOnServer && !this.loadingMoreSearchResults) {
      this.store.dispatch(
        new fromCommunitySearchActions.GettingMoreCommunitySearchResults({
          searchTerm: this.query,
          searchSort: this.searchSort,
          searchDuration: this.searchDuration}));
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
