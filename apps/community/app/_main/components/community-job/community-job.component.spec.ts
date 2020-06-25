import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { combineReducers, Store, StoreModule } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';
import * as fromCommunityJobReducer from '../../reducers';
import * as fromCommunityJobActions from '../../actions/community-job.actions';

import { CommunityJobComponent } from './community-job.component';
import { generateMockCommunityJob } from 'libs/models';

describe('CommunityJobComponent', () => {
  let fixture: ComponentFixture<CommunityJobComponent>;
  let instance: CommunityJobComponent;
  let store: Store<fromRootState.State>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          communityPollRequest: combineReducers(fromCommunityJobReducer.reducers)
        }),
      ],
      declarations: [
        CommunityJobComponent
       ],
       // Shallow Testing
       schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.inject(Store);

    spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(CommunityJobComponent);
    instance = fixture.componentInstance;

    instance.job = generateMockCommunityJob();
  }));

  it('should show component', () => {
    instance.job = generateMockCommunityJob();

    fixture.detectChanges();
    expect(fixture).toBeTruthy();
  });

  it('should call DeletingCommunityJob when isCurrentUserJob is true while calling delete', () => {
    instance.isCurrentUserJob = true;
    instance.job = generateMockCommunityJob();

    instance.delete();
    const expectedAction = new fromCommunityJobActions.DeletingCommunityJob(instance.job.Id);
    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });


});
