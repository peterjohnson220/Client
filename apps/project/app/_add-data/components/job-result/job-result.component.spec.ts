import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { JobResultComponent } from './job-result.component';
import { generateMockPayfactorsJobResult, generateMockSurveyJobResult } from '../../models';

describe('Project - Add Data - Job Result', () => {
  let component: JobResultComponent;
  let fixture: ComponentFixture<JobResultComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ JobResultComponent ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(JobResultComponent);
    component = fixture.componentInstance;
  });

  it('should display Show Cuts link when current job is not Payfactors', () => {
    component.job = generateMockSurveyJobResult();

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should hide Show Cuts link when the current job is Payfactors', () => {
    component.job = generateMockPayfactorsJobResult();

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should display Hide Cuts link when toggling the data cuts display', () => {
    component.showDataCuts = false;

    component.toggleDataCutsDisplay();

    expect(component.toggleDataCutsLabel).toEqual('Hide Cuts');
  });
});
