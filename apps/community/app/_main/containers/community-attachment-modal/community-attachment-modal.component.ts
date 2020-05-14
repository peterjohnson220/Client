import * as cloneDeep from 'lodash.clonedeep';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import * as fromCommunityAttachmentsReducer from '../../reducers';
import * as fromCommunityAttachmentsActions from '../../actions/community-attachment.actions';
import { CommunityAttachment } from 'libs/models/community/community-attachment.model';
import { FileRestrictions, RemoveEvent, SuccessEvent, UploadEvent } from '@progress/kendo-angular-upload';
import { mapFileInfoToCommunityAddAttachment } from '../../helpers/model-mapping.helper';
import { CommunityFiles } from '../../constants/community-files';

@Component({
  selector: 'pf-community-attachment-modal',
  templateUrl: './community-attachment-modal.component.html',
  styleUrls: [ './community-attachment-modal.component.scss' ]
})
export class CommunityAttachmentModalComponent implements OnInit {
  communityAttachmentModalOpen$: Observable<any>;
  communityAttachments$: Observable<CommunityAttachment[]>;
  uploadedFiles: CommunityAttachment[] = [];
  uploadedFilesKendo: any;
  saveAttachmentUrl = '/odata/CloudFiles.UploadCommunityAttachment';
  removeAttachmentUrl = '/odata/CloudFiles.DeleteCommunityAttachment';
  maxFileCount = 5;
  showFileCountWarning = false;

  public uploadRestrictions: FileRestrictions = {
    allowedExtensions: CommunityFiles.VALID_FILE_EXTENSIONS,
    maxFileSize: CommunityFiles.MAX_SIZE_LIMIT
  };

  constructor(public store: Store<fromCommunityAttachmentsReducer.State>) {
    this.communityAttachmentModalOpen$ = this.store.select(fromCommunityAttachmentsReducer.getShowCommunityAttachmentsModal);
    this.communityAttachments$ = this.store.select(fromCommunityAttachmentsReducer.getCommunityAttachments);
  }

  ngOnInit() {
    this.communityAttachments$.subscribe((response) => {
      if (response) {
        this.uploadedFiles = cloneDeep(response);

        if (response.length === 0) {
          this.uploadedFilesKendo = null;
        }
      }
    });
  }

  handleModalDismissed() {
    this.showFileCountWarning = false;
    this.store.dispatch(new fromCommunityAttachmentsActions.CloseCommunityAttachmentsModal());
  }

  uploadAttachmentEventHandler(e: UploadEvent) {
    if (this.uploadedFiles.length >= this.maxFileCount) {
      e.preventDefault();
      this.showFileCountWarning = true;
      return;
    }

    const file = e.files[ 0 ];
    const cloudFileName = `${file.uid}_${file.name}`;
    e.data = { CloudFileName: cloudFileName };
    this.uploadedFiles.push(mapFileInfoToCommunityAddAttachment(file, cloudFileName));
  }

  removeAttachmentEventHandler(e: RemoveEvent) {
    const file = e.files[ 0 ];
    file.name = `${file.uid}_${file.name}`;

    const index = this.uploadedFiles.findIndex(f => f.CloudFileName === file.name);
    if (index >= 0) {
      this.uploadedFiles.splice(index, 1);
      this.showFileCountWarning = false;
    }
  }

  successEventHandler(e: SuccessEvent) {
    // successEventHandler gets fired multiple times for the remove operation with the latest call having a response.type of 4
    if (e.operation === 'upload' || (e.operation === 'remove' && e.response.type === 4)) {
      this.store.dispatch(new fromCommunityAttachmentsActions.SaveCommunityAttachmentsState(this.uploadedFiles));
    }
  }

  uploadError(e: ErrorEvent) {
    if (this.uploadedFiles.length >= this.maxFileCount) {
      e.preventDefault();
    }
  }
}
