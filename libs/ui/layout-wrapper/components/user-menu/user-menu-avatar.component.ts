import { Component, Input } from '@angular/core';

import { UserContext } from '../../../../models';

@Component({
  selector: 'pf-layout-wrapper-user-menu-avatar',
  templateUrl: './user-menu-avatar.component.html',
  styleUrls: ['./user-menu-avatar.component.scss']
})
export class UserMenuAvatarComponent {

  @Input() avatarSource: string;
  @Input() userContext: UserContext;

  constructor() { }

}
