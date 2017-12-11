import { Component, Input } from '@angular/core';

import { environment } from 'environments/environment';

import { UserContext } from 'libs/models';

@Component({
  selector: 'pf-layout-wrapper-user-menu-avatar',
  templateUrl: './user-menu-avatar.component.html',
  styleUrls: ['./user-menu-avatar.component.scss']
})
export class UserMenuAvatarComponent {

  avatarUrl = environment.avatarSource;
  @Input() userContext: UserContext;

  constructor() { }

}
