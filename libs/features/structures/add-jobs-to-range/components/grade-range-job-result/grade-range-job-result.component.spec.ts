import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { combineReducers, Store, StoreModule } from '@ngrx/store';

import { generateMockPayFactorsJobResult } from 'libs/features/jobs/add-jobs/models';
import * as fromRootState from 'libs/state/state';

import { GradeRangeJobResultComponent } from './grade-range-job-result.component';
import * as fromAddJobsReducer from '../../reducers';

describe('Project - Add Jobs - Job Result', () => {
  let instance: GradeRangeJobResultComponent;
  let fixture: ComponentFixture<GradeRangeJobResultComponent>;
  let store: Store<fromAddJobsReducer.State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          feature_addJobsToRange: combineReducers(fromAddJobsReducer.reducers),

          })
        ],
      declarations: [ GradeRangeJobResultComponent ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(GradeRangeJobResultComponent);
    instance = fixture.componentInstance;
    store = TestBed.inject(Store);
  });

  it('should emit job selection toggle when clicking on job result', () => {
    jest.spyOn(instance.jobClicked, 'emit');

    const mockJobResult = generateMockPayFactorsJobResult();

    instance.toggleJobSelection(mockJobResult);

    expect(instance.jobClicked.emit).toHaveBeenCalledWith(mockJobResult);
  });

});
