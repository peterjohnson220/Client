import { Component, Input } from '@angular/core';

import { CommunityReply } from 'libs/models/community';
import { environment } from 'environments/environment';

@Component({
  selector: 'pf-community-post-replies',
  templateUrl: './community-post-replies.component.html',
  styleUrls: ['./community-post-replies.component.scss']
})
export class CommunityPostsRepliesComponent  {
  @Input() replies: CommunityReply[];
  avatarUrl = environment.avatarSource;
  constructor() {}
}
