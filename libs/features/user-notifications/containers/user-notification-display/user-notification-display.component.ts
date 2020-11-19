import { Component, Input } from '@angular/core';

import { UserNotificationDisplay } from '../../models';

@Component({
  selector: 'pf-user-notification-display',
  templateUrl: './user-notification-display.component.html',
  styleUrls: ['./user-notification-display.component.scss']
})
export class UserNotificationDisplayComponent {

  @Input() UserNotificationDisplay: UserNotificationDisplay;
  constructor() { }
}
