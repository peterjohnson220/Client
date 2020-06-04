import { Component, Input, Output, EventEmitter } from '@angular/core';

import { CommunityReply } from 'libs/models/community';
import { environment } from 'environments/environment';

@Component({
  selector: 'pf-community-post-reply',
  templateUrl: './community-post-reply.component.html',
  styleUrls: ['./community-post-reply.component.scss'],
})
export class CommunityPostReplyComponent {
  @Input() reply: CommunityReply;
  @Input() disableCommunityAttachments: boolean;
  @Output() replyHashTagClicked = new EventEmitter();
  avatarUrl = environment.avatarSource;
  constructor() {}

  handleHashTagClicked(event: any) {
    this.replyHashTagClicked.emit(event);
  }
}
