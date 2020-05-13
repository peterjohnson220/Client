import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';

import { PfFormsModule } from 'libs/forms';
import { PfCommonModule } from 'libs/core';

import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { Store } from '@ngrx/store';

import * as fromActions from '../../actions';
import * as fromReducer from '../../reducers';

import { UserDefinedFieldsComponent } from './user-defined-fields.component';


describe('Job Management Feature - Job Form', () => {
  let instance: UserDefinedFieldsComponent;
  let fixture: ComponentFixture<UserDefinedFieldsComponent>;

  let store: MockStore<fromReducer.State>;

  const initialState = {
    loading: false,
    showJobForm: false,
    companyJob: null,
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
        PfFormsModule,
        PfCommonModule
      ],
      providers: [
        provideMockStore({ initialState }),
      ],
      declarations: [
        UserDefinedFieldsComponent
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDefinedFieldsComponent);
    instance = fixture.componentInstance;

    store = TestBed.inject(MockStore);
    store.overrideSelector(fromReducer.getCompanyJobUdfs, initialState.companyJobUdfs);

    spyOn(store, 'dispatch');

    fixture.detectChanges();
  });

  it('Should display form', () => {
    expect(fixture).toMatchSnapshot();
  });

  it('Should dispatch the UpdateUserDefinedFields when updating values', () => {
    const form = instance.udfsForm;
    form.controls.UDF1.setValue('1111');
    const expectedAction = new fromActions.UpdateUserDefinedFields(form.value);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('Form should be valid', fakeAsync(() => {
    const form = instance.udfsForm;
    const c = instance.udfsForm.controls;

    const tooLongValue = Array(instance.DEFAULT_MAX_LENGTH).fill('a').join('');

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
