import { Component, Input } from '@angular/core';

import { CommunityUserInfo } from 'libs/models/community/community-user-info.model';

@Component({
  selector: 'pf-community-post-header',
  templateUrl: './community-post-header.component.html',
  styleUrls: ['./community-post-header.component.scss']
})
export class CommunityPostHeaderComponent  {
  @Input() user: CommunityUserInfo;
  @Input() time: any;
  @Input() isInternalOnly: boolean;
  constructor() {}
}
