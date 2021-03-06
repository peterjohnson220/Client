import { Component, Input, OnInit, OnDestroy, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Store } from '@ngrx/store';
import { Subscription, Observable } from 'rxjs';

import { ValidateExchangeJobsRequest, ImportExchangeJobsRequest, ValidationResultItem } from 'libs/models';

import * as fromImportExchangeJobActions from '../../actions/import-exchange-jobs.actions';
import * as fromPeerAdminReducer from '../../reducers';

@Component({
  selector: 'pf-import-exchange-jobs-modal',
  templateUrl: './import-exchange-jobs-modal.component.html',
  styleUrls: ['./import-exchange-jobs-modal.component.scss']
})
export class ImportExchangeJobsModalComponent implements OnInit, OnDestroy {
  uploadingFile$: Observable<boolean>;
  uploadingFileError$: Observable<boolean>;
  validationResults$: Observable<ValidationResultItem[]>;
  importingExchangeJobs$: Observable<boolean>;
  storedDataFileSubscription: Subscription;
  isFileValidSubscription: Subscription;
  importExchangeJobsForm: FormGroup;
  attemptedSubmit = false;
  storedDataFile: string;
  isFileValid: boolean;
  currentFile: any;

  @Input() exchangeId: number;
  @Input() isOpen$: Observable<boolean>;
  @Output() importExchangeJobsEvent = new EventEmitter();
  @Output() modalDismissedEvent = new EventEmitter();

  constructor(private store: Store<fromPeerAdminReducer.State>, private formBuilder: FormBuilder) {
    this.uploadingFile$ = this.store.select(fromPeerAdminReducer.getImportExchangeJobsUploadingFile);
    this.uploadingFileError$ = this.store.select(fromPeerAdminReducer.getImportExchangeJobsUploadingFileError);
    this.validationResults$ = this.store.select(fromPeerAdminReducer.getValidationResults);
    this.importingExchangeJobs$ = this.store.select(fromPeerAdminReducer.getImportingJobs);
  }

  createForm(): void {
    this.importExchangeJobsForm = this.formBuilder.group({
      'fileUpload': ['', false], // Needed so the file upload is part of the form and can be reset on dismiss.
      'isFileValid': ['', [Validators.requiredTrue]] // Reactive forms do not support file uploads, uses a hidden input.
    });
  }

  fileChanged(event) {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      this.currentFile = fileList[ 0 ];
      this.dispatchUploadingFileAction();
    } else {
      this.store.dispatch(new fromImportExchangeJobActions.FileCleared());
    }
  }

  handleUploadingFileErrorRetry(): void {
    this.dispatchUploadingFileAction();
  }

  dispatchUploadingFileAction(): void {
    const validateExchangeJobsRequest: ValidateExchangeJobsRequest = {
      ExchangeId: this.exchangeId,
      File: this.currentFile
    };
    this.store.dispatch(new fromImportExchangeJobActions.UploadingFile(validateExchangeJobsRequest));
  }

  handleFormSubmit(): void {
    this.attemptedSubmit = true;
    const importExchangeJobsRequest: ImportExchangeJobsRequest = {
      ExchangeId: this.exchangeId,
      StoredDataFile: this.storedDataFile
    };
    this.store.dispatch(new fromImportExchangeJobActions.ImportingExchangeJobs(importExchangeJobsRequest));
  }

  handleModalDismissed(): void {
    this.attemptedSubmit = false;
    this.importExchangeJobsForm.reset();
    this.store.dispatch(new fromImportExchangeJobActions.FileCleared());
    this.modalDismissedEvent.emit();
  }

  ngOnInit(): void {
    this.createForm();

    this.storedDataFileSubscription = this.store.select(fromPeerAdminReducer.getStoredDataFile).subscribe(sd =>
      this.storedDataFile = sd
    );
    this.isFileValidSubscription = this.store.select(fromPeerAdminReducer.getIsFileValid).subscribe(isFileValid =>
      this.isFileValid = isFileValid
    );
  }

  ngOnDestroy(): void {
    this.storedDataFileSubscription.unsubscribe();
    this.isFileValidSubscription.unsubscribe();
  }
}
