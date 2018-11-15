import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { combineReducers, Store, StoreModule } from '@ngrx/store';

import spyOn = jest.spyOn;

import * as fromRootState from 'libs/state/state';
import * as fromCommunityJobActions from '../../actions/community-job.actions';
import * as fromCommunityJobReducer from '../../reducers';

import { CommunityJobsComponent } from './community-jobs.component';
import { CommunityJob } from 'libs/models/community/community-job.model';

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
        CommunityJobsComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.get(Store);
    spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(CommunityJobsComponent);
    instance = fixture.componentInstance;
  });

  it('should show community jobs', () => {
    fixture.detectChanges();
    expect(fixture).toBeTruthy();
  });

  it('should dispatch get GettingMoreCommunityJobs when scroll and has more results true and not loading', () => {
    const action = new fromCommunityJobActions.GettingMoreCommunityJobs();
    instance.loadingMoreResults = false;
    instance.hasMoreResultsOnServer = true;
    instance.onScroll();

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  it('should not dispatch if still loading more results', () => {
    instance.loadingMoreResults = true;
    instance.hasMoreResultsOnServer = false;
    instance.onScroll();

    expect(store.dispatch).toBeCalledTimes(0);
  });
  it('should not dispatch get GettingMoreCommunityJobs when scroll and has no more results and not loading', () => {
    instance.loadingMoreResults = false;
    instance.hasMoreResultsOnServer = false;
    instance.onScroll();

    expect(store.dispatch).toBeCalledTimes(0);
  });
});
