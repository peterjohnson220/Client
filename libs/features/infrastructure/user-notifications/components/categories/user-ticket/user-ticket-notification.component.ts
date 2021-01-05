import { Component } from '@angular/core';

import { IconPrefix, IconName } from '@fortawesome/fontawesome-svg-core';

import { UserNotificationBaseComponent } from '../../user-notification-base/user-notification-base.component';
import { UserNotificationDisplay } from '../../../models';

@Component({
  selector: 'pf-user-ticket-notification',
  templateUrl: '../user-notification-template.html'
})
export class UserTicketNotificationComponent extends UserNotificationBaseComponent {

  NotificationTitle = 'Ticket Status Updated';
  ButtonText = 'View Ticket';
  IconPrefix: IconPrefix = 'far';
  IconName: IconName = 'question-square';

  buildUserNotificationDisplay(): UserNotificationDisplay {
    return {
      Title: this.NotificationTitle,
      Message: this.parseMetaData(),
      ButtonText: this.ButtonText,
      IsRead: this.UserNotification.IsRead,
      CreateDate: this.UserNotification.CreateDate,
      BaseUrl: this.UserNotification.BaseUrl,
      IconPrefix: this.IconPrefix,
      IconName: this.IconName,
      OpenLinkInNewTab: false
    };
  }

  parseMetaData(): string {
    if (!!this.UserNotification?.MetaData) {
      const json = JSON.parse(this.UserNotification.MetaData);
      const ticketTitle = json['TicketTitle'];
      const ticketStatus = json['UserTicketState'];

      return `Your ticket for <i>${ticketTitle}</i> is now <i>${ticketStatus}</i>`;
    }
   return;
  }
}
