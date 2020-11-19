import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { FileInfo, FileRestrictions, SelectEvent, SuccessEvent } from '@progress/kendo-angular-upload';
import { Store } from '@ngrx/store';

import { UserTicketFile } from 'libs/models/payfactors-api/service/response';
import { UploadedFile } from 'libs/models/service';
import { Files } from 'libs/constants';

import * as fromServicePageReducer from '../../reducers';
import * as fromServicePageActions from '../../actions/service-page.actions';
import { ServicePageConfig, AttachmentFileType } from '../../models';

@Component({
  selector: 'pf-ticket-attachments',
  templateUrl: './ticket-attachments.component.html',
  styleUrls: ['./ticket-attachments.component.scss']
})
export class TicketAttachmentsComponent implements OnChanges {
  @Input() ticketId: string;
  @Input() attachments: UserTicketFile[];
  @Input() canAddAttachments: boolean;
  @Input() isTicketClosed: boolean;

  fileUploadMax = ServicePageConfig.MaxFileUploads;
  uploadedFilesData: UploadedFile[] = [];
  errorMessage = '';
  uploadError = false;
  sameFileErrorMessage = '';
  attachmentFileType = AttachmentFileType;
  uploadRestrictions: FileRestrictions = {
    allowedExtensions: Files.VALID_FILE_EXTENSIONS,
    maxFileSize: Files.MAX_SIZE_LIMIT
  };
  uploadSaveUrl: string;

  constructor(private store: Store<fromServicePageReducer.State>) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (!!changes && changes.ticketId && changes.ticketId.currentValue !== changes.ticketId.previousValue) {
      this.reset();
    }
  }

  onFileSelect(e: SelectEvent) {
    this.uploadError = false;
    this.validateSelectedFiles(e.files);
    if (this.uploadError) {
      e.preventDefault();
    }
  }

  handleUploadSuccess(event: SuccessEvent): void {
    this.uploadedFilesData = [];
    const ticketFiles: UserTicketFile[] = event.response.body;
    this.store.dispatch(new fromServicePageActions.AddAttachmentsSuccess(ticketFiles));
  }

  private reset(): void {
    this.errorMessage = '';
    this.uploadedFilesData = [];
    this.uploadSaveUrl = `${ServicePageConfig.AddAttachmentUrl}/${this.ticketId}`;
  }

  private validateSelectedFiles(files: FileInfo[]): void {
    const hasMatchingFileNames = files.find(f1 => this.attachments.some(f2 => f1.name === f2.DisplayName));

    if (hasMatchingFileNames) {
      this.uploadError = true;
      this.errorMessage = '';
      this.sameFileErrorMessage = 'Upload contains file(s) with existing names. Please rename your file(s) and try again.';
      return;
    }

    if (files.length > this.fileUploadMax - this.attachments.length) {
      this.uploadError = true;
      this.sameFileErrorMessage = '';
      this.errorMessage = 'The maximum number of files is ' + this.fileUploadMax + '.';
    }
  }
}
