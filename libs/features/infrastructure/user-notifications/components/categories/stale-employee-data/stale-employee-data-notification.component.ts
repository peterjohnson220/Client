import { Component, OnInit } from '@angular/core';

import { IconPrefix, IconName } from '@fortawesome/fontawesome-svg-core';

import { UserNotificationBaseComponent } from '../../user-notification-base/user-notification-base.component';
import { UserNotificationDisplay } from '../../../models';

@Component({
  selector: 'pf-stale-employee-data-notification',
  templateUrl: '../user-notification-template.html'
})
export class StaleEmployeeDataNotificationComponent extends UserNotificationBaseComponent implements OnInit {
  IconPrefix: IconPrefix = 'far';
  IconName: IconName = 'question-square';

  buildUserNotificationDisplay(): UserNotificationDisplay {
    return {
      Id: this.UserNotification.Id,
      Title: 'Update Your Employee Data',
      Message: 'Keep your analysis up-to-date by uploading new employee data as your data is now older than 90 days',
      ButtonText : 'Upload Data',
      IsRead: this.UserNotification.IsRead,
      CreateDate: this.UserNotification.CreateDate,
      BaseUrl: `${this.UserNotification.BaseUrl}?newTicket=true`,
      IconPrefix: this.IconPrefix,
      IconName: this.IconName,
      OpenLinkInNewTab: false
    };
  }

  parseMetaData(): any {

  }

}
