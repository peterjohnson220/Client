import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { DragulaModule } from 'ng2-dragula';
import { of } from 'rxjs/index';

import * as fromRootState from 'libs/state/state';

import { JobsToGradeContainerComponent } from './jobs-to-grade-container.component';
import { generateMockGrade, generateMockGetGradeJobsModel, generateMockGradeJob } from '../../models';
import * as fromAddJobsReducer from '../../reducers';
import * as fromJobsToGradeActions from '../../actions/jobs-to-grade.actions';

describe('Project - AddJobs - JobToGrade Container Component', () => {
  let instance: JobsToGradeContainerComponent;
  let fixture: ComponentFixture<JobsToGradeContainerComponent>;
  let store: Store<fromAddJobsReducer.State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          feature_addJobsToRange: combineReducers(fromAddJobsReducer.reducers),

        }),
        DragulaModule.forRoot()
      ],
      declarations: [ JobsToGradeContainerComponent ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });
  });

  beforeEach(() => {

    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(JobsToGradeContainerComponent);
    instance = fixture.componentInstance;
    instance.controlPoint = 'BaseMRP';

  });

  it('should get jobs when load jobs clicked', () => {
    const model = generateMockGetGradeJobsModel();
    const expectedAction = new fromJobsToGradeActions.GetGradeJobs(model);
    spyOn(store, 'dispatch');

    instance.handleLoadJobs(generateMockGrade());
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should display grades instead of the no valid jobs message when grades are found', () => {
    instance.grades$ = of([generateMockGrade()]);

    expect(fixture).toMatchSnapshot();


  });

  it('should not get jobs when load jobs clicked but jobs are already loaded', () => {
    const model = generateMockGetGradeJobsModel();
    const expectedAction = new fromJobsToGradeActions.GetGradeJobs(model);
    spyOn(store, 'dispatch');

    const grade = generateMockGrade();
    grade.Jobs = [generateMockGradeJob()];
    instance.handleLoadJobs(grade);
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();

    expect(store.dispatch).not.toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch a delete job action when job deleted', () => {
    const grade = generateMockGrade();
    grade.Jobs = [generateMockGradeJob()];
    const expectedAction = new fromJobsToGradeActions.RemoveJob({GradeId: grade.CompanyStructuresGradesId, Job: grade.Jobs[0]});
    spyOn(store, 'dispatch');

    instance.handleJobDeleted({ job: grade.Jobs[0], grade: grade});
    fixture.detectChanges();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

});
