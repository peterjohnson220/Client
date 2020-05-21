import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { CommunityAttachment } from 'libs/models/community/community-attachment.model';
import { AttachmentFileType } from '../../models/attachment-file-type.model';
import { CommunityConstants } from '../../models/community-constants';
import { formatBytes } from '../../helpers/model-mapping.helper';


@Component({
  selector: 'pf-community-attachment-edit',
  templateUrl: './community-attachment-edit.component.html',
  styleUrls: ['./community-attachment-edit.component.scss']
})
export class CommunityAttachmentEditComponent implements OnInit {

  @Input() attachment: CommunityAttachment;
  @Output() attachmentRemoved: EventEmitter<any> = new EventEmitter();

  iconClass: string;
  iconFile: string;
  formattedSize: string;

  maxNameSize = CommunityConstants.MAX_ATTACHMENT_NAME_LENGTH;

  constructor() { }

  ngOnInit() {
    this.setupIcons();
    this.formattedSize = formatBytes(this.attachment.Size);
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
      case AttachmentFileType.Image.toLocaleLowerCase():
        this.iconFile = 'file-image';
        this.iconClass = 'image';
        break;
      default:
        this.iconFile = 'file';
        this.iconClass = 'file';
        break;
    }
  }

  getToolTip() {
    return this.attachment && this.attachment.Name && this.attachment.Name.length > this.maxNameSize ? this.attachment.Name : '' ;
  }

  deleteFile(attachment) {
    this.attachmentRemoved.emit(attachment.CloudFileName);
  }
}
