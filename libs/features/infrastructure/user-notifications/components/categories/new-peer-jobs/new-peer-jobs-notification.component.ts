import { Component, OnInit } from '@angular/core';

import { IconPrefix, IconName } from '@fortawesome/fontawesome-svg-core';

import { UserNotificationBaseComponent } from '../../user-notification-base/user-notification-base.component';
import { UserNotificationDisplay } from '../../../models';

@Component({
  selector: 'pf-new-peer-jobs-notification',
  templateUrl: '../user-notification-template.html'
})
export class NewPeerJobsNotificationComponent extends UserNotificationBaseComponent implements OnInit {
  IconPrefix: IconPrefix = 'fas';
  IconName: IconName = 'exchange-alt';

  buildUserNotificationDisplay(): UserNotificationDisplay {
    const parsedMetaData = this.parseMetaData();
    return {
      Title: parsedMetaData.NotificationTitle,
      Message: parsedMetaData.Message,
      ButtonText : parsedMetaData.ButtonText,
      IsRead: this.UserNotification.IsRead,
      CreateDate: this.UserNotification.CreateDate,
      BaseUrl: `${this.UserNotification.BaseUrl}${parsedMetaData.UrlSuffix}`,
      IconPrefix: this.IconPrefix,
      IconName: this.IconName,
      OpenLinkInNewTab: false
    };
  }

  parseMetaData(): any {
    if (!!this.UserNotification?.MetaData) {
      const json = JSON.parse(this.UserNotification.MetaData);
      const exchangeJobTitle = json['ExchangeJobTitle'];
      const exchangeName = json['ExchangeName'];
      const exchangeId = json['ExchangeId'];
      const hasJobTitle = !!exchangeJobTitle?.length;
      const messagePrefix = hasJobTitle ? exchangeJobTitle : 'New Jobs';
      const exchangeTabQuery = 'pageView=exchange';
      let queryStringParams = hasJobTitle ? `jobTitle=${exchangeJobTitle}` : 'status=new';
      queryStringParams = `${queryStringParams}&${exchangeTabQuery}`;
      const urlSuffix = `${exchangeId}/manage?${queryStringParams}`;
      return {
        Message: `Review and match to new Peer Job${!hasJobTitle ? 's' : ''}`,
        NotificationTitle: `${messagePrefix} Available in ${exchangeName}`,
        ButtonText: hasJobTitle ? 'View Job' : 'View Jobs',
        UrlSuffix: urlSuffix
      };
    }
  }

}
