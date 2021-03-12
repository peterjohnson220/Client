import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { generateMockPayFactorsJobResult } from 'libs/features/jobs/add-jobs/models';

import { GradeRangeJobResultComponent } from './grade-range-job-result.component';

describe('Project - Add Jobs - Job Result', () => {
  let instance: GradeRangeJobResultComponent;
  let fixture: ComponentFixture<GradeRangeJobResultComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ GradeRangeJobResultComponent ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(GradeRangeJobResultComponent);
    instance = fixture.componentInstance;
  });

  it('should emit job selection toggle when clicking on job result', () => {
    spyOn(instance.jobClicked, 'emit');

    const mockJobResult = generateMockPayFactorsJobResult();

    instance.toggleJobSelection(mockJobResult);

    expect(instance.jobClicked.emit).toHaveBeenCalledWith(mockJobResult);
  });

});
