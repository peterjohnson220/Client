import { Component, OnInit, OnDestroy, ElementRef, ViewChild, Input } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';

import { CommunityJob, UserContext } from 'libs/models';
import { CloudFileLocations } from 'libs/constants';
import * as fromRootReducer from 'libs/state/state';

import { ScrollDirectionEnum } from '../../models/scroll-direction.enum';
import * as fromCommunityJobReducer from '../../reducers';
import * as fromCommunityJobActions from '../../actions/community-job.actions';



@Component({
  selector: 'pf-community-jobs',
  templateUrl: './community-jobs.component.html',
  styleUrls: ['./community-jobs.component.scss']
})
export class CommunityJobsComponent implements OnInit, OnDestroy {
  @ViewChild('jobSearchResults', { static: true }) public jobSearchResultsScrollContainer: ElementRef;
  @ViewChild(InfiniteScrollDirective, { static: true }) infiniteScroll: InfiniteScrollDirective;
  @Input() addPaddingTopToJobsList: boolean;

  communityJobs$: Observable<CommunityJob[]>;
  loadingCommunityJobs$: Observable<boolean>;
  loadingCommunityJobsError$: Observable<boolean>;
  loadingMoreCommunityJobs$: Observable<boolean>;
  hasMoreResultsOnServer$: Observable<boolean>;
  userContext$: Observable<UserContext>;

  userContextSubscription: Subscription;
  hasMoreResultsOnServerSub: Subscription;
  loadingMoreCommunityJobsSub: Subscription;

  loadingMoreResults: boolean;
  hasMoreResultsOnServer: boolean;
  companyLogoUrl: string;
  isNavigationVisible = false;
  scrollTimerId: number;
  scrollerTimeout = 1000;
  backToTopFlag = false;
  scrollDirection = ScrollDirectionEnum.Down;
  currentScrollTop: number;
  lastScrollTop = 0;

   constructor(public store: Store<fromCommunityJobReducer.State>) {
      this.communityJobs$ = this.store.select(fromCommunityJobReducer.getCommunityJobs);
      this.loadingCommunityJobs$ = this.store.select(fromCommunityJobReducer.getGettingCommunityJobs);
      this.loadingMoreCommunityJobs$ = this.store.select(fromCommunityJobReducer.getLoadingMoreResults);
      this.hasMoreResultsOnServer$ = this.store.select(fromCommunityJobReducer.getHasMoreResultsOnServer);
      this.loadingCommunityJobsError$ = this.store.select(fromCommunityJobReducer.getGettingCommunityJobsError);
      this.userContext$ = this.store.select(fromRootReducer.getUserContext);
   }

  ngOnInit() {

    this.store.dispatch(new fromCommunityJobActions.GettingCommunityJobs());

    this.loadingMoreCommunityJobsSub = this.loadingMoreCommunityJobs$.subscribe(lmr =>
      this.loadingMoreResults = lmr
    );
    this.hasMoreResultsOnServerSub = this.hasMoreResultsOnServer$.subscribe(hmr =>
      this.hasMoreResultsOnServer = hmr
    );

    this.userContextSubscription = this.userContext$.subscribe((userContext) => {
      this.companyLogoUrl = userContext.ConfigSettings.find(c => c.Name === 'CloudFiles_PublicBaseUrl')?.Value + CloudFileLocations.CompanyLogos;
    });
  }

  ngOnDestroy() {
     if (this.loadingMoreCommunityJobsSub) {
       this.loadingMoreCommunityJobsSub.unsubscribe();
     }
     if (this.hasMoreResultsOnServerSub) {
       this.hasMoreResultsOnServerSub.unsubscribe();
     }
     if (this.userContextSubscription) {
       this.userContextSubscription.unsubscribe();
     }
  }

  trackByJobId(item: CommunityJob) {
    return item.Id;
  }

  onScrollDown() {
    if (!this.loadingMoreResults && this.hasMoreResultsOnServer) {
      this.store.dispatch(new fromCommunityJobActions.GettingMoreCommunityJobs());
    }
  }

  setTimer() {
    if (this.scrollTimerId !== undefined) {
       this.clearTimeout();
    }
    this.setScrollTimer();
  }

  backToTop() {
    this.isNavigationVisible = false;
    this.clearTimeout();
    this.backToTopFlag = true;
    this.store.dispatch(new fromCommunityJobActions.GettingBackToTopCommunityJobs());
    this.scrollToTop();
    this.resetInfiniteScroll();
  }

  resetInfiniteScroll() {
    // work around for this issue where ngx scrolling events stopped
    // working when going back to top after second or third time
    // https://github.com/orizens/ngx-infinite-scroll/issues/294
    this.infiniteScroll.ngOnDestroy();
    this.infiniteScroll.setup();
  }

  clearTimeout() {
    clearTimeout(this.scrollTimerId);
  }

  scrollToTop() {
    try {
      this.jobSearchResultsScrollContainer.nativeElement.scrollTop = 0;
    } catch (err) { }
  }

  setScrollTimer() {
    this.scrollTimerId = window.setTimeout(() => {
        this.isNavigationVisible = true;
    }, this.scrollerTimeout);
  }

  onScroll(event: any) {
    this.setScrollDirection(event);

    if (this.scrollDirection === ScrollDirectionEnum.Up) {
       if (!this.backToTopFlag) {
         this.isNavigationVisible = true;
        } else {
          this.backToTopFlag = false;
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
}
