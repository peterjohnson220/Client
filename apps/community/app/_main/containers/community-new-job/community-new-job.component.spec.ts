import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { Store, StoreModule } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';
import * as fromCommunityJobActions from '../../actions/community-job.actions';

import { CommunityNewJobComponent } from './community-new-job.component';

describe('CommunityNewJobComponent', () => {
  let fixture: ComponentFixture<CommunityNewJobComponent>;
  let instance: CommunityNewJobComponent;
  let store: Store<fromRootState.State>;

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers
        }),
        ReactiveFormsModule
      ],
      declarations: [
        CommunityNewJobComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.inject(Store);

    spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(CommunityNewJobComponent);
    instance = fixture.componentInstance;
  });

  it('should dispatch SubmittingCommunityJob when calling submit', () => {
    instance.positionTitle.setValue('Title1');
    instance.location.setValue('location1');
    instance.postingUrl.setValue('www.postingUrl1.com');

    const mockLocation = {
      text: 'test',
      place_name: 'Burlington',
      latitude: 71.1956,
      longitude: 42.5047,
      IsSuggested: true
    };

    instance.currentSelectedLocation = mockLocation;
    instance.submit();

    const newJob = {
      PositionTitle: instance.positionTitle.value,
      Location: instance.location.value,
      Url: instance.postingUrl.value,
      Latitude: mockLocation.latitude,
      Longitude: mockLocation.longitude
    };
    const expectedAction = new fromCommunityJobActions.SubmittingCommunityJob(newJob);
    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

});
