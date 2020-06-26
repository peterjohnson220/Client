import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';

import { ScrollDirectionEnum } from '../../models/scroll-direction.enum';

import spyOn = jest.spyOn;

import * as fromRootState from 'libs/state/state';
import * as fromCommunityJobActions from '../../actions/community-job.actions';
import * as fromCommunityJobReducer from '../../reducers';

import { CommunityJobsComponent } from './community-jobs.component';
import { generateMockCommunityJob } from 'libs/models/community/community-job.model';

describe('CommunityJobsComponent', () => {
  let fixture: ComponentFixture<CommunityJobsComponent>;
  let instance: CommunityJobsComponent;
  let store: Store<fromRootState.State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          communityJob: combineReducers(fromCommunityJobReducer.reducers)
        }),
      ],
      declarations: [
        CommunityJobsComponent,
        InfiniteScrollDirective
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.inject(Store);
    spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(CommunityJobsComponent);
    instance = fixture.componentInstance;
  });

  it('should show community jobs', () => {
    fixture.detectChanges();
    expect(fixture).toBeTruthy();
  });

  it('should dispatch get GettingMoreCommunityJobs when scroll down and has more results true and not loading', () => {
    const action = new fromCommunityJobActions.GettingMoreCommunityJobs();
    instance.loadingMoreResults = false;
    instance.hasMoreResultsOnServer = true;
    instance.onScrollDown();

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  it('should not dispatch if still loading more results', () => {
    instance.loadingMoreResults = true;
    instance.hasMoreResultsOnServer = false;
    instance.onScrollDown();

    expect(store.dispatch).toBeCalledTimes(0);
  });
  it('should not dispatch get GettingMoreCommunityJobs when scroll down and has no more results and not loading', () => {
    instance.loadingMoreResults = false;
    instance.hasMoreResultsOnServer = false;
    instance.onScrollDown();

    expect(store.dispatch).toBeCalledTimes(0);
  });
  it('should call trackByJobId returns job Id', () => {

    const communityJob = generateMockCommunityJob();
    const returnValue = instance.trackByJobId(communityJob);

    expect(returnValue).toBe(communityJob.Id);
  });
  it('call setTimer should call set scroller timeout first time through', () => {
    spyOn(instance, 'setScrollTimer');
    fixture.detectChanges();
    instance.setTimer();
    fixture.detectChanges();
    expect(instance.setScrollTimer).toBeCalled();
  });
  it('call setTimer should clear scroller timeout if one exists', () => {
    spyOn(instance, 'clearTimeout');
    fixture.detectChanges();
    instance.scrollTimerId = 1;
    instance.setTimer();
    fixture.detectChanges();
    expect(instance.clearTimeout).toBeCalled();
  });
  it('should dispatch GettingBackToTopCommunityJobs when back to top' , () => {
    const action = new fromCommunityJobActions.GettingBackToTopCommunityJobs();
    instance.isNavigationVisible = false;
    instance.backToTopFlag = true;
    instance.backToTop();
    expect(store.dispatch).toHaveBeenCalledWith(action);
  });
  it('call clearTimeout should clear windows timeout', () => {
    spyOn(window, 'clearTimeout');
    fixture.detectChanges();

    instance.scrollTimerId = 1;
    instance.clearTimeout();
    fixture.detectChanges();
    expect(clearTimeout).toBeCalled();
  });
  it('call setScrollTimer should set up window timer', () => {
    spyOn(window, 'setTimeout');
    fixture.detectChanges();

    instance.setScrollTimer();
    fixture.detectChanges();
    expect(instance.scrollTimerId).toBeDefined();
  });
  it('user scrolled up (by clicking on scroll bar) check navigation (back to top) button becomes visible', () => {
    spyOn(instance, 'setTimer');
    const param = {
      srcElement: {
        scrollTop: 10
      }
    };
    instance.currentScrollTop = 1;
    instance.lastScrollTop = 200;
    instance.backToTopFlag = false;
    instance.isNavigationVisible = false;
    fixture.detectChanges();

    instance.onScroll(param);
    fixture.detectChanges();
    expect(instance.setTimer).toBeCalledTimes(0);
    expect(instance.isNavigationVisible).toBeTruthy();
  });
  it('user scrolled up (by clicking back to top button) check the button is no longer visible and back to top reset', () => {
    spyOn(instance, 'setTimer');
    const param = {
      srcElement: {
        scrollTop: 10
      }
    };
    instance.currentScrollTop = 1;
    instance.lastScrollTop = 200;
    instance.backToTopFlag = true;
    instance.isNavigationVisible = false;
    fixture.detectChanges();

    instance.onScroll(param);
    fixture.detectChanges();
    expect(instance.setTimer).toBeCalledTimes(0);
    expect(instance.isNavigationVisible).toBeFalsy();
    expect(instance.backToTopFlag).toBeFalsy();
  });
  it('onScroll user scrolls down timer is set', () => {
    spyOn(instance, 'setTimer');
    const param = {
      srcElement: {
        scrollTop: 10
      }
    };
    instance.currentScrollTop = 0;
    instance.lastScrollTop = 0;
    instance.scrollDirection = ScrollDirectionEnum.Up;
    instance.backToTopFlag = false;
    fixture.detectChanges();
    instance.onScroll(param);
    fixture.detectChanges();
    expect(instance.setTimer).toBeCalledTimes(1);
  });
  it('call setScrollDirection direction returns down', () => {
    spyOn(instance, 'setTimer');
    const param = {
      srcElement: {
        scrollTop: 10
      }
    };
    instance.currentScrollTop = 0;
    instance.lastScrollTop = 0;
    fixture.detectChanges();

    instance.setScrollDirection(param);
    fixture.detectChanges();
    expect(instance.scrollDirection).toBe(ScrollDirectionEnum.Down);
    expect(instance.lastScrollTop).toBe(instance.currentScrollTop);
  });
  it('call setScrollDirection direction returns up', () => {
    spyOn(instance, 'setTimer');
    const param = {
      srcElement: {
        scrollTop: 10
      }
    };
    instance.currentScrollTop = 1;
    instance.lastScrollTop = 200;
    fixture.detectChanges();

    instance.setScrollDirection(param);
    fixture.detectChanges();
    expect(instance.scrollDirection).toBe(ScrollDirectionEnum.Up);
    expect(instance.lastScrollTop).toBe(instance.currentScrollTop);
  });
});
