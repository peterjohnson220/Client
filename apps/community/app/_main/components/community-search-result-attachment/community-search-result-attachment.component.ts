import { Component, Input } from '@angular/core';
import { CommunitySearchResultTypeEnum } from 'libs/models/community/community-constants.model';

@Component({
  selector: 'pf-community-search-result-attachment',
  templateUrl: './community-search-result-attachment.component.html',
  styleUrls: ['./community-search-result-attachment.component.scss']
})
export class CommunitySearchResultAttachmentComponent {

  @Input() searchTerm: string;
  @Input() attachments: any;

  attachmentType = CommunitySearchResultTypeEnum.Attachment;

  constructor() { }
}
