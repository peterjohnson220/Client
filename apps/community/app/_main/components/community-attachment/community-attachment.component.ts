import { Component, OnInit, Input } from '@angular/core';
import { CommunityAttachment } from 'libs/models/community/community-attachment.model';
import { AttachmentFileType } from '../../models/attachment-file-type.model';

@Component({
  selector: 'pf-community-attachment',
  templateUrl: './community-attachment.component.html',
  styleUrls: ['./community-attachment.component.scss']
})
export class CommunityAttachmentComponent implements OnInit {

  @Input() attachment: CommunityAttachment;

  iconClass: string;
  iconFile: string;

  maxNameSize = 20;

  constructor() { }

  ngOnInit() {
    this.setupIcons();
  }

  getDownloadUrl() {
      return `/odata/CloudFiles.DownloadCommunityAttachment?FileName=${this.attachment.CloudFileName}`;
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

}
