import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommunityAttachment } from 'libs/models/community/community-attachment.model';
import { AttachmentFileType } from 'libs/models/common';
import { formatBytes } from 'libs/core/functions';
import { CommunityConstants } from '../../models/community-constants';
import * as fromCommunityFileDownloadSecurityWarningActions from '../../actions/community-file-download-security-warning.actions';
import { Store } from '@ngrx/store';
import * as fromCommunityReducers from '../../reducers';
import { DownloadTypeEnum } from '../../models/download-type.enum';

@Component({
  selector: 'pf-community-attachment',
  templateUrl: './community-attachment.component.html',
  styleUrls: ['./community-attachment.component.scss']
})
export class CommunityAttachmentComponent implements OnInit {
  @Input() attachment: CommunityAttachment;
  @Input() disableCommunityAttachments: boolean;
  @Input() hideAttachmentWarning: boolean;
  @Input() showFileDownloadSecurityWarning: boolean;
  @Output() onAttachmentClickedEvent = new EventEmitter<string>();

  readonly ATTACHMENT_DOWNLOAD_URL_PREFIX = '/odata/CloudFiles.DownloadCommunityAttachment?FileName=';

  iconClass: string;
  iconFile: string;
  formattedSize: string;

  disabledAttachmentMsg = CommunityConstants.DISABLED_ATTACHMENT_MESSAGE;
  maxNameSize = CommunityConstants.MAX_ATTACHMENT_NAME_LENGTH;

  constructor(public store: Store<fromCommunityReducers.State>) { }

  ngOnInit() {
    this.setupIcons();
    this.formattedSize = formatBytes(this.attachment.Size);
  }

  onAttachmentClicked() {
    if (!this.disableCommunityAttachments && !this.hideAttachmentWarning) {
      this.openWarningModal();
    } else if (!this.disableCommunityAttachments && this.showFileDownloadSecurityWarning) {
      this.openFileDownloadSecurityWarning();
    }
  }

  openWarningModal() {
    this.onAttachmentClickedEvent.emit(this.ATTACHMENT_DOWNLOAD_URL_PREFIX + this.attachment.CloudFileName);
  }

  openFileDownloadSecurityWarning() {
    this.store.dispatch(new fromCommunityFileDownloadSecurityWarningActions.OpenCommunityFileDownloadSecurityWarningModal(
      { downloadId: this.ATTACHMENT_DOWNLOAD_URL_PREFIX + this.attachment.CloudFileName, downloadType: DownloadTypeEnum.CommunityAttachment }));
  }

  getDownloadUrl() {
      return this.ATTACHMENT_DOWNLOAD_URL_PREFIX + this.attachment.CloudFileName;
  }

  setupIcons () {
    switch (this.attachment.FileType && this.attachment.FileType.toLocaleLowerCase()) {
      case AttachmentFileType.Word.toLocaleLowerCase():
        this.iconFile = 'file-word';
        this.iconClass = 'word';
        break;
      case AttachmentFileType.Pdf.toLocaleLowerCase():
        this.iconFile = 'file-pdf';
        this.iconClass = 'pdf';
        break;
      case AttachmentFileType.Excel.toLocaleLowerCase():
        this.iconFile = 'file-excel';
        this.iconClass = 'excel';
        break;
      case AttachmentFileType.Powerpoint.toLocaleLowerCase():
        this.iconFile = 'file-powerpoint';
        this.iconClass = 'powerpoint';
        break;
      case AttachmentFileType.Image.toLocaleLowerCase():
        this.iconFile = 'file-image';
        this.iconClass = 'image';
        break;
      default:
        this.iconFile = 'file';
        this.iconClass = 'file';
        break;
    }

    if (this.disableCommunityAttachments) {
      this.iconClass = `${this.iconClass} disabledIcon`;
    }
  }
}
