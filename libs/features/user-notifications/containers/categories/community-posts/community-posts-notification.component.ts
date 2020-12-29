import { Component } from '@angular/core';

import { IconPrefix, IconName } from '@fortawesome/fontawesome-svg-core';

import { UserNotificationBaseComponent } from '../../user-notification-base/user-notification-base.component';
import { UserNotificationDisplay } from '../../../models';

@Component({
  selector: 'pf-community-posts-notification',
  templateUrl: '../user-notification-template.html'
})
export class CommunityPostsNotificationComponent extends UserNotificationBaseComponent {

  NotificationTitle = 'New Community Reply';
  ButtonText = 'View Post';
  IconPrefix: IconPrefix = 'fal';
  IconName: IconName = 'comment-alt-dots';

  buildUserNotificationDisplay(): UserNotificationDisplay {
    const parsedMetaData = this.parseMetaData();
    return {
      Title: this.NotificationTitle,
      Message: parsedMetaData.Message,
      ButtonText: this.ButtonText,
      IsRead: this.UserNotification.IsRead,
      CreateDate: this.UserNotification.CreateDate,
      BaseUrl: `${this.UserNotification.BaseUrl}${parsedMetaData.ReplyId}`,
      IconPrefix: this.IconPrefix,
      IconName: this.IconName,
      OpenLinkInNewTab: false
    };
  }

  parseMetaData(): any {
    if (!!this.UserNotification?.MetaData) {
      const json = JSON.parse(this.UserNotification.MetaData);
      const postBy = json['PostBy'];
      const replyBy = json['ReplyBy'];
      const postDate: Date = json['PostDate'];
      const isYourPost = !postBy?.length;
      const postByMessage = !isYourPost ? `${postBy}'s` : 'your';
      const message = `${replyBy} replied to ${postByMessage} post from ${postDate.toDateString()}`;

      return {
        Message: message,
        ReplyId: json['ReplyId']
      };
    }
   return;
  }
}
