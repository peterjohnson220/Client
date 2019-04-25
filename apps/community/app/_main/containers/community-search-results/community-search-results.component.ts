import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';

import { Observable, Subscription } from 'rxjs';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';

import * as fromCommunitySearchActions from '../../actions/community-search.actions';
import * as fromCommunitySearchReducer from '../../reducers';

import { CommunityPost } from 'libs/models/community';

@Component({
  selector: 'pf-community-search-results',
  templateUrl: './community-search-results.component.html',
  styleUrls: [ './community-search-results.component.scss' ]
})
export class CommunitySearchResultsComponent implements OnInit, OnDestroy {
  @ViewChild('SearchResults') public searchResultsScrollContainer: ElementRef;

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
    this.store.dispatch(new fromCommunitySearchActions.OpenSearchResultModal(result));
  }

  trackByFn(index, item) {
    return item.Id;
  }

  onScrollDown() {
    if (this.query.length > 0 && this.hasMoreResultsOnServer && !this.loadingMoreSearchResults) {
      this.store.dispatch(new fromCommunitySearchActions.GettingMoreCommunitySearchResults(this.query));
    }
  }
}
