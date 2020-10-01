import { UserNotificationResponse } from '../../../models/payfactors-api/notifications/response';
import { UserNotification } from '../models';

export class PayfactorsApiModelMapper {
  static mapUserNotificationResponsesUserNotifications(response: UserNotificationResponse[]): UserNotification[] {
  return response.map(e => {
    return {
      Id: e.Id,
      UserId: e.UserId,
      NotificationId: e.NotificationId,
      NotificationCategoryId: e.NotificationCategoryId,
      NotificationLevel: e.NotificationLevel,
      Title: e.Title,
      Message: e.Message,
      BaseUrl: e.BaseUrl,
      EnableHtml: e.EnableHtml,
      IsRead: e.IsRead,
      IsSeen: e.IsSeen,
      ShowBadge: e.ShowBadge,
      CreateDate: e.CreateDate
    };
  });
}
}
