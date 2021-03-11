import { ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { JobToGradeComponent } from './job-to-grade.component';
import { generateMockGrade, generateMockGradeJob, GradeJob } from '../../models';
import { RangeValuePipe } from '../../pipes';
import { PfCommonModule } from '../../../../../core';

describe('Project - Structures - JobToGrade Component', () => {
  let instance: JobToGradeComponent;
  let fixture: ComponentFixture<JobToGradeComponent>;
  let jobs: GradeJob[];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        PfCommonModule
      ],
      declarations: [ JobToGradeComponent, RangeValuePipe ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });
  });

  beforeEach(() => {

    fixture = TestBed.createComponent(JobToGradeComponent);
    instance = fixture.componentInstance;

    // Set up
    instance.grade = generateMockGrade();
    const job = {
      JobTitle: 'Fake Job',
      JobCode: 'AAA',
      CompanyStructuresGradesId: 1,
      AlreadyExists: true,
      JobId: 1
    };
    jobs = [job];
  });

  it('should display grade, min/mid/max', () => {

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should display loading message when loading jobs', () => {
    instance.showJobs = true;
    instance.grade.LoadingJobs = true;

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });
  //
  it('should display error message when error found loading jobs', () => {
    instance.showJobs = true;
    instance.grade.LoadingJobsError = true;

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should display jobs when jobs loaded', () => {
    instance.showJobs = true;
    instance.grade.Jobs = jobs;

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should display with 2 decimal precision if hourly', fakeAsync(() => {
    instance.showJobs = true;
    instance.grade.Jobs = jobs;
    instance.rate = 'Hourly';

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  }));

  it('should show jobs when toggle clicked', () => {
    instance.toggleJobsDisplay();

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

});
