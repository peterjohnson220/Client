import { AssociatedCompanyJobsComponent } from './associated-company-jobs-component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { generateMockCompanyJob } from '../../models';

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
    component.newAssociations = [generateMockCompanyJob()];
    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
  });

  it('handleRemoveNewAssociate triggers removeNewAssociation output', (done) => {
    component.newAssociations = [generateMockCompanyJob()];

    component.removeNewAssociation.subscribe(r => {
      expect(r).toEqual(1);
      done();
    });

    component.handleRemoveNewAssociate(1);
  });

  it('should show jobs after loading successfully', () => {
    component.newAssociations = [generateMockCompanyJob()];

    component.loadingPreviousAssociations = false;
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should show No Associations instead of the table if there are no jobs', () => {
    component.newAssociations = [];
    component.previousAssociations = [];

    component.loadingPreviousAssociations = false;
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should render the table if there are only company jobs', () => {
    component.newAssociations = [generateMockCompanyJob()];
    component.previousAssociations = [];

    component.loadingPreviousAssociations = false;
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should render the table if there are only previous associations', () => {
    component.newAssociations = [];
    component.previousAssociations = [generateMockCompanyJob()];

    component.loadingPreviousAssociations = false;
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should render different messaging if there was an error', () => {
    component.newAssociations = [];
    component.previousAssociations = [];
    component.loadingPreviousAssociations = false;
    component.loadingPreviousAssociationsError = true;
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });
});
