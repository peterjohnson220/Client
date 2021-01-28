import { Component, Input, OnInit } from '@angular/core';

import { CloudFileLocations } from 'libs/constants/cloud-file-locations';
import { UserContext } from 'libs/models';

@Component({
  selector: 'pf-layout-wrapper-user-menu-avatar',
  templateUrl: './user-menu-avatar.component.html',
  styleUrls: ['./user-menu-avatar.component.scss']
})
export class UserMenuAvatarComponent implements OnInit {

  @Input() userContext: UserContext;
  avatarUrl: string;

  constructor() { }

  ngOnInit() {
    this.avatarUrl = this.userContext.ConfigSettings.find(c => c.Name === 'CloudFiles_PublicBaseUrl')?.Value + CloudFileLocations.UserAvatars;
  }
}
