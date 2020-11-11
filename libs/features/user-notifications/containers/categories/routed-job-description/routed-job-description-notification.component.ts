import { Component, OnInit } from '@angular/core';

import { IconPrefix, IconName } from '@fortawesome/fontawesome-svg-core';

import { UserNotificationBaseComponent } from '../../user-notification-base/user-notification-base.component';
import { UserNotificationDisplay } from '../../../models';

@Component({
  selector: 'pf-routed-job-description-notification',
  templateUrl: '../user-notification-template.html'
})
export class RoutedJobDescriptionNotificationComponent extends UserNotificationBaseComponent implements OnInit {

  NotificationTitle = 'Job Description for Review';
  ButtonText = 'Review Job Description';
  IconPrefix: IconPrefix = 'far';
  IconName: IconName = 'file-alt';

  buildUserNotificationDisplay(): UserNotificationDisplay {
    const parsedMetaData = this.parseMetaData();
    return {
      Title: this.NotificationTitle,
      Message: parsedMetaData.Message,
      ButtonText : this.ButtonText,
      IsRead: this.UserNotification.IsRead,
      CreateDate: this.UserNotification.CreateDate,
      BaseUrl: parsedMetaData.Url,
      IconPrefix: this.IconPrefix,
      IconName: this.IconName,
      OpenLinkInNewTab: true
    };
  }

  parseMetaData(): any {
    if (!!this.UserNotification?.MetaData) {
      const json = JSON.parse(this.UserNotification.MetaData);
      const jobTitle = json['JobTitle'];
      const url = json['Url'];

      return {
        Message: `A job description for ${jobTitle} is available for review`,
        Url: url
      };
    }
  }

}
