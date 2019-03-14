import { AssociatedCompanyJobsComponent } from './associated-company-jobs-component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('AssociatedCompanyJobsComponent', () => {
  let component: AssociatedCompanyJobsComponent;
  let fixture: ComponentFixture<AssociatedCompanyJobsComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [AssociatedCompanyJobsComponent],
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
      JobTitle: 'Job Title'}];
    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
  });

  it('handleRemoveAssociate triggers removeAssociation output', (done) => {
    component.companyJobs = [{
      JobCode: '001',
      CompanyJobId: 1,
      JobFamily: 'Family',
      IsAssociated: false,
      JobTitle: 'Job Title'}];

    component.removeAssociation.subscribe(r => {
      expect(r).toEqual(1);
      done();
    });

    component.handleRemoveAssociate(1);
  });
});
