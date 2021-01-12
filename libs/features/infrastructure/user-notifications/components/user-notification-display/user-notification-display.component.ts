import { Component, Input } from '@angular/core';

import { UserNotificationDisplay } from '../../models';
import { UserNotificationEventHelperService } from '../../helpers/user-notification-event-helper-service';

@Component({
  selector: 'pf-user-notification-display',
  templateUrl: './user-notification-display.component.html',
  styleUrls: ['./user-notification-display.component.scss']
})
export class UserNotificationDisplayComponent {

  @Input() UserNotificationDisplay: UserNotificationDisplay;
  constructor(private userNotificationEventHelperService: UserNotificationEventHelperService) { }

  onClicked() {
    this.UserNotificationDisplay.IsRead = true;

  }

  closePopover() {
    this.userNotificationEventHelperService.closePopoverEvent();
  }
}
