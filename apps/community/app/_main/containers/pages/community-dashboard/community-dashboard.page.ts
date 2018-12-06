import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';

import { Subscription, Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import * as fromCommunityPostReducer from '../../../reducers';
import * as  fromCommunityPostActions from '../../../actions/community-post.actions';

import { CommunityPostsComponent } from '../../community-posts';
import { CommunityConstants } from '../../../models';


@Component({
  selector: 'pf-community-dashboard-page',
  templateUrl: './community-dashboard.page.html',
  styleUrls: [ './community-dashboard.page.scss' ]
})
export class CommunityDashboardPageComponent implements OnInit, OnDestroy {
  @ViewChild('posts') postsComponent: CommunityPostsComponent;

  readonly POST_ITEM_CLASS = 'post-item';
  readonly COMMUNITY_POSTS_CONTAINER_ID = 'community-posts';

  loadingNextBatchCommunityPosts$: Observable<boolean>;
  loadingPreviousBatchCommunityPosts$: Observable<boolean>;
  getHasPreviousBatchPostsOnServer$: Observable<boolean>;
  getHasNextBatchPostsOnServer$: Observable<boolean>;

  loadingNextBatchCommunityPostsSubscription: Subscription;
  loadingPreviousBatchCommunityPostsSubscription: Subscription;
  hasPreviousBatchResultsOnServerSubscription: Subscription;
  hasNextBatchResultsOnServerSubscription: Subscription;
  scrollingSubscription: Subscription;
  hasPreviousBatchOnServer = false;
  hasNextBatchOnServer = false;
  hideTopComponents = false;
  isLoadingNextBatch = false;
  isLoadingPreviousBatch = false;
  showBackToTopButton = false;

  scrollElement: any;
  scrollTop: any;
  scrollHeight: any;
  offsetHeight: any;

  previousScrollTop: any;
  previousHeight: any;
  previousTopPostOffset: any;
  previousBottomPostOffset: any;
  postBatchSize = CommunityConstants.POSTS_PER_BATCH;

  postsChangedObserver: any;
  targetNode: any;
  observerOptions: any;

  constructor(public store: Store<fromCommunityPostReducer.State>) {

    this.loadingNextBatchCommunityPosts$ = this.store.select(fromCommunityPostReducer.getLoadingNextBatchPosts);
    this.loadingPreviousBatchCommunityPosts$ = this.store.select(fromCommunityPostReducer.getLoadingPreviousBatchPosts);
    this.getHasPreviousBatchPostsOnServer$ = this.store.select(fromCommunityPostReducer.getHasPreviousBatchPostsOnServer);
    this.getHasNextBatchPostsOnServer$ = this.store.select(fromCommunityPostReducer.getHasNextBatchPostsOnServer);
  }

  onScroll(scrollEventData: any) {
    this.setScrollVariables(scrollEventData);

    const percentLocationUp = ((this.scrollTop) / this.scrollHeight) * 100;
    const percentLocationDown = ((this.scrollTop + this.offsetHeight) / this.scrollHeight) * 100;

    if (this.previousScrollTop > this.scrollTop && percentLocationUp <= 10) {

      this.setPreviousTopPostOffset();

      if (!this.isLoadingPreviousBatch) {
        this.postsComponent.onScrollUp();
      }

    } else if (percentLocationDown >= 90) {

      this.setPreviousBottomPostOffset();

      if (!this.isLoadingNextBatch) {
        this.postsComponent.onScrollDown();
      }
    }

    this.previousScrollTop = this.scrollTop;
    this.previousHeight = this.scrollHeight;
  }

  setScrollVariables(scrollEventData) {
    this.scrollElement = scrollEventData.srcElement;
    this.scrollTop = scrollEventData.srcElement.scrollTop || 0;
    this.scrollHeight = scrollEventData.srcElement.scrollHeight || 0;
    this.offsetHeight = scrollEventData.srcElement.offsetHeight || 0;
  }

  setPreviousTopPostOffset() {
    this.previousTopPostOffset = (<HTMLElement>document.getElementsByClassName(this.POST_ITEM_CLASS)[ 0 ]).offsetTop - this.scrollTop;
  }

  setPreviousBottomPostOffset() {
    const postItems = document.getElementsByClassName(this.POST_ITEM_CLASS);
    this.previousBottomPostOffset = (<HTMLElement>postItems[ postItems.length - 1 ]).offsetTop - this.scrollTop;
  }

  loadedNextBatchScrollToNewPosition() {
    this.showBackToTopButton = true;
    // TODO: Current scroll logic needs to be updated here to handle variations in CommunityConstants batch size and paging factor.
    if (document.getElementsByClassName(this.POST_ITEM_CLASS).length > this.postBatchSize) {
      this.hideLoadingNextBatchIndicator();

      const currentLastPostOffset = (<HTMLElement>document.getElementsByClassName(this.POST_ITEM_CLASS)
        [ this.postBatchSize - 1 ]).offsetTop;

      const newCalculatedScrollPosition = currentLastPostOffset - this.previousBottomPostOffset;

      this.scrollElement.scrollTop = newCalculatedScrollPosition;
      this.previousScrollTop = newCalculatedScrollPosition;
    }
  }

  showLoadingNextBatchIndicator() {
    const loadingNextResultsIndicator = document.getElementById('loading-next-results-indicator');
    loadingNextResultsIndicator.classList.remove('k-display-none');
  }

  hideLoadingNextBatchIndicator() {
    const loadingNextResultsIndicator = document.getElementById('loading-next-results-indicator');
    loadingNextResultsIndicator.classList.add('k-display-none');
  }

  loadedPreviousBatchScrollToNewPosition() {
    // TODO: Current scroll logic needs to be updated here to handle variations in CommunityConstants batch size and paging factor.
    this.hideLoadingPreviousBatchIndicator();

    const currentFirstPostOffset = (<HTMLElement>document.getElementsByClassName(this.POST_ITEM_CLASS)[ this.postBatchSize ]).offsetTop;
    const newCalculatedScrollPosition = currentFirstPostOffset - this.previousTopPostOffset;

    this.scrollElement.scrollTop = newCalculatedScrollPosition;
    this.previousScrollTop = newCalculatedScrollPosition;
  }

  showLoadingPreviousBatchIndicator() {
    const loadingPreviousResultsIndicator = document.getElementById('loading-previous-results-indicator');
    loadingPreviousResultsIndicator.classList.remove('k-display-none');
  }

  hideLoadingPreviousBatchIndicator() {
    const loadingPreviousResultsIndicator = document.getElementById('loading-previous-results-indicator');
    loadingPreviousResultsIndicator.classList.add('k-display-none');
  }

  backToTop() {
    this.showBackToTopButton = false;
    this.hideTopComponents = false;
    this.store.dispatch(new fromCommunityPostActions.GettingBackToTopCommunityPosts());

    if (this.scrollElement) {
      this.scrollElement.scrollTop = 0;
      this.previousScrollTop = 0;
    }
  }

  // Lifecycle events
  ngOnInit() {
    this.targetNode = document.querySelector(`#${this.COMMUNITY_POSTS_CONTAINER_ID}`);
    this.observerOptions = {
      childList: true,
      attributes: true,
      subtree: true
    };

    this.postsChangedObserver = new MutationObserver(() => {
      if (this.isLoadingNextBatch) {
        this.loadedNextBatchScrollToNewPosition();
        this.isLoadingNextBatch = false;

      } else if (this.isLoadingPreviousBatch) {
        this.loadedPreviousBatchScrollToNewPosition();
        this.isLoadingPreviousBatch = false;
      }
      this.postsChangedObserver.disconnect();
    });

    this.hasNextBatchResultsOnServerSubscription = this.getHasNextBatchPostsOnServer$.subscribe(value => {
      if (value != null) {
        this.hasNextBatchOnServer = value;
      }
    });

    this.hasPreviousBatchResultsOnServerSubscription = this.getHasPreviousBatchPostsOnServer$.subscribe(value => {
      if (value != null) {
        this.hasPreviousBatchOnServer = value;
      }
    });

    this.loadingNextBatchCommunityPostsSubscription = this.loadingNextBatchCommunityPosts$.subscribe(value => {


      if (value && this.hasNextBatchOnServer) {
        this.isLoadingNextBatch = true;
        this.postsChangedObserver.observe(this.targetNode, this.observerOptions);
        this.showLoadingNextBatchIndicator();
      }

      if (value === false && this.scrollElement != null) {
        if (this.hasPreviousBatchOnServer) {
          this.hideTopComponents = true;
        }
      }
    });

    this.loadingPreviousBatchCommunityPostsSubscription = this.loadingPreviousBatchCommunityPosts$.subscribe(value => {
      if (value) {
        this.isLoadingPreviousBatch = true;
        this.postsChangedObserver.observe(this.targetNode, this.observerOptions);
        this.showLoadingPreviousBatchIndicator();
      }

      if (value === false && this.scrollElement != null) {
        if (!this.hasPreviousBatchOnServer) {
          this.hideTopComponents = false;
        }
      }
    });
  }

  ngOnDestroy() {
    if (this.scrollingSubscription) {
      this.scrollingSubscription.unsubscribe();
    }

    if (this.loadingNextBatchCommunityPostsSubscription) {
      this.loadingNextBatchCommunityPostsSubscription.unsubscribe();
    }

    if (this.loadingPreviousBatchCommunityPostsSubscription) {
      this.loadingPreviousBatchCommunityPostsSubscription.unsubscribe();
    }

    if (this.hasPreviousBatchResultsOnServerSubscription) {
      this.hasPreviousBatchResultsOnServerSubscription.unsubscribe();
    }

    if (this.hasNextBatchResultsOnServerSubscription) {
      this.hasNextBatchResultsOnServerSubscription.unsubscribe();
    }
  }
}
