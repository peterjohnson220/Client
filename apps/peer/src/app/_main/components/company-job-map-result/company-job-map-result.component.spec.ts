import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { generateMockCompanyJobToMapTo } from 'libs/models/peer';

import { CompanyJobMapResultComponent } from './company-job-map-result.component';

describe('Peer - Company Job Map Result', () => {
  let fixture: ComponentFixture<CompanyJobMapResultComponent>;
  let instance: CompanyJobMapResultComponent;

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        CompanyJobMapResultComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(CompanyJobMapResultComponent);
    instance = fixture.componentInstance;
  });

  it('should show a No Job Description message for the result, when there is none ', () => {
    instance.companyJobToMapTo = {...generateMockCompanyJobToMapTo(), JobDescription: '' };

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should show a ellipsis after the Job Description, when the job description exceeds the max length', () => {
    instance.companyJobToMapTo = {...generateMockCompanyJobToMapTo(), JobDescription: 'Dummy Job Description' };
    instance.jobDescriptionMaxLength = 13;

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should show the full Job Description, when the job description is less than the max length', () => {
    instance.companyJobToMapTo = {...generateMockCompanyJobToMapTo(), JobDescription: 'Dummy Job Description' };
    instance.jobDescriptionMaxLength = 50;

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should show a View less link, when we are showing the full job description', () => {
    instance.companyJobToMapTo = {...generateMockCompanyJobToMapTo(), JobDescription: 'Dummy Job Description' };
    instance.jobDescriptionMaxLength = 13;
    instance.showFullJobDescription = true;

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should set showFullJobDescription to true, when clicking the View More link', () => {
    instance.companyJobToMapTo = {...generateMockCompanyJobToMapTo(), JobDescription: 'Dummy Job Description' };
    instance.jobDescriptionMaxLength = 13;

    fixture.detectChanges();

    const viewMoreLink = fixture.debugElement.query(By.css('.toggle-jd-view-link'));
    viewMoreLink.triggerEventHandler('click', null);

    expect(instance.showFullJobDescription).toBe(true);
  });


  it('should emit an applyMapping event with the companyJobId of the result, when handleApplyMapping is triggered', () => {
    spyOn(instance.applyMapping, 'emit');

    const companyJobToMapTo = generateMockCompanyJobToMapTo();

    instance.handleApplyMapping(companyJobToMapTo.CompanyJobId);

    expect(instance.applyMapping.emit).toHaveBeenCalledWith(companyJobToMapTo.CompanyJobId);
  });

});
