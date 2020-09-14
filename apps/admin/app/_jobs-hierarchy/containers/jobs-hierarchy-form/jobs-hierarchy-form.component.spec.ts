import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { combineReducers, Store, StoreModule } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';
import { PfValidators } from 'libs/forms/validators';
import { HierarchyGroupingTypes } from 'libs/constants/structures/hierarchy-grouping-type';

import { JobsHierarchyFormComponent } from './jobs-hierarchy-form.component';
import * as fromJobsHierarchyReducers from '../../reducers';
import * as fromJobsHierarchyActions from '../../actions/jobs-hierarchy.actions';

describe('JobsHierarchyFormComponent', () => {
  let instance: JobsHierarchyFormComponent;
  let fixture: ComponentFixture<JobsHierarchyFormComponent>;
  let formBuilder: FormBuilder;
  let store: Store<fromJobsHierarchyReducers.State>;
  let router: Router;

  beforeEach(( ) => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          jobHierarchyConfig: combineReducers(fromJobsHierarchyReducers.reducers)
        }),
        ReactiveFormsModule
      ],
      declarations: [ JobsHierarchyFormComponent ],
      providers: [
        {
          provide: Router,
          useValue: {navigate: jest.fn()}
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });

    formBuilder = new FormBuilder();
    fixture = TestBed.createComponent(JobsHierarchyFormComponent);
    instance = fixture.componentInstance;

    instance.createJobsHierarchyForm = formBuilder.group({
      hierarchyName: ['', PfValidators.required, PfValidators.maxLengthTrimWhitespace(this.MAX_NAME_LENGTH)],
      groupingOrder: ['', PfValidators.required],
      jobFamilies: [''],
      jobLevels: [''],
      jobLevelsInHierarchy: ['']
    });

    instance.groupingTypes = [HierarchyGroupingTypes.JOB_FAMILY_JOB_LEVEL, HierarchyGroupingTypes.JOB_FAMILY, HierarchyGroupingTypes.JOB_LEVEL];
    instance.defaultGroupingType = HierarchyGroupingTypes.JOB_FAMILY_JOB_LEVEL;
    instance.selectableJobFamiliesList = [{JobFamily: 'Job Family 1', Selected: false}, {JobFamily: 'Job Family 2', Selected: false}];
    instance.selectedJobLevel = 'Job Family 2';
    instance.selectedJobLevelInHierarchy = 'Job Family 1';
    instance.jobLevelsMasterList = ['Job Family 1', 'Job Family 2'];
    instance.jobLevelsInHierarchy = ['Job Family 1'];
    instance.jobLevels = ['Job Family 2'];
    store = TestBed.inject(Store);
    router = TestBed.inject(Router);

  });

  it('should dispatch SetJobFamilySelection action on job family selected', () => {
    spyOn(store, 'dispatch');
    const selectedFamiliesList = [{JobFamily: 'Job Family 1', Selected: true}, {JobFamily: 'Job Family 2', Selected: false}];
    const expectedAction = new fromJobsHierarchyActions.SetJobFamilySelection(selectedFamiliesList);

    instance.updateJobFamiliesSelected('Job Family 1', true);
    expect(store.dispatch).toHaveBeenNthCalledWith(1, expectedAction);
  });

});
