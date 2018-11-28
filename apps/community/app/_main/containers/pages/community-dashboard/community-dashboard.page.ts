import { Component, ViewChild, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CdkScrollable, ScrollDispatcher } from '@angular/cdk/overlay';

import { Subscription, Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import * as fromCommunityPostReducer from '../../../reducers';
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

  scrollElement: any;
  scrollTop: any;
  scrollHeight: any;
  offsetHeight: any;

  previousScrollTop: any;
  previousHeight: any;
  previousTopPostOffset: any;
  previousBottomPostOffset: any;
  postBatchSize = CommunityConstants.POSTS_PER_BATCH;

  constructor(public store: Store<fromCommunityPostReducer.State>,
              public scroll: ScrollDispatcher, private changeDetector: ChangeDetectorRef) {

    this.loadingNextBatchCommunityPosts$ = this.store.select(fromCommunityPostReducer.getLoadingNextBatchPosts);
    this.loadingPreviousBatchCommunityPosts$ = this.store.select(fromCommunityPostReducer.getLoadingPreviousBatchPosts);
    this.getHasPreviousBatchPostsOnServer$ = this.store.select(fromCommunityPostReducer.getHasPreviousBatchPostsOnServer);
    this.getHasNextBatchPostsOnServer$ = this.store.select(fromCommunityPostReducer.getHasNextBatchPostsOnServer);

    this.scrollingSubscription = this.scroll
      .scrolled()
      .subscribe((data: CdkScrollable) => {
        this.onWindowScroll(data);
      });

  }

  onWindowScroll(data: CdkScrollable) {

    this.setScrollVariables(data);

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

  setScrollVariables(cdkScrollableData) {
    this.scrollElement = cdkScrollableData.getElementRef();
    this.scrollTop = cdkScrollableData.getElementRef().nativeElement.scrollTop || 0;
    this.scrollHeight = cdkScrollableData.getElementRef().nativeElement.scrollHeight || 0;
    this.offsetHeight = cdkScrollableData.getElementRef().nativeElement.offsetHeight || 0;
  }

  setPreviousTopPostOffset() {
    this.previousTopPostOffset = (<HTMLElement>document.getElementsByClassName(this.POST_ITEM_CLASS)[ 0 ]).offsetTop - this.scrollTop;
  }

  setPreviousBottomPostOffset() {
    const postItems = document.getElementsByClassName(this.POST_ITEM_CLASS);

    if (postItems.length > this.postBatchSize) {
      this.previousBottomPostOffset = (<HTMLElement>postItems[ postItems.length - 1 ]).offsetTop - this.scrollTop;
    } else {
      this.previousBottomPostOffset = (<HTMLElement>postItems[ this.postBatchSize - 1 ]).offsetTop - this.scrollTop;
    }
  }

  loadedNextBatchScrollToNewPosition() {
    // TODO: Current scroll logic needs to be updated here to handle variations in CommunityConstants batch size and paging factor.
    if (document.getElementsByClassName(this.POST_ITEM_CLASS).length > this.postBatchSize) {
      const currentLastPostOffset = (<HTMLElement>document.getElementsByClassName(this.POST_ITEM_CLASS)
        [ this.postBatchSize - 1 ]).offsetTop;
      const newCalculatedScrollPosition = currentLastPostOffset - this.previousBottomPostOffset;

      this.scroll.getAncestorScrollContainers(this.scrollElement)[ 0 ].getElementRef().nativeElement
        .scrollTop = newCalculatedScrollPosition;

      this.previousScrollTop = newCalculatedScrollPosition;
    }
  }

  loadedPreviousBatchScrollToNewPosition() {
    // TODO: Current scroll logic needs to be updated here to handle variations in CommunityConstants batch size and paging factor.
    const currentFirstPostOffset = (<HTMLElement>document.getElementsByClassName(this.POST_ITEM_CLASS)[ this.postBatchSize ]).offsetTop;
    const newCalculatedScrollPosition = currentFirstPostOffset - this.previousTopPostOffset;

    this.scroll.getAncestorScrollContainers(this.scrollElement)[ 0 ].getElementRef().nativeElement
      .scrollTop = newCalculatedScrollPosition;

    this.previousScrollTop = newCalculatedScrollPosition;
  }

  // Lifecycle events
  ngOnInit() {
    const targetNode = document.querySelector(`#${this.COMMUNITY_POSTS_CONTAINER_ID}`);
    const observerOptions = {
      childList: true,
      attributes: true,
      subtree: true
    };

    const postsChangedObserver = new MutationObserver(() => {
      if (this.isLoadingNextBatch) {
        this.loadedNextBatchScrollToNewPosition();
        this.isLoadingNextBatch = false;

      } else if (this.isLoadingPreviousBatch) {
        this.loadedPreviousBatchScrollToNewPosition();
        this.isLoadingPreviousBatch = false;
      }
    });
    postsChangedObserver.observe(targetNode, observerOptions);

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
      }

      if (value === false && this.scrollElement != null) {
        if (this.hasPreviousBatchOnServer) {
          this.hideTopComponents = true;
        }
        window.setTimeout(() => {
          this.changeDetector.detectChanges(); // IE requires change detection
        }, 0);
      }
    });

    this.loadingPreviousBatchCommunityPostsSubscription = this.loadingPreviousBatchCommunityPosts$.subscribe(value => {
      if (value) {
        this.isLoadingPreviousBatch = true;
      }

      if (value === false && this.scrollElement != null) {
        if (!this.hasPreviousBatchOnServer) {
          this.hideTopComponents = false;
        }
        window.setTimeout(() => {
          this.changeDetector.detectChanges(); // IE requires change detection
        }, 0);
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
