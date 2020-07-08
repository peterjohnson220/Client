import * as cloneDeep from 'lodash.clonedeep';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import * as fromCommunityAttachmentsReducer from '../../reducers';
import * as fromCommunityAttachmentsActions from '../../actions/community-attachment.actions';
import { CommunityAttachment } from 'libs/models/community/community-attachment.model';
import { FileRestrictions, SuccessEvent, UploadEvent, FileInfo, SelectEvent, RemoveEvent } from '@progress/kendo-angular-upload';
import { mapFileInfoToCommunityAddAttachment, formatBytes } from '../../helpers/model-mapping.helper';
import { CommunityFiles } from '../../constants/community-files';
import { CommunityAttachmentModalState, CommunityAttachmentUploadStatus } from 'libs/models';

@Component({
  selector: 'pf-community-attachment-modal',
  templateUrl: './community-attachment-modal.component.html',
  styleUrls: [ './community-attachment-modal.component.scss' ]
})
export class CommunityAttachmentModalComponent implements OnInit {
  currentAttachmentModalState$: Observable<CommunityAttachmentModalState>;
  currentAttachmentModalOpen$: Observable<boolean>;

  uploadedFilesKendo: Array<FileInfo>;
  uploadedFiles: CommunityAttachment[] = [];
  saveAttachmentUrl = '/odata/CloudFiles.UploadCommunityAttachment';
  removeAttachmentUrl = '/odata/CloudFiles.DeleteCommunityAttachment';
  maxFileCount = 5;
  showFileCountWarning = false;
  currentCommunityAttachmentModal: CommunityAttachmentModalState;
  communityAttachmentUploadStatus = CommunityAttachmentUploadStatus;

  @ViewChild('uploadWidget', { static: true }) uploadWidget: any;

  public uploadRestrictions: FileRestrictions = {
    allowedExtensions: CommunityFiles.VALID_FILE_EXTENSIONS,
    maxFileSize: CommunityFiles.MAX_SIZE_LIMIT
  };

  get fileRestrictionsMessage() {
    const formattedSize = formatBytes(CommunityFiles.MAX_SIZE_LIMIT);
    let message = `Individual files cannot exceed ${formattedSize}. Accepted file types: `;
    CommunityFiles.VALID_FILE_EXTENSIONS.forEach(extension => {
      message = `${message} ${extension}`;
    });
    return message;
   }

   formattedBytes(bytes) {
     return formatBytes(bytes);
   }

  constructor(public store: Store<fromCommunityAttachmentsReducer.State>) {
    this.currentAttachmentModalState$ = this.store.select(fromCommunityAttachmentsReducer.getCurrentAttachmentModalState);
    this.currentAttachmentModalOpen$ = this.store.select(fromCommunityAttachmentsReducer.getCurrentAttachmentModalOpen);
  }

  ngOnInit() {
    this.currentAttachmentModalState$.subscribe((response) => {
      if (response) {
        this.currentCommunityAttachmentModal = response;
        this.uploadedFiles = cloneDeep(response.Attachments);
        this.updateUploadButtonState();
      }
    });

    this.currentAttachmentModalOpen$.subscribe((response) => {
      if (response) {
        this.uploadedFilesKendo = [];
        this.uploadedFiles.forEach(file => {
          this.uploadedFilesKendo.push({name: file.Name, size: file.Size, uid: file.Id});
        });
      }
    });
  }

  updateUploadButtonState() {
    if (this.uploadedFiles.length >= this.maxFileCount) {
      const buttonElement = this.uploadWidget.wrapper.getElementsByClassName('k-upload-button');
      buttonElement[0].classList.add('k-state-disabled');
    } else {
      const buttonElement = this.uploadWidget.wrapper.getElementsByClassName('k-upload-button');
      buttonElement[0].classList.remove('k-state-disabled');
    }
  }

  handleModalDismissed() {
    this.showFileCountWarning = false;
    this.store.dispatch(new fromCommunityAttachmentsActions.CloseCommunityAttachmentsModal(this.currentCommunityAttachmentModal.Id));
  }

