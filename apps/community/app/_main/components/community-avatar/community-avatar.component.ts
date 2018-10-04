import { Component, OnInit, Input } from '@angular/core';
import { environment } from 'environments/environment';

@Component({
  selector: 'pf-community-avatar',
  templateUrl: './community-avatar.component.html',
  styleUrls: ['./community-avatar.component.scss']
})
export class CommunityAvatarComponent {

  @Input() AvatarSource: string;
  @Input() UserFirstName: string;
  @Input() UserLastName: string;
  @Input() IsReply = false;

  avatarUrl = environment.avatarSource;
}
