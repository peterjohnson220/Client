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

  it('should emit an applyMapping event with the companyJobId of the result, when handleApplyMapping is triggered', () => {
    spyOn(instance.applyMapping, 'emit');

    const companyJobToMapTo = generateMockCompanyJobToMapTo();

    instance.handleApplyMapping(companyJobToMapTo.CompanyJobId);

    expect(instance.applyMapping.emit).toHaveBeenCalledWith(companyJobToMapTo.CompanyJobId);
  });

});