  selectEventHandler(e: SelectEvent): void {
    e.files.forEach((file) => {
      if (file.validationErrors && file.validationErrors.includes('invalidFileExtension')) {
        const cloudFileName = `${file.uid}_${file.name}`;
        const fileToUpload = mapFileInfoToCommunityAddAttachment(file, cloudFileName);
        fileToUpload.Status = CommunityAttachmentUploadStatus.InvalidExtension;
        this.uploadedFiles.push(fileToUpload);
      }
    });
  }

  uploadAttachmentEventHandler(e: UploadEvent) {
    if (this.uploadedFiles.length >= this.maxFileCount) {
      e.preventDefault();
      this.showFileCountWarning = true;
      return;
    }

    const file = e.files[ 0 ];
    const cloudFileName = `${file.uid}_${file.name}`;
    e.data = { CloudFileName: cloudFileName, Id: file.uid };

    const fileToUpload = mapFileInfoToCommunityAddAttachment(file, cloudFileName);
    fileToUpload.Status = CommunityAttachmentUploadStatus.UploadInProgress;
    this.uploadedFiles.push(fileToUpload);

    this.currentCommunityAttachmentModal.Attachments = this.uploadedFiles;
    this.store.dispatch(new fromCommunityAttachmentsActions.SaveCommunityAttachmentsState(this.currentCommunityAttachmentModal));
  }

  removeEventHandler(e: RemoveEvent) {
    e.data = { uid: e.files[0].uid };
  }

  removeAttachmentEventHandler(file: FileInfo) {
    const index = this.uploadedFiles.findIndex(f => f.Id === file.uid);
    if (index >= 0) {
      this.uploadedFiles.splice(index, 1);
      this.showFileCountWarning = false;
    }

    this.uploadWidget.removeFilesByUid(file.uid);

    this.currentCommunityAttachmentModal.Attachments = this.uploadedFiles;
    this.store.dispatch(new fromCommunityAttachmentsActions.SaveCommunityAttachmentsState(this.currentCommunityAttachmentModal));
  }

  successEventHandler(e: SuccessEvent) {
    // successEventHandler gets fired multiple times for the remove operation with the latest call having a response.type of 4
    if (e.operation === 'upload' || (e.operation === 'remove' && e.response.type === 4)) {
      const uploadedFile = this.uploadedFiles.find(f => f.Id === e.files[0].uid);
      if (uploadedFile) {
        uploadedFile.Status = CommunityAttachmentUploadStatus.ScanInProgress; // scan in progress now...
        this.currentCommunityAttachmentModal.Attachments = this.uploadedFiles;
        this.store.dispatch(new fromCommunityAttachmentsActions.SaveCommunityAttachmentsState(this.currentCommunityAttachmentModal));
      }

      if (this.uploadedFiles.length >= this.maxFileCount) {
        this.showFileCountWarning = true;
      }
    }
  }

  errorEventHandler(e: any) {
    if (this.uploadedFiles.length >= this.maxFileCount) {
      e.preventDefault();
    }

    const uploadedFile = this.uploadedFiles.find(f => f.Id === e.files[0].uid);
    if (uploadedFile) {
      uploadedFile.Status = CommunityAttachmentUploadStatus.UploadFailed;
    }
    this.currentCommunityAttachmentModal.Attachments = this.uploadedFiles;
    this.store.dispatch(new fromCommunityAttachmentsActions.SaveCommunityAttachmentsState(this.currentCommunityAttachmentModal));

  }

  getUploadStatus(file: FileInfo) {
    const attachment = this.uploadedFiles.find(f => f.Id === file.uid);
    if (attachment) {
      return attachment.Status;
    }
    return CommunityAttachmentUploadStatus.NotStarted;
  }

  getStatusClass(file: FileInfo) {
    const attachment = this.uploadedFiles.find(f => f.Id === file.uid);
    if (!attachment) {
      return 'upload-in-progress';
    }

    switch (attachment.Status) {
      case CommunityAttachmentUploadStatus.ScanSucceeded:
        return 'upload-success';
      case CommunityAttachmentUploadStatus.UploadFailed:
      case CommunityAttachmentUploadStatus.ScanFailed:
      case CommunityAttachmentUploadStatus.InvalidExtension:
        return 'upload-failed';
      default:
        return 'upload-in-progress';
    }
  }

}
