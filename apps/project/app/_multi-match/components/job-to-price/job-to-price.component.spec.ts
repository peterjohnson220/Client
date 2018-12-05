import { ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { generateMockJobMatchCut } from 'libs/models/payfactors-api';

import { JobToPriceComponent } from './job-to-price.component';
import { generateMockJobToPrice } from '../../models';

describe('Project - MultiMatch - JobToPrice Component', () => {
  let instance: JobToPriceComponent;
  let fixture: ComponentFixture<JobToPriceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ JobToPriceComponent ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });
  });

  beforeEach(() => {

    fixture = TestBed.createComponent(JobToPriceComponent);
    instance = fixture.componentInstance;

    // Set up
    instance.job = generateMockJobToPrice();
  });

  it('should display Title, code and paymarket', () => {

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should display loading message when loading data cuts', () => {
    instance.showDataCuts = true;
    instance.job.LoadingDataCuts = true;

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should display error message when error found loading data cuts', () => {
    instance.showDataCuts = true;
    instance.job.LoadingDataCutsError = true;

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should display data cuts when data cuts loaded', () => {
    instance.showDataCuts = true;
    instance.job.JobMatchCuts = [generateMockJobMatchCut()];

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should display with 2 decimal precision if hourly', fakeAsync(() => {
    instance.showDataCuts = true;
    instance.job.JobMatchCuts = [generateMockJobMatchCut()];
    instance.rate = 'Hourly';

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  }));

  it('should show job detail when toggle clicked', () => {
    instance.toggleJobDetailDisplay();

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should show data cuts when toggle clicked', () => {
    instance.toggleDataCutsDisplay();

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should show new job match cuts as highlighted', () => {
    instance.showDataCuts = true;
    instance.job.JobMatchCuts = [generateMockJobMatchCut()];
    instance.job.JobMatchCuts[0].UserJobMatchId = null;

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should hide data cuts when last data cut removed', () => {
    instance.showDataCuts = true;
    instance.job.TotalDataCuts = 1;
    instance.job.JobMatchCuts = [generateMockJobMatchCut()];
    instance.removeMatchCut(instance.job.JobMatchCuts[0]);

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

});
