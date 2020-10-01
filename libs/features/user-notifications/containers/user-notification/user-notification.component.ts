import { Component, Input } from '@angular/core';
import { UserNotification } from '../../models';

@Component({
  selector: 'pf-user-notification',
  templateUrl: './user-notification.component.html',
  styleUrls: ['./user-notification.component.scss']
})
export class UserNotificationComponent {

  @Input() UserNotification: UserNotification;

}
