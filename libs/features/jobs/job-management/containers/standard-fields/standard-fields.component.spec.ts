import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { FormControlName } from '@angular/forms';


import { provideMockStore, MockStore } from '@ngrx/store/testing';

import { PfFormsModule } from 'libs/forms';
import { PfCommonModule } from 'libs/core';

import * as fromActions from '../../actions';
import * as fromReducer from '../../reducers';

import { StandardFieldsComponent } from './standard-fields.component';

describe('Job Management Feature - Job Form', () => {
  let instance: StandardFieldsComponent;
  let fixture: ComponentFixture<StandardFieldsComponent>;

  let store: MockStore<fromReducer.State>;

  const initialState = {
    loading: false,
    showJobForm: false,
    companyJob: null,
    companyFlsaStatuses: ['Exempt', 'Non Exempt'],
    jobFamilies: ['Family_1', 'Family_2'],
    companyJobUdfs: null,
    saving: false,
    duplicateJobCodeError: true,
    errorMessage: '',
  };


  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        PfFormsModule,
        PfCommonModule
      ],
      providers: [
        provideMockStore({ initialState }),
        {
          provide: FormControlName,
          useValue: jest.fn()
        }
      ],
      declarations: [
        StandardFieldsComponent
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(StandardFieldsComponent);
    instance = fixture.componentInstance;

    store = TestBed.inject(MockStore);
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
    const expectedAction = new fromActions.UpdateStandardFields(form.value);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('Empty form should not be valid', () => {
    const form = instance.jobForm;

    expect(form.valid).toEqual(false);
  });

  it('Form should be valid', () => {
    const form = instance.jobForm;
    const c = instance.jobForm.controls;

    const tooLongValueJobCodeFLSA = Array(instance.JOB_CODE_FLSA_MAX_LENGTH + 1).fill('a').join('');
    const tooLongValue = Array(instance.DEFAULT_MAX_LENGTH + 1).fill('a').join('');

    // JobCode
    expect(c.JobCode.valid).toEqual(false);
    c.JobCode.setValue(tooLongValueJobCodeFLSA);
    expect(c.JobCode.valid).toEqual(false);
    c.JobCode.setValue('1111');
    expect(c.JobCode.valid).toEqual(true);

    // FSLA Status
    expect(c.FLSAStatus.valid).toEqual(true);
    c.FLSAStatus.setValue(tooLongValueJobCodeFLSA);
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

  });

});
