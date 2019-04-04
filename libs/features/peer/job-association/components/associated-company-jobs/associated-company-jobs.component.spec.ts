import { AssociatedCompanyJobsComponent } from './associated-company-jobs-component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { AsyncContainerComponent } from 'libs/ui/common';

describe('AssociatedCompanyJobsComponent', () => {
  let component: AssociatedCompanyJobsComponent;
  let fixture: ComponentFixture<AssociatedCompanyJobsComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [AssociatedCompanyJobsComponent, AsyncContainerComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssociatedCompanyJobsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display company jobs', () => {
    component.companyJobs = [{
      JobCode: '001',
      CompanyJobId: 1,
      JobFamily: 'Family',
      IsAssociated: false,
      JobTitle: 'Job Title',
      JobDescription: 'Job Description'
    }];
    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
  });

  it('handleRemoveAssociate triggers removeAssociation output', (done) => {
    component.companyJobs = [{
      JobCode: '001',
      CompanyJobId: 1,
      JobFamily: 'Family',
      IsAssociated: false,
      JobTitle: 'Job Title',
      JobDescription: 'Job Description'
    }];

    component.removeAssociation.subscribe(r => {
      expect(r).toEqual(1);
      done();
    });

    component.handleRemoveAssociate(1);
  });

  it('should show jobs after loading successfully', () => {
    component.companyJobs = [{
      JobCode: '001',
      CompanyJobId: 1,
      JobFamily: 'Family',
      IsAssociated: false,
      JobTitle: 'Job Title',
      JobDescription: 'Job Description'
    }];

    component.loadingPreviousAssociations = false;
    component.loadingPreviousAssociationsSuccess = true;
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should show No Associations instead of the table if there are no jobs', () => {
    component.companyJobs = [];
    component.previousAssociations = [];

    component.loadingPreviousAssociations = false;
    component.loadingPreviousAssociationsSuccess = true;
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should render the table if there are only company jobs', () => {
    component.companyJobs = [{
      JobCode: '001',
      CompanyJobId: 1,
      JobFamily: 'Family',
      IsAssociated: false,
      JobTitle: 'Job Title',
      JobDescription: 'Job Description'
    }];
    component.previousAssociations = [];

    component.loadingPreviousAssociations = false;
    component.loadingPreviousAssociationsSuccess = true;
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should render the table if there are only previous associations', () => {
    component.companyJobs = [];
    component.previousAssociations = [{
      JobCode: '001',
      CompanyJobId: 1,
      JobFamily: 'Family',
      IsAssociated: false,
      JobTitle: 'Job Title',
      JobDescription: 'Job Description'
    }];

    component.loadingPreviousAssociations = false;
    component.loadingPreviousAssociationsSuccess = true;
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should render different messaging if there was an error', () => {
    component.companyJobs = [];
    component.previousAssociations = [];
    component.loadingPreviousAssociations = false;
    component.loadingPreviousAssociationsSuccess = false;
    component.loadingPreviousAssociationsError = true;
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });
});
