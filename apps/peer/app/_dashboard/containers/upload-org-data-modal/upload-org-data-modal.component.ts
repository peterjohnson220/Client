import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { UploadEvent, RemoveEvent, FileRestrictions, SelectEvent, SuccessEvent, FileInfo } from '@progress/kendo-angular-upload';

import { UploadedFile, UserTicketDto } from 'libs/models/service';

import * as fromPeerDashboardReducer from '../../reducers';

@Component({
  selector: 'pf-upload-org-data-modal',
  templateUrl: './upload-org-data-modal.component.html',
  styleUrls: ['./upload-org-data-modal.component.scss']
})

export class UploadOrgDataModalComponent implements OnInit {
  @Input() isOpen$: Observable<boolean>;
  @Output() uploadOrgDataEvent = new EventEmitter();
  @Output() modalDismissedEvent = new EventEmitter();

  successfulSubmit$: Observable<boolean>;
  uploadOrgDataForm: FormGroup;
  uploadFiles: Array<FileInfo>;
  uploadedFilesData: Array<UploadedFile> = [];
  secondaryButtonText = 'Cancel';
  uploadError = false;
  errorMessage = '';
  fileUploadMax = 5;
  submitted = false;

  uploadSaveUrl = '/odata/CloudFiles.UploadUserTicketAttachment';
  uploadRemoveUrl = '/odata/CloudFiles.DeleteUserTicketAttachments';

  public uploadRestrictions: FileRestrictions = {
    allowedExtensions: ['.xls', '.xlsx', '.csv']
  };

  constructor(private store: Store<fromPeerDashboardReducer.State>, private formBuilder: FormBuilder) {
    this.successfulSubmit$ = this.store.pipe(select(fromPeerDashboardReducer.getUploadOrgDataUploadingFileSuccess));
    this.createForm();
  }

  get descriptionPlaceholder(): string {
    return `Please provide a brief description of the file(s) you are uploading.`;
  }

  createForm(): void {
    this.uploadOrgDataForm = this.formBuilder.group({
      'fileUploadDescription': ['']
    });
  }

  handleModalDismissed(): void {
    this.uploadFiles = [];
    this.uploadedFilesData = [];
    this.secondaryButtonText = 'Cancel';
    this.uploadOrgDataForm.get('fileUploadDescription').disable();
    this.uploadOrgDataForm.reset();
    this.resetError();
    this.modalDismissedEvent.emit();
  }

  handleFormSubmit(): void {
    const userTicketDto: UserTicketDto = {
      UserTicketType: 'File Upload',
      UserTicketState: 'New',
      UserTicket: this.uploadOrgDataForm.get('fileUploadDescription').value,
      FileType: 'Organizational Data'
    };

    const uploadData = {
      UserTicket: userTicketDto,
      FileData: this.uploadedFilesData
    };

    this.uploadOrgDataEvent.emit(uploadData);

    this.uploadFiles = [];
    this.uploadedFilesData = [];
    this.uploadOrgDataForm.reset();
    this.uploadOrgDataForm.get('fileUploadDescription').disable();
    this.uploadOrgDataForm.markAsPristine();
    this.secondaryButtonText = 'Close';
    this.submitted = true;
  }

  // Upload events
  uploadEventHandler(e: UploadEvent) {
    this.resetError();
    this.uploadOrgDataForm.markAsTouched();
  }

  successEventHandler(e: SuccessEvent) {
    if (e.operation === 'upload') {
      const file: UploadedFile = {
        DisplayName: e.files[0].name,
        FileName: e.response.body.value[0].FileName
      };
      this.uploadedFilesData.push(file);
    } else if (e.operation === 'remove') {
      this.uploadedFilesData.forEach((arrayItem) => {
        if (arrayItem.FileName === e.files[0].name) {
          const index = this.uploadedFilesData.indexOf(arrayItem);
          this.uploadedFilesData.splice(index, 1);
        }
      });
      if (this.uploadedFilesData.length === 0) {
        this.uploadOrgDataForm.get('fileUploadDescription').disable();
        this.uploadOrgDataForm.markAsPristine();
      }
    }
    if (this.uploadedFilesData.length !== 0) {
      this.uploadOrgDataForm.get('fileUploadDescription').enable();
      this.uploadOrgDataForm.markAsTouched();
    }
  }

  onFileRemove(e: RemoveEvent) {
    this.uploadedFilesData.forEach((arrayItem) => {
      if (arrayItem.DisplayName === e.files[0].name) {
        e.files[0].name = arrayItem.FileName;
      }
    });
    this.resetError();
  }

  onFileSelect(e: SelectEvent) {
    this.submitted = false;
    if (e.files.length > this.fileUploadMax - this.uploadedFilesData.length) {
      this.uploadError = true;
      this.errorMessage = 'The maximum number of files is ' + this.fileUploadMax + '.';
      e.preventDefault();
    }
  }

  resetError(): void {
    this.uploadError = false;
    this.errorMessage = '';
  }

  ngOnInit(): void {
    this.uploadOrgDataForm.get('fileUploadDescription').disable();
  }
}
