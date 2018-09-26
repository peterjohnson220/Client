import { Component, Input } from '@angular/core';

import { CommunityReply } from 'libs/models/community';

@Component({
  selector: 'pf-community-post-replies',
  templateUrl: './community-post-replies.component.html',
  styleUrls: ['./community-post-replies.component.scss'],
})
export class CommunityPostRepliesComponent {
  @Input() replies: CommunityReply[];
  @Input() loading: boolean;

  constructor() {}

}
