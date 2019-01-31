import { Component, Input, Output, EventEmitter } from '@angular/core';

import { CommunityReply } from 'libs/models/community';

@Component({
  selector: 'pf-community-post-replies',
  templateUrl: './community-post-replies.component.html',
  styleUrls: ['./community-post-replies.component.scss'],
})
export class CommunityPostRepliesComponent {
  @Input() replies: CommunityReply[];
  @Input() loading: boolean;
  @Output() replyHashTagClicked = new EventEmitter();

  constructor() {}

  handleReplyHashTagClicked(event: any) {
    this.replyHashTagClicked.emit(event);
  }
}
