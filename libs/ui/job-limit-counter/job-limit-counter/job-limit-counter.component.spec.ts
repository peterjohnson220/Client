import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobLimitCounterComponent } from './job-limit-counter.component';

describe('Project - Add Jobs - Job Counter', () => {
  let instance: JobLimitCounterComponent;
  let fixture: ComponentFixture<JobLimitCounterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ JobLimitCounterComponent ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(JobLimitCounterComponent);
    instance = fixture.componentInstance;
  });

  it('should show the job count and progress bar should be green when job count is under the warning threshold', () => {
    instance.numberOfSearchResults = 100;
    instance.maxAllowedJobsSetting = 100;
    instance.currentJobCountSetting = 0;
    instance.jobUsageCount = 1;

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('progress bar should be yellow when job count is at or over the warning threshold but under the max limit', () => {
    instance.numberOfSearchResults = 100;
    instance.maxAllowedJobsSetting = 100;
    instance.currentJobCountSetting = 1;

    const warningThreshold = instance.warningThreshold; // 90%

    // (threshold + 1 / max) = 91 / 100 jobs
    instance.jobUsageCount = instance.currentJobCountSetting + warningThreshold;

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('progress bar should be red/orange when job count is at the max limit', () => {
    instance.numberOfSearchResults = 100;
    instance.maxAllowedJobsSetting = 100;
    instance.currentJobCountSetting = 95;
    instance.jobUsageCount = 5; // to reach 100 / 100 jobs

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should hide the job count and progress bar, and show "hit max allowed jobs, contact your service rep" message for small biz ' +
    'companies when job limit is reached', () => {
    instance.numberOfSearchResults = 100;
    instance.maxAllowedJobsSetting = 100;
    instance.currentJobCountSetting = 100;

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });
});
