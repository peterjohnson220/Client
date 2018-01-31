import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';

import { generateMockJob } from 'libs/models';

import { JobInfoContainerComponent } from './job-info-container.component';

describe('Peer - Job Info Container', () => {
  let fixture: ComponentFixture<JobInfoContainerComponent>;
  let instance: JobInfoContainerComponent;

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        JobInfoContainerComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(JobInfoContainerComponent);
    instance = fixture.componentInstance;
  });

  it('should show the job code, when showJobCode is true', () => {
    instance.job = generateMockJob();
    instance.showJobCode = true;

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

});
