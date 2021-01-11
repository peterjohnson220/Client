import { Component, OnInit } from '@angular/core';

import { IconPrefix, IconName } from '@fortawesome/fontawesome-svg-core';

import { UserNotificationBaseComponent } from '../../user-notification-base/user-notification-base.component';
import { UserNotificationDisplay } from '../../../models';

@Component({
  selector: 'pf-pending-peer-job-matches-notification',
  templateUrl: '../user-notification-template.html'
})
export class PendingPeerJobMatchesNotificationComponent extends UserNotificationBaseComponent implements OnInit {
  NotificationTitle = 'Review Peer Matches';
  ButtonText = 'Review Matches';
  IconPrefix: IconPrefix = 'fas';
  IconName: IconName = 'exchange-alt';

  buildUserNotificationDisplay(): UserNotificationDisplay {
    const parsedMetaData = this.parseMetaData();


    return{
      Title: this.NotificationTitle,
      Message: parsedMetaData.Message,
      ButtonText: this.ButtonText,
      IsRead: this.UserNotification.IsRead,
      CreateDate: this.UserNotification.CreateDate,
      BaseUrl: parsedMetaData.Url,
      IconPrefix: this.IconPrefix,
      IconName: this.IconName,
      OpenLinkInNewTab: false
    };
  }

  parseMetaData(): any {
    if (!!this.UserNotification?.MetaData) {
      const json = JSON.parse(this.UserNotification.MetaData);
      const exchangeName = json['ExchangeName'];
      const exchangeId = json['ExchangeId'];
      const pendingMatchCount = json['PendingMatchCount'];

      const matchDynamic = pendingMatchCount > 1 ? 'Matches' : 'Match';

      return {
        Message: `You have ${pendingMatchCount} Peer ${matchDynamic} to review in ${exchangeName}`,
        Url: `${this.UserNotification.BaseUrl}${exchangeId}/manage?status=pending-review`
      };

    }
  }
}
