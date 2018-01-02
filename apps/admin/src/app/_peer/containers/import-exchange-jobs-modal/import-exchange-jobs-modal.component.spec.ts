import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TestBed, ComponentFixture } from '@angular/core/testing';

import { combineReducers, Store, StoreModule } from '@ngrx/store';

import { ValidateExchangeJobsRequest, ImportExchangeJobsRequest, ExchangeJobsValidationResultModel } from 'libs/models/peer';
import { ValidationResultItemTypeEnum } from 'libs/models/common';
import * as fromRootState from 'libs/state/state';

import { ImportExchangeJobsModalComponent } from './import-exchange-jobs-modal.component';
import * as fromImportExchangeJobActions from '../../actions/import-exchange-jobs.actions';
import * as fromPeerAdminReducer from '../../reducers';

describe('Import Exchange Jobs Modal', () => {
  let fixture: ComponentFixture<ImportExchangeJobsModalComponent>;
  let instance: ImportExchangeJobsModalComponent;
  let store: Store<fromRootState.State>;

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          peerAdmin: combineReducers(fromPeerAdminReducer.reducers)
        }),
        ReactiveFormsModule
      ],
      declarations: [
        ImportExchangeJobsModalComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.get(Store);

    fixture = TestBed.createComponent(ImportExchangeJobsModalComponent);
    instance = fixture.componentInstance;
  });

  it('should initialize an empty modal', () => {
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should dispatch a FileCleared action when handleModalDismissed is called', () => {
    spyOn(store, 'dispatch');
    const action = new fromImportExchangeJobActions.FileCleared();

    instance.handleModalDismissed();

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  it('should dispatch a FileCleared action when the file is changed to nothing', () => {
    spyOn(store, 'dispatch');
    const action = new fromImportExchangeJobActions.FileCleared();

    instance.fileChanged({ target: { files: [] }});

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  it('should dispatch a UploadingFile action when the file is changed to a new file', () => {
    spyOn(store, 'dispatch');
    const mockFileChangeEvent = { target: { files: [ { File: {} }] }};
    const expectedValidateExchangeJobsRequest: ValidateExchangeJobsRequest = {
      ExchangeId: undefined,
      File: mockFileChangeEvent.target.files[0]
    };
    const action = new fromImportExchangeJobActions.UploadingFile(expectedValidateExchangeJobsRequest);

    instance.fileChanged(mockFileChangeEvent);

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  it('should dispatch a ImportExchangeJobs action when submitted', () => {
    spyOn(store, 'dispatch');
    instance.exchangeId = 1;
    instance.storedDataFile = '';
    const mockImportExchangeJobsRequest: ImportExchangeJobsRequest = {
      ExchangeId: 1,
      StoredDataFile: ''
    };
    const action = new fromImportExchangeJobActions.ImportingExchangeJobs(mockImportExchangeJobsRequest);

    instance.handleFormSubmit();

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  it('should create an empty form', () => {
    instance.createForm();

    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
  });

  it('should clear the form when dismiss is called', () => {
    instance.createForm();
    instance.importExchangeJobsForm.controls['fileUpload'].setValue('invalid value');
    instance.importExchangeJobsForm.controls['isFileValid'].setValue('invalid value');
    instance.handleModalDismissed();

    fixture.detectChanges()
    expect(fixture).toMatchSnapshot();
  });

  it('should set attemptedSubmit correctly', () => {
    expect(instance.attemptedSubmit).toBe(false);
    instance.handleFormSubmit();
    expect(instance.attemptedSubmit).toBe(true);
    instance.handleModalDismissed();
    expect(instance.attemptedSubmit).toBe(false);
  });

  it('should set the file to valid when the state changes', () => {
    const exchangeJobsValidationResultModel: ExchangeJobsValidationResultModel  = {
      StoredDataFile: 'test',
      ValidationResults: [{
        Type: ValidationResultItemTypeEnum.Info,
        Message: 'test'
      }]
    };
    const action = new fromImportExchangeJobActions.UploadingFileSuccess(exchangeJobsValidationResultModel);
    store.dispatch(action);
    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
  });

  it('should set the file to invalid when the state changes', () => {
    const exchangeJobsValidationResultModel: ExchangeJobsValidationResultModel  = {
      StoredDataFile: null,
      ValidationResults: [{
        Type: ValidationResultItemTypeEnum.Error,
        Message: 'test'
      }]
    };
    const action = new fromImportExchangeJobActions.UploadingFileSuccess(exchangeJobsValidationResultModel);
    store.dispatch(action);
    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
  });
});
