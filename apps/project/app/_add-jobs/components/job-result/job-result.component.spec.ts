import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobResultComponent } from './job-result.component';
import { generateMockPayFactorsJobResult } from '../../models';

describe('JobResultComponent', () => {
  let instance: JobResultComponent;
  let fixture: ComponentFixture<JobResultComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ JobResultComponent ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(JobResultComponent);
    instance = fixture.componentInstance;
  });

  it('should emit job selection toggle when clicking on job result', () => {
    instance.job = generateMockPayFactorsJobResult();
    spyOn(instance.jobClicked, 'emit');

    instance.handleJobClicked();

    expect(instance.jobClicked.emit).toHaveBeenCalledWith(instance.job);
  });
});
