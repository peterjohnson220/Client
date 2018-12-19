import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobResultComponent } from './job-result.component';
import { generateMockCompanyJobResultWithPeerExchange, generateMockPayFactorsJobResult } from '../../models';

describe('Project - Add Jobs - Job Result', () => {
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

  it('should show the job detail when toggling the detail display', () => {
    instance.showJobDetail = false;

    instance.toggleJobDetailDisplay(new MouseEvent('Click'));

    expect(instance.showJobDetail).toBe(true);
  });

  it('should show a peer icon, when the jobs is mapped to an exchange', () => {
    instance.job = generateMockCompanyJobResultWithPeerExchange();

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should show the job detail', () => {
    instance.job = generateMockPayFactorsJobResult();
    instance.showJobDetail = true;

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should not show the job category, when the job is a payfactors job', () => {
    instance.job = generateMockCompanyJobResultWithPeerExchange();
    instance.showJobDetail = true;

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });
});
