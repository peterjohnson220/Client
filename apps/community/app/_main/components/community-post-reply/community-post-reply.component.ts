import { Component, Input } from '@angular/core';

import { CommunityReply } from 'libs/models/community';
import { environment } from 'environments/environment';
import { escapeSpecialHtmlCharacters } from 'libs/core/helpers/community.helper';

@Component({
  selector: 'pf-community-post-reply',
  templateUrl: './community-post-reply.component.html',
  styleUrls: ['./community-post-reply.component.scss'],
})
export class CommunityPostReplyComponent {
  @Input() reply: CommunityReply;
  avatarUrl = environment.avatarSource;
  constructor() {}

  escapeHtml(unsafe) {
    return escapeSpecialHtmlCharacters(unsafe);
 }
}
