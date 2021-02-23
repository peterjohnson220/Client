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
    const parsedMetaData = this.parseMetaData();
    return {
      Id: this.UserNotification.Id,
      Title: this.NotificationTitle,
      Message: parsedMetaData.Message,
      ButtonText: this.ButtonText,
      IsRead: this.UserNotification.IsRead,
      CreateDate: this.UserNotification.CreateDate,
      BaseUrl: this.UserNotification.BaseUrl + (parsedMetaData.TicketId ? '/' + parsedMetaData.TicketId : ''),
      IconPrefix: this.IconPrefix,
      IconName: this.IconName,
      OpenLinkInNewTab: false
    };
  }

  parseMetaData(): any {
    if (!!this.UserNotification?.MetaData) {
      const json = JSON.parse(this.UserNotification.MetaData);
      const ticketTitle = json['TicketTitle'];
      const ticketStatus = json['UserTicketState'];
      const ticketId = json['UserTicketId'];

      return {
        Message: `Your ticket for <i>${ticketTitle}</i> is now <i>${ticketStatus}</i>`,
        TicketId: ticketId
      };
    }
   return;
  }
}
