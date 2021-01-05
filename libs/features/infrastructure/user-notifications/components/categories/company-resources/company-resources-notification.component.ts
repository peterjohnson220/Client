import { Component } from '@angular/core';

import { IconPrefix, IconName } from '@fortawesome/fontawesome-svg-core';

import { UserNotificationBaseComponent } from '../../user-notification-base/user-notification-base.component';
import { UserNotificationDisplay } from '../../../models';

@Component({
  selector: 'pf-company-resources-notification',
  templateUrl: '../user-notification-template.html'
})
export class CompanyResourcesNotificationComponent extends UserNotificationBaseComponent {

  NotificationTitle = 'New Resource Available';
  ButtonText = 'View Resource';
  IconPrefix: IconPrefix = 'fal';
  IconName: IconName = 'newspaper';

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
      const createdBy = json['CreatedBy'];
      if (!createdBy?.length) {
        return `A new company resources was uploaded`;
      }

      return `<strong>${createdBy}</strong> uploaded a new company resource`;
    }
   return;
  }
}
