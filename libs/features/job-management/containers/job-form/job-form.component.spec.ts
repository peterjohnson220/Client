
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';

import { PfFormsModule } from 'libs/forms';

import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { Store } from '@ngrx/store';

import * as fromActions from '../../actions';
import * as fromReducer from '../../reducers';

import { JobFormComponent } from './job-form.component';


describe('Job Management Feature - Job Form', () => {
  let instance: JobFormComponent;
  let fixture: ComponentFixture<JobFormComponent>;

  let store: MockStore<fromReducer.State>;

  const initialState = {
    loading: false,
    showJobForm: false,
    companyJob: null,
    companyFlsaStatuses: ['Exempt', 'Non Exempt'],
    jobFamilies: ['Family_1', 'Family_2'],
    companyJobUdfs: [
      { ColumnName: 'UDF1', DispName: 'UDF1' },
      { ColumnName: 'UDF2', DispName: 'UDF2' },
    ],
    saving: false,
    duplicateJobCodeError: true,
    errorMessage: '',
  };


  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        PfFormsModule
      ],
      providers: [
        provideMockStore({ initialState }),
      ],
      declarations: [
        JobFormComponent
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobFormComponent);
    instance = fixture.componentInstance;

    store = TestBed.get(Store);
    store.overrideSelector(fromReducer.getCompanyJobUdfs, initialState.companyJobUdfs);

    spyOn(store, 'dispatch');

    fixture.detectChanges();
  });

  it('Should display form', () => {
    expect(fixture).toMatchSnapshot();
  });

  it('Should dispatch the LoadJobOptions action on init', () => {
    const form = instance.jobForm;
    form.controls.JobCode.setValue('1111');
    const expectedAction = new fromActions.UpdateCompanyJob(form.value);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('Empty form should not be valid', () => {
    const form = instance.jobForm;

    expect(form.valid).toEqual(false);
  });

  it('Form should be valid', fakeAsync(() => {
    const form = instance.jobForm;
    const c = instance.jobForm.controls;

    const tooLongValueJobCodeFSLA = Array(instance.JOB_CODE_FLSA_MAX_LENGTH).fill('a').join();
    const tooLongValue = Array(instance.DEFAULT_MAX_LENGTH).fill('a').join();

    // JobCode
    expect(c.JobCode.valid).toEqual(false);
    c.JobCode.setValue(tooLongValueJobCodeFSLA);
    expect(c.JobCode.valid).toEqual(false);
    c.JobCode.setValue('1111');
    expect(c.JobCode.valid).toEqual(true);

    // FSLA Status
    expect(c.FLSAStatus.valid).toEqual(true);
    c.FLSAStatus.setValue(tooLongValueJobCodeFSLA);
    expect(c.FLSAStatus.valid).toEqual(false);
    c.FLSAStatus.setValue('Exempt');
    expect(c.FLSAStatus.valid).toEqual(true);

    // JobTitle
    expect(c.JobTitle.valid).toEqual(false);
    c.JobTitle.setValue(tooLongValue);
    expect(c.JobTitle.valid).toEqual(false);
    c.JobTitle.setValue('Software Engineer');
    expect(c.JobTitle.valid).toEqual(true);

    // JobLevel
    expect(c.JobTitle.valid).toEqual(true);
    c.JobTitle.setValue(tooLongValue);
    expect(c.JobTitle.valid).toEqual(false);
    c.JobTitle.setValue('Level 3');
    expect(c.JobTitle.valid).toEqual(true);

    // JobLevel
    expect(c.JobFamily.valid).toEqual(true);
    c.JobFamily.setValue(tooLongValue);
    expect(c.JobFamily.valid).toEqual(false);
    c.JobFamily.setValue('Accounting');
    expect(c.JobFamily.valid).toEqual(true);

    // UDF1
    expect(c.UDF1.valid).toEqual(true);
    c.UDF1.setValue(tooLongValue);
    expect(c.UDF1.valid).toEqual(false);
    c.UDF1.setValue('UDF1 test value');
    expect(c.UDF1.valid).toEqual(true);

    // UDF2
    expect(c.UDF2.valid).toEqual(true);
    c.UDF2.setValue(tooLongValue);
    expect(c.UDF2.valid).toEqual(false);
    c.UDF2.setValue('UDF2 test value');
    expect(c.UDF2.valid).toEqual(true);

  }));

});
