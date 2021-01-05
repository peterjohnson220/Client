import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AutoShareUser } from '../../../../../models/user-settings';

@Component({
  selector: 'pf-shareable-user',
  templateUrl: './shareable-user.component.html',
  styleUrls: ['./shareable-user.component.scss']
})
export class ShareableUserComponent {
  @Input() user: AutoShareUser;
  @Input() avatarUrl: string;

  @Output() toggleSelectedUser = new EventEmitter<AutoShareUser>();

  selectUserToggle(user: AutoShareUser) {
    const updatedUser = ({...user, IsSelected: !user.IsSelected});
    this.toggleSelectedUser.emit(updatedUser);
  }

}
