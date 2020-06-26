import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';

import { PfCommonModule } from 'libs/core';

import { JobDescriptionSummaryEditorComponent } from './job-description-summary-editor.component';

describe('Job Management Feature - Job Form', () => {
  let instance: JobDescriptionSummaryEditorComponent;
  let fixture: ComponentFixture<JobDescriptionSummaryEditorComponent>;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        FormsModule,
        PfCommonModule
      ],
      providers: [],
      declarations: [
        JobDescriptionSummaryEditorComponent
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobDescriptionSummaryEditorComponent);
    instance = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('Should display form', () => {
    const form = instance.jobDescriptionForm;
    const c = instance.jobDescriptionForm.controls;

    c.JobDescription.setValue('This is a test description');

    expect(fixture).toMatchSnapshot();
  });

  it('Form should be valid', fakeAsync(() => {
    const form = instance.jobDescriptionForm;
    const c = instance.jobDescriptionForm.controls;

    const tooShortValue = Array(instance.JOB_SUMMARY_MIN_LENGTH).fill('a').join('');

    // JobDescription
    expect(c.JobDescription.valid).toEqual(true);
    c.JobDescription.setValue(tooShortValue);
    expect(c.JobDescription.valid).toEqual(false);
    c.JobDescription.setValue('JobDescription test value');
    expect(c.JobDescription.valid).toEqual(true);

  }));

});
