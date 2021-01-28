import { UserNotification } from '../models';

import { UserNotificationResponse } from 'libs/models/payfactors-api/notifications/response';

export class PayfactorsApiModelMapper {
  static mapUserNotificationResponsesUserNotifications(response: UserNotificationResponse[]): UserNotification[] {
  return response.map(e => {
    return {
      Id: e.Id,
      UserId: e.UserId,
      NotificationId: e.NotificationId,
      NotificationCategoryId: e.NotificationCategoryId,
      LookupKey: e.LookupKey,
      NotificationLevel: e.NotificationLevel,
      BaseUrl: e.BaseUrl,
      EnableHtml: e.EnableHtml,
      IsRead: e.IsRead,
      IsSeen: e.IsSeen,
      ShowBadge: e.ShowBadge,
      CreateDate: e.CreateDate,
      MetaData : e.MetaData
    };
  });
}
}
