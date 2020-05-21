import * as cloneDeep from 'lodash.clonedeep';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import * as fromCommunityAttachmentsReducer from '../../reducers';
import * as fromCommunityAttachmentsActions from '../../actions/community-attachment.actions';
import { CommunityAttachment } from 'libs/models/community/community-attachment.model';
import { FileRestrictions, RemoveEvent, SuccessEvent, UploadEvent, FileInfo } from '@progress/kendo-angular-upload';
import { mapFileInfoToCommunityAddAttachment, formatBytes } from '../../helpers/model-mapping.helper';
import { CommunityFiles } from '../../constants/community-files';
import { CommunityAttachmentModalState } from 'libs/models';

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

  constructor(public store: Store<fromCommunityAttachmentsReducer.State>) {
    this.currentAttachmentModalState$ = this.store.select(fromCommunityAttachmentsReducer.getCurrentAttachmentModalState);
    this.currentAttachmentModalOpen$ = this.store.select(fromCommunityAttachmentsReducer.getCurrentAttachmentModalOpen);
  }

  ngOnInit() {
    this.currentAttachmentModalState$.subscribe((response) => {
      if (response) {
        this.currentCommunityAttachmentModal = response;
        this.uploadedFiles = cloneDeep(response.Attachments);
      }
    });

    this.currentAttachmentModalOpen$.subscribe((response) => {
      if (response) {
        this.uploadedFilesKendo = [];
        this.uploadedFiles.forEach(file => {
          this.uploadedFilesKendo.push({name: file.Name, size: file.Size});
        });
      }
    });
  }

  updateUploadButtonState(uploadWidget) {
    if (this.uploadedFiles.length >= this.maxFileCount) {
      const buttonElement = uploadWidget.wrapper.getElementsByClassName('k-upload-button');
      buttonElement[0].classList.add('k-state-disabled');
    } else {
      const buttonElement = uploadWidget.wrapper.getElementsByClassName('k-upload-button');
      buttonElement[0].classList.remove('k-state-disabled');
    }
   }

  handleModalDismissed() {
    this.showFileCountWarning = false;
    this.store.dispatch(new fromCommunityAttachmentsActions.CloseCommunityAttachmentsModal(this.currentCommunityAttachmentModal.Id));
  }

  uploadAttachmentEventHandler(e: UploadEvent, uploadWidget) {
    if (this.uploadedFiles.length >= this.maxFileCount) {
      e.preventDefault();
      this.showFileCountWarning = true;
      return;
    }

    const file = e.files[ 0 ];
    const cloudFileName = `${file.uid}_${file.name}`;
    e.data = { CloudFileName: cloudFileName };
    this.uploadedFiles.push(mapFileInfoToCommunityAddAttachment(file, cloudFileName));

    this.updateUploadButtonState(uploadWidget);
  }

  removeAttachmentEventHandler(e: RemoveEvent, uploadWidget) {
    const file = e.files[ 0 ];
    const index = this.uploadedFiles.findIndex(f => f.Name === file.name && f.Size === file.size);
    if (index >= 0) {
      this.uploadedFiles.splice(index, 1);
      this.showFileCountWarning = false;
    }

    this.updateUploadButtonState(uploadWidget);
  }

  successEventHandler(e: SuccessEvent, uploadWidget) {
    // successEventHandler gets fired multiple times for the remove operation with the latest call having a response.type of 4
    if (e.operation === 'upload' || (e.operation === 'remove' && e.response.type === 4)) {
      this.currentCommunityAttachmentModal.Attachments = this.uploadedFiles;
      this.store.dispatch(new fromCommunityAttachmentsActions.SaveCommunityAttachmentsState(this.currentCommunityAttachmentModal));

      if (this.uploadedFiles.length >= this.maxFileCount) {
        this.showFileCountWarning = true;
        this.updateUploadButtonState(uploadWidget);
      }
    }
  }

  uploadError(e: ErrorEvent) {
    if (this.uploadedFiles.length >= this.maxFileCount) {
      e.preventDefault();
    }
  }
}
